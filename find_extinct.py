#!/usr/bin/env python3
"""
Classify each clade in parent.js as extinct or extant using Wikidata.

Strategy:
1. Parse parent.js and id_to_title.js to get the game's taxonomy tree.
2. Query Wikidata SPARQL for all extinct taxa using transitive class
   matching: P31/P279* Q98961713 catches "extinct taxon", "fossil taxon",
   and any other subclass. Also check P141 (conservation status) = Q237350.
3. Do NOT propagate extinction downward (birds are extant dinosaurs).
   Instead, propagate upward: if ALL children of a node in our tree are
   extinct, and the node itself has no title (not directly guessable),
   mark it as extinct too.
4. For each extant taxon, find a leaf-level extant species name as a
   counterexample ("this clade isn't extinct because X is still alive").
5. Output extinct.js with the classification data.

Usage:
    python3 find_extinct.py
"""

import json
import sys
import time
from collections import defaultdict

import requests

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
SPARQL_HEADERS = {
    "User-Agent": "AnimalistExtinctBot/1.0 (https://github.com/animalist; educational project)",
    "Accept": "application/json",
}


def parse_js_object(filepath):
    """Parse a JS file of the form VARNAME={...} into a Python dict."""
    with open(filepath, "r") as f:
        content = f.read()
    start = content.index("{")
    end = content.rindex("}") + 1
    return json.loads(content[start:end])


def sparql_query_paginated(query_template, page_size=500_000):
    """
    Run a SPARQL SELECT query with LIMIT/OFFSET pagination.
    query_template should contain {limit} and {offset} placeholders.
    Returns a set of Q-IDs.
    """
    results = set()
    offset = 0
    while True:
        query = query_template.format(limit=page_size, offset=offset)
        print(f"  SPARQL query: offset={offset}, limit={page_size} ...")

        for attempt in range(5):
            try:
                resp = requests.get(
                    SPARQL_ENDPOINT,
                    params={"query": query},
                    headers=SPARQL_HEADERS,
                    timeout=300,
                )
                if resp.status_code == 429:
                    wait = 2 ** (attempt + 1)
                    print(f"  Rate limited, waiting {wait}s ...")
                    time.sleep(wait)
                    continue
                if resp.status_code == 500 and "timeout" in resp.text.lower():
                    print(f"  Server timeout, retrying ...")
                    time.sleep(2 ** (attempt + 1))
                    continue
                resp.raise_for_status()
                break
            except requests.exceptions.RequestException as e:
                wait = 2 ** (attempt + 1)
                print(f"  Request error: {e}, retrying in {wait}s ...")
                time.sleep(wait)
        else:
            print(f"  FATAL: Failed after 5 attempts at offset={offset}")
            sys.exit(1)

        data = resp.json()
        bindings = data["results"]["bindings"]
        page_qids = set()
        for b in bindings:
            uri = b["item"]["value"]
            qid = uri.rsplit("/", 1)[-1]
            if qid.startswith("Q"):
                page_qids.add(qid)

        results |= page_qids
        print(f"    Got {len(page_qids)} results (total so far: {len(results)})")

        if len(bindings) < page_size:
            break
        offset += page_size
        time.sleep(2)

    return results


def get_extinct_qids():
    """Query Wikidata for all extinct taxa using transitive class matching."""

    # Query 1: P31/P279* Q98961713 — catches "extinct taxon", "fossil taxon", etc.
    print("Querying Wikidata for taxa with P31/P279* = extinct taxon ...")
    q1 = """
    SELECT ?item WHERE {{
      ?item wdt:P31/wdt:P279* wd:Q98961713 .
    }}
    LIMIT {limit} OFFSET {offset}
    """
    extinct_p31 = sparql_query_paginated(q1)
    print(f"Found {len(extinct_p31)} taxa via transitive P31 extinct class.\n")

    time.sleep(5)

    # Query 2: conservation status = extinct (Q237350)
    print("Querying Wikidata for taxa with P141 = extinct ...")
    q2 = """
    SELECT ?item WHERE {{
      ?item wdt:P141 wd:Q237350 .
    }}
    LIMIT {limit} OFFSET {offset}
    """
    extinct_p141 = sparql_query_paginated(q2)
    print(f"Found {len(extinct_p141)} taxa with conservation status 'extinct'.\n")

    combined = extinct_p31 | extinct_p141
    print(f"Combined unique extinct Q-IDs: {len(combined)}\n")
    return combined


def build_children_map(parent_map):
    """Build a reverse mapping: parent -> set of children."""
    children = defaultdict(set)
    for child, par in parent_map.items():
        children[par].add(child)
    return children


def propagate_extinction_up(extinct_set, children_map, all_qids):
    """
    Propagate extinction upward: if ALL children of a node in our tree
    are extinct, mark the node as extinct too. This catches clades that
    aren't directly tagged in Wikidata but contain only extinct members
    in our dataset.

    Only propagates through intermediate (non-leaf) nodes.
    """
    result = set(extinct_set)
    changed = True
    iteration = 0
    while changed:
        changed = False
        iteration += 1
        for node in all_qids:
            if node in result:
                continue
            kids = children_map.get(node, set())
            if kids and all(kid in result for kid in kids):
                result.add(node)
                changed = True
        if iteration % 5 == 0:
            print(f"  Upward propagation iteration {iteration}, extinct count: {len(result)}")
    print(f"  Upward propagation done after {iteration} iterations, extinct count: {len(result)}")
    return result


def find_extant_counterexamples(children_map, id_to_title, extinct_set):
    """
    For each extant taxon, find the name of a leaf-level extant species
    by walking down the tree.

    Returns dict: Q-ID -> name of an extant leaf species within that clade.
    """
    cache = {}

    def find_extant_leaf(qid):
        if qid in cache:
            return cache[qid]
        if qid in extinct_set:
            cache[qid] = None
            return None

        kids = children_map.get(qid, set())
        if not kids:
            name = id_to_title.get(qid)
            cache[qid] = (qid, name) if name else None
            return cache[qid]

        for child in kids:
            result = find_extant_leaf(child)
            if result:
                cache[qid] = result
                return result

        cache[qid] = None
        return None

    old_limit = sys.getrecursionlimit()
    sys.setrecursionlimit(max(old_limit, 100_000))

    counterexamples = {}
    game_qids = set(id_to_title.keys())
    extant_game_qids = game_qids - extinct_set

    print(f"Finding extant counterexamples for {len(extant_game_qids)} extant taxa ...")
    for i, qid in enumerate(extant_game_qids):
        if i % 50000 == 0 and i > 0:
            print(f"  Processed {i}/{len(extant_game_qids)} ...")
        result = find_extant_leaf(qid)
        if result:
            leaf_qid, leaf_name = result
            if leaf_qid != qid and leaf_name:
                counterexamples[qid] = leaf_name

    sys.setrecursionlimit(old_limit)
    return counterexamples


def main():
    print("=== Animalist Extinct Taxa Finder ===\n")

    # Step 1: Parse game data
    print("Parsing parent.js ...")
    parent_map = parse_js_object("parent.js")
    print(f"  {len(parent_map)} entries in taxonomy tree.\n")

    print("Parsing id_to_title.js ...")
    id_to_title = parse_js_object("id_to_title.js")
    print(f"  {len(id_to_title)} entries with titles.\n")

    # Step 2: Query Wikidata
    wikidata_extinct = get_extinct_qids()

    # Step 3: Intersect with our game's Q-IDs
    all_qids = set(parent_map.keys()) | set(parent_map.values()) | set(id_to_title.keys())
    all_qids = {q for q in all_qids if q.startswith("Q")}

    directly_extinct = wikidata_extinct & all_qids
    print(f"Directly extinct in our dataset: {len(directly_extinct)}")

    # Step 4: Propagate upward — if all children extinct, parent is too
    children_map = build_children_map(parent_map)
    print("Propagating extinction upward ...")
    extinct_full = propagate_extinction_up(directly_extinct, children_map, all_qids)
    print(f"Total extinct Q-IDs in game (after upward propagation): {len(extinct_full)}")

    game_qids = set(id_to_title.keys())
    extinct_game_taxa = extinct_full & game_qids
    extant_game_taxa = game_qids - extinct_full
    print(f"  Extinct taxa with titles (guessable): {len(extinct_game_taxa)}")
    print(f"  Extant taxa with titles (guessable): {len(extant_game_taxa)}\n")

    # Step 5: Find extant counterexamples
    counterexamples = find_extant_counterexamples(
        children_map, id_to_title, extinct_full
    )
    print(f"Found counterexamples for {len(counterexamples)} extant taxa.\n")

    # Step 6: Output extinct.js
    # EXTINCT maps Q-IDs to:
    #   true   — taxon is extinct
    #   string — taxon is extant; string is name of a living species in it
    output = {}
    for qid in extinct_game_taxa:
        output[qid] = True
    for qid in counterexamples:
        output[qid] = counterexamples[qid]

    # EXTINCT_ANCESTORS: extinct Q-IDs that aren't directly guessable
    # (needed for ancestry checking in the game)
    extinct_ancestors = extinct_full - game_qids
    ancestor_list = sorted(extinct_ancestors)

    js_lines = ["EXTINCT={"]
    for qid in sorted(output.keys()):
        val = output[qid]
        if val is True:
            js_lines.append(f' "{qid}": true,')
        else:
            escaped = val.replace("\\", "\\\\").replace('"', '\\"')
            js_lines.append(f' "{qid}": "{escaped}",')
    js_lines.append("}")
    js_lines.append("")
    js_lines.append("EXTINCT_ANCESTORS=new Set([")
    for qid in ancestor_list:
        js_lines.append(f' "{qid}",')
    js_lines.append("])")

    with open("extinct.js", "w") as f:
        f.write("\n".join(js_lines) + "\n")

    print(f"Wrote extinct.js with {len(output)} game entries "
          f"and {len(ancestor_list)} ancestor entries.")

    # Sanity checks with well-known animals
    print("\n=== Sanity checks ===")
    checks = [
        ("Q43502", "Dodo", True),
        ("Q3699044", "Woolly mammoth", True),
        ("Q14332", "Tyrannosaurus", True),
        ("Q191968", "Passenger pigeon", True),
        ("Q45969", "Quagga", True),
        ("Q100196", "Archaeopteryx", True),
        ("Q140", "Lion", False),
        ("Q5113", "Bird", False),
        ("Q729", "Animal", False),
        ("Q7380", "Gorilla", False),
        ("Q430", "Dinosaur", False),  # Contains birds!
    ]
    for qid, name, expected_extinct in checks:
        actual = qid in extinct_full
        status = "PASS" if actual == expected_extinct else "FAIL"
        label = "extinct" if actual else "extant"
        print(f"  [{status}] {name} ({qid}): {label}"
              f"{'' if actual == expected_extinct else ' (EXPECTED ' + ('extinct' if expected_extinct else 'extant') + ')'}")

    # Sample output
    print("\nSample extinct taxa:")
    count = 0
    for qid in sorted(extinct_game_taxa):
        name = id_to_title.get(qid, "?")
        if name != "?":
            print(f"  {qid}: {name}")
            count += 1
            if count >= 20:
                break

    print("\nSample extant taxa with counterexamples:")
    count = 0
    for qid in sorted(counterexamples):
        name = id_to_title.get(qid, "?")
        if name != "?":
            print(f"  {qid} ({name}): still has {counterexamples[qid]}")
            count += 1
            if count >= 20:
                break


if __name__ == "__main__":
    main()
