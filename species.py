'''
Datamines a bunch of stuff to make the animal lists.
Currently disorganized.
'''

# todo: if multiple taxons have the same name, prioritize the.... higher one, i guess. like Anthophila.
# todo: trim taxons that don't have enwiki articles and also have no descendants with enwiki articles. no wait don't i already do this
# todo: fix genus Mustela Q28521 English alias
# gecko vs gekkota
# todo: check P31 for cryptid to avoid Caddy
# todo: remove duplicate: wasp vs wasps
# todo: fix "you left out mouse"
# todo: list times in settings when locked

import xml.etree.ElementTree as ET
import json
import bz2
from pprint import pprint
import time
from math import inf
import wikitextparser
import gzip
import re

t0 = time.time()
HTML_COMMENT_PATTERN = re.compile(r'<!--[\s\S]+?-->') # naïve?
q=quit

BIOTA='Q2382443'
ANIMALIA='Q729'
PARENT_TAXON='P171'
TAXON_KNOWN_BY_THIS_COMMON_NAME='P13176'
COMMON_NAME='P1843'
LANG='en'

# export these
id_to_parent = {}
id_to_title = {}
lower_title_to_id = {}

id_to_aliases = {}

print('Mining wikidata for parentages and enwiki sitelinks.')

mi = inf
i = 0

ENWIKI_DUMP_PATH = 'enwiki-20251120-pages-articles-multistream.xml.bz2'

def json_dumps_sans_keyquotes(d):
    return '{'+''.join('\n '+k+':"'+v+'"')+'\n}'

def low(s): return s.replace("-"," ").lower() # TODO use this
def old_low(s): return s.lower()


unsure_props = []
"""
Given a wikidatum and a Property ID, get the value of the property as a wikidata ID.
"""
def wikidatum_prop_entity(wikidatum, prop_id):
    expected_datatype = 'wikibase-item'
    expected_datavaluetype = 'wikibase-entityid'
    if prop_id not in wikidatum['claims']: return
    statements = wikidatum['claims'][prop_id]
    if not statements: return
    statements.sort(key=lambda statement:statement['rank'])
    if wikidatum['id']=='Q2102' and prop_id==TAXON_KNOWN_BY_THIS_COMMON_NAME: return 'Q25537662' # bad sorting
    statement = statements[-1]
    if statement['mainsnak']['snaktype'] == 'novalue':
        print(wikidatum['id'], 'has novalue for', prop_id)
        return
    if statement['mainsnak']['datatype'] != expected_datatype:
        print("?? non-"+expected_datatype," claim for", prop_id)
        return
    if 'datavalue' not in statement['mainsnak']:
        print(wikidatum['id'], 'missing datavalue in mainsnak for', prop_id)
        return
    if statement['mainsnak']['datavalue']['type'] != expected_datavaluetype:
        print("?? non-"+expected_datavaluetype, "mainsnak datavalue type?", prop_id)
        return
    if statement['mainsnak']['datavalue']['value']['entity-type'] != 'item':
        print("?? non-item mainsnak datavalue value entitytype?", prop_id)
        return
    if len(statements) > 1: unsure_props.append([wikidatum['id'], prop_id])
    return statement['mainsnak']['datavalue']['value']['id']


"""
Given a wikidatum and a Property ID, get the value of the property as text.
Just different enough from the above function to make for bothersome repetition.
"""
def wikidatum_prop_text(wikidatum, prop_id):
    expected_datatype = 'monolingualtext'
    expected_datavaluetype = 'monolingualtext'
    if prop_id not in wikidatum['claims']: return
    statements = wikidatum['claims'][prop_id]
    statements = [s for s in statements if s.get('mainsnak',{}).get('datavalue',{}).get('value',{}).get('language') == LANG]
    if not statements: return
    statements.sort(key=lambda statement:statement['rank'])
    statement = statements[-1]
    if statement['mainsnak']['snaktype'] == 'novalue':
        print(wikidatum['id'], 'has novalue for', prop_id)
        return
    if statement['mainsnak']['datatype'] != expected_datatype:
        print("?? non-"+expected_datatype," claim for", prop_id)
        return
    if 'datavalue' not in statement['mainsnak']:
        print(wikidatum['id'], 'missing datavalue in mainsnak for', prop_id)
        return
    if statement['mainsnak']['datavalue']['type'] != expected_datavaluetype:
        print("?? non-"+expected_datavaluetype, "mainsnak datavalue type?", prop_id)
        return
    return statement['mainsnak']['datavalue']['value']['text']

"""
Try getting names from a bunch of different places on the wikidatum.
"""
def wikidatum_names(wikidatum):
    names = []
    if LANG in wikidatum['labels']:
        names.append(wikidatum['labels'][LANG]['value'])
    if LANG in wikidatum['aliases']:
        names.extend(a['value'] for a in wikidatum['aliases'][LANG])
    taxon_common_name = wikidatum_prop_text(wikidatum, COMMON_NAME)
    if taxon_common_name: names.append(taxon_common_name)
    if wikidatum['id'] == 'Q15978631': names = [n for n in names if n not in ('man','men')]
    return names

def pages(path):
    i = 0
    with bz2.open(path,'rt') as file:
        next(file)
        chunk=''
        for line in file:
            if line=="  </siteinfo>\n": break
        for line in file:
            chunk += line
            if line=="  </page>\n":
                yield ET.fromstring(chunk)
                i += 1
                if i%100000==0: print('',i,'pages scanned so far...')
                #yield tree.find('title').text, tree.find('revision').find('text').text or ''
                chunk=''


id_to_persona_ids = {}
id_to_aliases = {} # taxon/persona id : list of aliases

i,j=0,0
if 0:
    print('Just trimming latest-all.')
    searchkeys = '"'+PARENT_TAXON+'"', '"'+TAXON_KNOWN_BY_THIS_COMMON_NAME+'"'
    with bz2.open('sources/latest-all.json.bz2', 'rt') as ifile:
        with open('intermediate/latest-all-trimmed.json','w') as ofile:
            for line in ifile:
                i += 1
                if any(s in line for s in searchkeys): # or referenced in enwiki props?
                    j += 1
                    if j%100000==0:print('So far,',i,'lines scanned,',j,'lines written...')
                    ofile.write(line)
    assert print('Done trimming.')


if 0:
    pgroup_name_to_taxon_name = {}
    print('Hunting paraphyletic groups.')
    import wikitextparser, re
    html_comment_pattern=HTML_COMMENT_PATTERN
    for tree in pages(ENWIKI_DUMP_PATH):
        title = tree.find('title').text
        if title.startswith('Wikipedia:') or title.startswith('Template:') or title.startswith('Draft:'): continue
        body = tree.find('revision').find('text').text
        if body is None: continue
        body = html_comment_pattern.sub('', body)
        parsed = wikitextparser.parse(body)
        templates = [t for t in parsed.templates if t.name.strip().lower() == 'paraphyletic group']
        if not templates: continue
        if len(templates)>1: print(' Multiple pgroup templates?',title,'has',len(templates))
        template_kv = {}
        for arg in templates[0].arguments:
            template_kv[arg.name.strip()] = arg.value.strip()
        if ('parent' not in template_kv) and ('taxon' not in template_kv):
            print(' Parent+taxonless pgroup?',title)
            continue
        taxon_name = template_kv.get('taxon') or template_kv['parent']
        pgroup_name_to_taxon_name[title] = taxon_name
        print('', title, '⇝', taxon_name)
        if template_kv.get('name') and not any(c in template_kv['name'] for c in '<{["'):
            pgroup_name_to_taxon_name[template_kv['name']] = taxon_name
            print(' ', template_kv['name'], '⇝', taxon_name)
    with open('intermediate/paraphyletics.json','w') as file:
        json.dump(pgroup_name_to_taxon_name, file, indent=1)
else:
    print('Loading preprocessed paraphyletic groups from paraphyletics.json.')
    with open('intermediate/paraphyletics.json') as file:
        pgroup_name_to_taxon_name = json.load(file)
    print(' Loaded paraphyletic groups.')



CATEGORYLINKS_SQL_GZ = 'enwiki-20251220-categorylinks.sql.gz'
if 0:
    # Example of how to get a linktarget ID from a category title:
    # cat sources/enwiki-*-linktarget.sql | sed 's/(/\n/g' | grep 14,Set_index_articles_on_animal_common_names
    SIAOACN_LINKTARGET = 66045319
    SIAOACN_LINKTARGET_SNAKES = 45414978
    SIAOACN_LINKTARGET_SPIDERS = 64955362
    SIAOACN_LINKTARGETS = set([SIAOACN_LINKTARGET, SIAOACN_LINKTARGET_SNAKES, SIAOACN_LINKTARGET_SPIDERS])
    siaoacn_ids = []
    i = 0
    with gzip.open(CATEGORYLINKS_SQL_GZ,'rb') as file:
        INSERT_INTO = b'INSERT INTO `categorylinks` VALUES ('
        #sqlblines = (i[len(INSERT_INTO):] for i in file if i.startswith(INSERT_INTO))
        for bline in file:
            i += 1
            if i%1000==0:print('',i,'lines of SQL read so far...')
            #bline = b''.join(c for c in bline if c in b"()1234567890,.'"
            #bline.replace("''","")
            if not bline.startswith(INSERT_INTO): continue
            bline = bline[len(INSERT_INTO):-3]
            bline = bline.replace(b"\\\\",b"")
            bline = bline.replace(b"\\'",b"")
            bline = re.sub(b"'.*?'", b'', bline)
            line = bline.decode()
            for entry in line.split('('):
                page_id,_,_,_,_,_,cat_id = entry[:-2].split(',')
                page_id, cat_id = int(page_id), int(cat_id)
                if cat_id not in SIAOACN_LINKTARGETS: continue
                siaoacn_ids.append(page_id)
    with open('intermediate/siaoacn_ids.json','w') as file:
        json.dump(siaoacn_ids,file)
else:
    with open('intermediate/siaoacn_ids.json','r') as file:
        siaoacn_ids = json.load(file)


if 0:
    i=0
    with bz2.open('latest-all.json.bz2', 'rt') as file:
        _=next(file)
        for line in file:
            if line=="]":
                print("EOF?")
                continue
            wikidatum = json.loads(line[:-2])
            i += 1
            if i%100000==0:print(i,'lines read....')
            instanceof = wikidatum_prop_entity(wikidatum, 'P31')
            if instanceof not in ('Q55983715','Q502895'): continue
            if not wikidatum_prop_entity(wikidatum, TAXON_KNOWN_BY_THIS_COMMON_NAME):
                print('Taxonless common name:',wikidatum['id'],'/'.join(wikidatum_names(wikidatum)))
            if wikidatum['id']=='Q188212':e()




print('Reading latest-all-trimmed.json.')
#with bz2.open('latest-all.json.bz2', 'rt') as file:
with open('intermediate/latest-all-trimmed.json') as file:
    #_=next(file)
    for line in file:
        if line=="]":
            print("EOF?")
            continue
        wikidatum = json.loads(line[:-2])
        i += 1
        if i%100000==0:print(i,'lines read....')
        if wikidatum['type'] == 'property': continue
        if wikidatum['id'] in [
            'Q48428', # Birds of prey
            'Q43806', # Invertebrate
            'Q693690' # Bull
        ]: continue
        parent_id = wikidatum_prop_entity(wikidatum, PARENT_TAXON)
        # todo can remove next wikidata refresh
        if wikidatum['id']=='Q76824533': parent_id='Q11878382'
        if parent_id: id_to_parent[wikidatum['id']] = parent_id
        aka_taxon_id = wikidatum_prop_entity(wikidatum, TAXON_KNOWN_BY_THIS_COMMON_NAME)
        # WOULD BE FIXED BY getting taxon from enwiki page instead of multiply-valued TKBYCN
        if wikidatum['id']=='Q7378':aka_taxon_id='Q2372824'
        if aka_taxon_id: id_to_persona_ids[aka_taxon_id] = id_to_persona_ids.get(aka_taxon_id, []) + [wikidatum['id']]
        if (not parent_id) and (not aka_taxon_id): continue
        aliases = wikidatum_names(wikidatum)
        id_to_aliases[wikidatum['id']] = id_to_aliases.get(wikidatum['id'], []) + aliases
        if 'enwiki' in wikidatum['sitelinks']:
            if parent_id: # if it's a taxon, make note of its title
                id_to_title[wikidatum['id']] = id_to_title.get(wikidatum['id']) or wikidatum['sitelinks']['enwiki']['title']
            if aka_taxon_id:
                # if it's some other thing (e.g. Cat) that a taxon (e.g. Felis catus) is Known As, then give the taxon its title
                # When both are available, these names tend to be better (see Sheep vs Ovis)
                id_to_title[aka_taxon_id] = wikidatum['sitelinks']['enwiki']['title']
        if i>mi:break


# Should be in wikidata but isn't
id_to_parent['Q188212'] = 'Q48178' # Tiger shark has incomplete ancestry otherwise


# currently unused
if 0:
    i = 0
    print('Mining Wikipedia Template:Taxonomies (temtaxes)')
    temtaxes = {}
    for p in pages('enwiki-20251120-pages-articles-multistream.xml.bz2'):
        title = p.find('title').text
        if not title.startswith('Template:Taxonomy/'): continue
        i+=1
        if i%100000==0: print('', i, 'wiki taxonomies found?')
        body = p.find('revision').find('text').text
        if body is None: continue
        body = HTML_COMMENT_PATTERN.sub('', body)
        # wikitextparser isn't very accurate so let's just wing this
        DETL = "{{Don't edit this line {{{machine code|}}}"
        if not DETL in body:
            print("NO DETL?",title)
            continue
        link = None
        parent = None
        for line in body.split(DETL,maxsplit=1)[1].split('\n'):
            line = line.strip()
            if line.startswith('|link='):
                link = line[6:].strip().split('|')[0]
            if line.startswith('|parent='):
                parent = line[9:].strip().split('/')[0]
        print('🌐',link,'∈',parent)
        if link is None: print(i,body)
        '''llink = low(link)
        lparent = low(parent)
        if llink not in lower_title_to_id:
            print('  missing llink??',llink)
            continue
        if lparent not in lower_title_to_id:
            print('  missing llink??',lparent)
            continue'''
        temtaxes[link] = parent
    with open('intermediate/temtax.json','w') as file:
        json.dump(temtaxes, file, indent=1)
else:
    with open('intermediate/temtax.json') as file:
        temtaxes = json.load(file)

if 0>9999:
    # Educate unsures?
    title_to_id = {}
    for id in id_to_title: title_to_id[id_to_title[id]] = id
    for title in id_to_title:
        if title in temtaxes:
            print('temtax found:',title, temtaxes[title])
            if temtaxes[title] not in title_to_id:
                print(' but',temtaxes[title],'not in title_to_id....')
                continue
            if id_to_parent[title_to_id[title]] == title_to_id[temtaxes[title]]:
                print(' temtax already matches')
                continue
            print(
                ' ♲ ','replacing',
                id_to_parent[title_to_id[title]], id_to_title[id_to_parent[title_to_id[title]]],
                'with',
                title_to_id[temtaxes[title]], title
            )

# It's possible that multiple wikidata entities point to the same enwiki page.
# In this case, we probably prefer the one that enwiki points back to wikidata.
# https://stackoverflow.com/questions/39838006/wikipedia-dump-all-page-titles-and-pageids

# wasp and paper wasp don't quite interfere


print(len(id_to_parent),'parentages.')

"""
Whether a taxon (identified by wikidata ID) is within Animalia.
"""
known_orphans = set()
known_loopers = set()
def is_animal(taxon_id, breadcrumbs=None):
    return is_descendant(taxon_id, ANIMALIA, breadcrumbs)
def is_descendant(taxon_id, ancestor_id, breadcrumbs=None):
    if taxon_id==ancestor_id: return True
    if taxon_id==BIOTA: return False
    if taxon_id not in id_to_parent:
        if taxon_id not in known_orphans:
            print("Can't find parent for",taxon_id,id_to_title.get(taxon_id,''))
            known_orphans.add(taxon_id)
        return False
    parent_id = id_to_parent[taxon_id]
    breadcrumbs = breadcrumbs or [taxon_id]
    if parent_id in breadcrumbs:
        if parent_id not in known_loopers:
            print("ERROR: parentage loop:",breadcrumbs)
            known_loopers.add(parent_id)
        return False
    breadcrumbs.append(parent_id)
    return is_descendant(parent_id, ancestor_id, breadcrumbs)

# Now filter taxonomy to just Animalia. Could be optimized.
print("Filtering taxonomy to Animalia.")
print(' Starting with taxon_to_parent size ',len(id_to_parent))
id_to_parent_trimmed = {}
for taxon_id in id_to_parent:
    if is_animal(taxon_id):
        id_to_parent_trimmed[taxon_id] = id_to_parent[taxon_id]
id_to_parent = id_to_parent_trimmed
print(' Taxonomy trimmed to Animalia; size',len(id_to_parent))


print('Hunting untitled taxons.')
# At this point, parent.js would be about 60mb for all animals.
# (For comparison, Outlook loads like 30mb on initial page load even when logged out.)
# But a lot of these taxons don't have enwiki sitelinks. Let's get rid of them to save space.

# First make a taxon-to-children lookup since this would be slow otherwise.
# todo maybe build this as building id_to_parent
print(' Indexing children.')
id_to_children = {}
for taxon_id in id_to_parent:
    if id_to_parent[taxon_id] not in id_to_children:
        id_to_children[id_to_parent[taxon_id]] = []
    id_to_children[id_to_parent[taxon_id]].append(taxon_id)

print(' Stitching out untitled taxons.')
for taxon_id in list(id_to_parent):
    # If this taxon has a Wikipedia article linked to the wikidatum, ignore it.
    if taxon_id in id_to_title: continue
    # Alternatively, if any *other* wikidatums cite this taxon as the taxon they're a common term for, and one of THOSE datums has an enwiki.
    if taxon_id in id_to_persona_ids and any((persona_id in id_to_title) for persona_id in id_to_persona_ids[taxon_id]): continue
    # This is some obscure taxon without a Wikipedia article, so let's delete it.
    if taxon_id in id_to_children:
        # If it's a parent taxon, promote its children.
        for child_id in id_to_children[taxon_id]:
            id_to_parent[child_id] = id_to_parent[taxon_id]
        id_to_children[id_to_parent[taxon_id]].extend(id_to_children[taxon_id])
        del id_to_children[taxon_id]
    del id_to_parent[taxon_id]
print(' New Animalia size:',len(id_to_parent))

del id_to_children # Don't need this index anymore.


# todo move this to later?
print('Discarding non-animal titles.')
id_to_title = {taxon_id: title for taxon_id, title in id_to_title.items() if taxon_id in id_to_parent}

print('Building lower title index.')
lower_title_to_id = {}
added_aliases={} # for debug
for taxon_id in id_to_title:
    # Annoyingly, wikidata has, for example, "felis catus" with taxonomy data but no enwiki link,
    # plus "Cat" with an enwiki link but no taxonomy data.
    # So stitch all that stuff together.
    lower_title_to_id[low(id_to_title[taxon_id])] = taxon_id # We definitely want to represent the main title if there is one
    # Now all the other stuff
    persona_ids = id_to_persona_ids.get(taxon_id, [])
    for persona_id in id_to_persona_ids.get(taxon_id, []):
        # These we're less sure about, so be timid. Unless?
        if persona_id not in id_to_title: continue
        lower_title = low(id_to_title[persona_id])
        if lower_title not in lower_title_to_id: lower_title_to_id[lower_title] = taxon_id
    # Ok, now all the Aliases of the taxon, plus all the Aliases of all the Common Terms pointing to this taxon.
    for taxon_or_persona_id in persona_ids + [taxon_id]:
        for alias in id_to_aliases.get(taxon_or_persona_id, []):
            alias = low(alias)
            if alias not in lower_title_to_id:
                lower_title_to_id[alias] = taxon_id
                added_aliases[alias] = taxon_id
                #print('added alias',alias,taxon_id)


lower_title_to_id['roach'] = 'Q25309'
lower_title_to_id['cockroach'] = 'Q25309'


# Ok, we have all we need from wikidata. Now mine enwiki
h={}



if 0:
    i = 0
    print('Mining enwiki redirects.')
    redirects = {} # redirects[source] = target
    for p in pages('enwiki-20251120-pages-articles-multistream.xml.bz2'):
        title = p.find('title').text
        #body = tree.find('revision').find('text')
        if title.startswith('Wikipedia:') or title.startswith('Template:') or title.startswith('Draft:') or title.startswith('Category:'): continue
        #
        #b=p.find('revision').find('text').text or ''
        #b = b.lstrip()
        #if ('#REDIRECT [[' in b) and not b.startswith('#REDIRECT [['):
        #    print('Unfirst REDIRECT directive in',title)
        #if b.startswith('#REDIRECT [['):
        #    t = b.split('[[',maxsplit=1)[1].split(']]',maxsplit=1)[0]
        #    if '#' in t:
        #        s[title.lower()]=t
        #        print(title,'→',t)
        #
        redirect_node = p.find('redirect')
        if redirect_node is not None:
            target = redirect_node.attrib.get('title')
            if target is None: print('no title in redirect node??',title)
            #target = b[12:].split(']]')[0].split('#')[0]
            redirects[title]=target
            i += 1
            if i%100000==0: print('', i, 'redirects found')
            if i>mi:break
            #print(target,'←',title)
    print(' Found',len(redirects),'redirects.')
    with open('intermediate/raw_redirects.json','w') as file:
        json.dump(redirects,file,indent=1)
else:
    print('Reading pre-mined enwiki redirects.')
    with open('intermediate/raw_redirects.json') as file:
        redirects = json.load(file)

del redirects['Man (anthropology and biology)']
del redirects['Man (species)']
del redirects['Mankind']




print('Adding redirector titles to lower title index.')
i = 0
for redirector in redirects:
    if low(redirects[redirector]) in lower_title_to_id:
        lower_title_to_id[low(redirector)] = lower_title_to_id[low(redirects[redirector])]
        i += 1
print('',i,'redirector titles indexed.')


print('Adding paraphyletic groups to lower title index.')
i = 0
for pgroup_name, taxon_name in pgroup_name_to_taxon_name.items():
    lower_pgroup_name = low(pgroup_name)
    if lower_pgroup_name in lower_title_to_id: continue # don't clobber
    lower_taxon_name = low(taxon_name)
    if lower_taxon_name not in lower_title_to_id: continue
    lower_title_to_id[lower_pgroup_name] = lower_title_to_id[lower_taxon_name]
    i += 1
    print('Paraphyletic redirect:',lower_pgroup_name,'to',lower_taxon_name,lower_title_to_id[lower_taxon_name])
print('',i,'paraphyletic titles indexed.')

print('Indexing "common " animals.')
for lt in list(lower_title_to_id):
    if lt.startswith('common ') and lt[7:] not in lower_title_to_id:
        #print('', lt)
        lower_title_to_id[lt[7:]] = lower_title_to_id[lt]


def first_bulleted_link(body):
    wikibody = wikitextparser.parse(body)
    p.append(wikibody)
    for section in wikibody.sections:
        if section.title and section.title.strip()=='See also': continue
        wikilists = section.get_lists()
        if not wikilists:
            #print('  No wikilists; continuing.')
            continue
        for wikilist in wikilists:
            while wikilist.sublists():
                wikilist = wikilist.sublists()[0]
                print('   Using sublist', wikilist)
            wikilistitems = wikilist.items
            if not wikilistitems:
                print('   No items in wikilist(??); continuing.')
                continue
            for wikilistitem in wikilistitems:
                wikilinks = wikitextparser.parse(wikilistitem).wikilinks
                if not wikilinks:
                    print('   wikilistitem lacks wikilinks:',wikilistitem)
                    continue
                link_title = wikilinks[0].title
                #print('  Ok, first wikilink in first wikilink-having wikilistitem points to:',link_title)
                #print('  So,', title, '→', link_title)
                return link_title

p=[] #debug
if 0:
    print('Scanning SIAOACNs & disambigs.')
    siaoacn_targets = {}
    disambig_targets = {}
    lower_titles = set(i.lower() for i in id_to_title.values())
    titles = set(id_to_title.values())
    for tree in pages(ENWIKI_DUMP_PATH):
        title = tree.find('title').text
        if title.startswith('Wikipedia:') or title.startswith('Template:') or title.startswith('Draft:'): continue
        page_id = int(tree.find('id').text)
        body = tree.find('revision').find('text').text
        if not body: continue
        lbody = body.lower()
        if page_id in siaoacn_ids: # SIAOACN
            print(' SIAOACN: ',title)
            print('  (Already indexed to '+id_to_title[lower_title_to_id[low(title)]]+'.)' if low(title) in lower_title_to_id else '  Not yet indexed')
            #body = html_comment_pattern.sub('', body)
            target = first_bulleted_link(body)
            if target:
                siaoacn_targets[title] = target
            else:
                print('  SIAOACN parse failed. 🟥')
        elif (
            '{{disambiguation}}' in lbody or
            '{{disambiguation|' in lbody or
            '{{disambig}}' in lbody or
            '{{disambig|' in lbody or
            '{{dab}}' in lbody or
            '{{dab|' in lbody
        ):
            target = first_bulleted_link(body)
            if not target: continue
            if target.lower() not in lower_titles and redirects.get(target) not in titles:
                continue # Ignore disambigs to non-animals
            if target:
                disambig_targets[title.split(" (disambiguation")[0]] = target
            else:
                print('  Disambiguation failed.')
    with open('intermediate/siaoacn_targets.json','w') as file:
        json.dump(siaoacn_targets, file, indent=1)
    with open('intermediate/disambig_targets.json','w') as file:
        json.dump(disambig_targets, file, indent=1)
else:
    print('Reading pre-scanned SIOACANs & disambigs.')
    with open('intermediate/siaoacn_targets.json') as file:
        siaoacn_targets = json.load(file)
    with open('intermediate/disambig_targets.json') as file:
        disambig_targets = json.load(file)

print('Indexing SIAOACNs.')
for siaoacn, target in siaoacn_targets.items():
    #print(' SIOACAN:',siaoacn,'→',target)
    if low(siaoacn) in lower_title_to_id:
        #print('  Refraining from overwriting', low(siaoacn), 'from', id_to_title[lower_title_to_id[low(siaoacn)]], 'to [[', target, ']].')
        continue
    if low(target) not in lower_title_to_id:
        #print('  Target',target,'not indexed.')
        continue
    #print('  Adding redirect.')
    lower_title_to_id[low(siaoacn)] = lower_title_to_id[low(target)]

print('Indexing disambigs.')
for disambig, target in disambig_targets.items():
    if len(disambig)<4: continue
    #print(' Disambig:',disambig,'→',target)
    disambig = low(disambig)
    if disambig in lower_title_to_id:
        #print('  Refraining from overwriting', disambig, 'from', id_to_title[lower_title_to_id[disambig]], 'to [[', target, ']].')
        continue
    #print('  Adding redirect.')
    lower_title_to_id[disambig] = lower_title_to_id[low(target)]

print('Adding redirector titles to lower title index again....')
i = 0
for redirector in redirects:
    if low(redirects[redirector]) in lower_title_to_id and low(redirector) not in lower_title_to_id and '(' not in redirector:
        lower_title_to_id[low(redirector)] = lower_title_to_id[low(redirects[redirector])]
        i += 1
print('',i,'redirector titles indexed.')

print('Adding deparentheticaled titles to lower title index.') # e.g. asp
i = 0
for lower_title in list(lower_title for lower_title in lower_title_to_id if ' (' in lower_title and lower_title.endswith(')')):
    deparentheticaled_lower_title = lower_title.split(' (')[0]
    if deparentheticaled_lower_title in lower_title_to_id: continue # don't clobber
    lower_title_to_id[deparentheticaled_lower_title] = lower_title_to_id[lower_title]
    i += 1
print('',i,'deparentheticaled titles indexed.')


lower_title_to_id['you'] = lower_title_to_id['human']
lower_title_to_id['rose'] = lower_title_to_id['human']
lower_title_to_id['vivian'] = lower_title_to_id['human']
lower_title_to_id['vivian rose'] = lower_title_to_id['human']
lower_title_to_id['featherless biped'] = lower_title_to_id['human']

# People can't get their mind off dogs. Politely remind them these are all the same animal.
DOGS = ['basset hound', 'bassethound', 'beagle', 'bloodhound', 'border collie', 'borzoi', 'boston terrier', 'boxer', 'bulldog', 'chihuahua', 'cocker spaniel', 'collie', 'corgi', 'dachshund', 'dalmatian', 'dalmation', 'doberman', 'dobermann', 'doge', 'foxhound', 'french bulldog', 'gazehound', 'german shepherd', 'great dane', 'greyhound', 'harehound', 'harrier', 'hound', 'husky', 'labrador', 'labrador retriever', 'lapdog', 'mastiff', 'mongrel', 'mudi', 'mutt', 'otterhound', 'pitbull', 'pomeranian', 'poodle', 'pug', 'rottweiler', 'saint bernard', 'samoyed', 'sheep dog', 'sheepdog', 'shiba inu', 'shih tzu', 'siberian husky', 'sled dog', 'st bernard', 'st. bernard', 'terrier', 'toy dog', 'toy poodle', 'wild dog', 'yorkshire terrier', 'golden retriever', 'yorkie', 'malamute', 'spaniel', 'schnauzer']
for dog in DOGS: lower_title_to_id[dog] = lower_title_to_id.get(dog, lower_title_to_id['dog'])
# Cats too
for cat in ('tabby','siamese'):
    lower_title_to_id[cat] = lower_title_to_id['cat']
    lower_title_to_id[cat+' cat'] = lower_title_to_id['cat']


for k,v in {
    # Easter eggs
    'dropbear': 'koala', 'drop bear':'koala',
    'longcat': 'cat',
    # Younglings
    'caterpillar': 'lepidoptera',
    'maggot': 'diptera',
    'calf': 'cow',
    'tadpole': 'frog',
    'puppy': 'dog',
    'kitty': 'cat', 'kitten': 'cat',
    'hellgrammite': 'dobsonfly',
    #'buzzard': 'common buzzard',
    #'grackle': 'common grackle',
    #'lioness': 'lion', # disambig?
    'bull': 'cow', 'dairy cow': 'cow', 'longhorn cow': 'cow',
    'cross fox': 'red fox',
    'highland cow': 'cow',
    'pony': 'horse', 'stallion': 'horse', 'shetland pony': 'horse', 'clydesdale': 'horse', 'arabian horse':'horse',
    'mustang': 'horse', 'shetland horse': 'horse', 'clydesdale horse':'horse',
    'mare': 'equine',
    'pygmy goat': 'goat', 'fainting goat':'goat', 'myotonic goat':'goat',
    'pheasant': 'common pheasant',
    'mackerel': 'atlantic mackerel',
    'grosbeak': 'evening grosbeak',
    'whydah': low('pin-tailed whydah'),
    'gnat': 'fungus gnat',
    'catbird': 'gray catbird',
    'wood pewee': 'pewee',
    'limpet': 'true limpet',
    'blue lobster': 'homarus gammarus',
    'honeypot ant': 'myrmecocystus',
    'kelp fly': 'coelopidae',
    'gadfly': 'botfly',
    'cucumber beetle': 'leaf beetle',
    'river dolphin': 'amazon river dolphin',
    'peppermint shrimp': 'lysmata',
    'bluet': 'coenagrion',
    'anemone':'sea anemone',
    'tetra': 'black neon tetra',
    'marlin': 'atlantic blue marlin',
    'man o war': 'portuguese man o war',
    'huntsman': 'huntsman spider',
    'komodo': 'komodo dragon',
    'fan coral': 'sea fan',
    'legless lizard': 'pygopodidae',
    'decorator crab': 'oregonia gracilis',
    'asian carp': 'black amur',
    'petrel': 'procellariiformes',
    'moray': 'moray eel', # otherwise goes to honeycomb moray fsr
    # Picking one
    'spitting cobra': 'rinkhals',
    'warbler': 'garden warbler',
    #'diamondback': 'diamondback rattlesnake', // TODO non-siaocab
    # Regular disambiguation pages
    'sand crab': 'hippoidea',
    'moonfish': 'opah',
    'waterbug': 'true water bug', 'water bug': 'true water bug',
    'bristletail': 'archaeognatha', # disambig w/o list
    'peeper': 'spring peeper',
    'mona': 'mona monkey', # stretch
    'pipi': 'paphies australis',
    'daddy long legs': 'opiliones', 'daddy longlegs': 'opiliones',
    #'rockhopper': 'rockhopper penguin', #dubious species but maybe should work?
    # these probably should have a wiki presence but they don't?
    'rubber ducky isopod': 'cubaris',
    'peacock jumping spider': 'peacock spider',
    'blue insularis': 'trimeresurus insularis',
    'ball bearing treehopper': 'bocydium globulare',
    'blue glass snail': 'nesovitrea binneyana',
    'phantom jellyfish': 'giant phantom jelly',
    'bloody belly comb jelly': 'bloodybelly comb jelly',
    'brazilian jewel tarantula':'typhochlaena seladonia',
    'brown wasp mantidfly':'wasp mantidfly',
    'garlic snail':'oxychilus alliarius','garlic glass snail':'oxychilus alliarius',
    'graceful decorator crab': 'oregonia gracilis',
    'fresh water crocodile': 'freshwater crocodile',
    'swamp hen': 'swamphen',
    'deep sea isopod': 'giant isopod',
    'woolly chafer': 'sparrmannia',
    'wooly chafer': 'sparrmannia',
    'woolly chafer beetle': 'sparrmannia',
    'wooly chafer beetle': 'sparrmannia',
    'tube worm': 'giant tube worm',
    'sea monkey': 'brine shrimp',
    'seamonkey' : 'brine shrimp', # todo why doesn't this work automatically
    'death feigning beetle': 'blue death feigning beetle', # there are others, actually.. todo fix this
    #'american possum': 'didelphimorphia', 'american opossum': 'didelphimorphia',
    #'australian opossum': 'phalangeriformes',
    # overrides
    'white owl': 'snowy owl',
    # would be solved by taking taxon from wikipedia instead of wikidata: elephant, neaderthal?
    'crab': 'brown crab',
}.items():
    lower_title_to_id[k] = lower_title_to_id[v]

print('Sorting wasps.')
# 'wasp' is paraphyletic.
# For most paraphyletic groups, we just consider them equivalent to their parent taxon.
# But if you do that with the wasps, it's like, come on, is an ant/bee really a wasp?
# It may be more reasonable to define 'wasp' as any Apocritan other than an ant or bee.
# So let's warp the taxonomy: promote ants (Formicidae) and bees (Anthophila) to siblings of Apocrita rather than descendants.
# Maybe we could do this systematically via taxonbox data?
# Also wikidata points "wasp" at Aculeata; let's point at Apocrita instead.
APOCRITA='Q22864'
lower_title_to_id['wasp'] = APOCRITA
id_to_title[APOCRITA] = 'Wasp'
BEE='Q7391'
ANT='Q7386'
id_to_parent[ANT] = id_to_parent[APOCRITA]
id_to_parent[BEE] = id_to_parent[APOCRITA]

# 'sweat bee' is vague, but let's assign it to halictidae
HALICTIDAE = 'Q2276661'
lower_title_to_id['sweat bee'] = HALICTIDAE
id_to_title[HALICTIDAE] = 'Sweat bee'
id_to_parent[HALICTIDAE] = BEE


# Not sure what the wikidata should be
lower_title_to_id['carpet beetle'] = lower_title_to_id['dermestidae']

lower_title_to_id['grasshopper'] = 'Q83902'
id_to_title['Q83902'] = 'Grasshopper'

id_to_title['Q25326'] = 'Mollusc'

# 'trout' is vague and its enwiki page doesn't even have a paraphyletic group template.
# Let's just say `trout` refers to some common trout.
assert 'trout' not in lower_title_to_id
lower_title_to_id['trout'] = lower_title_to_id['brown trout']

# Shrimp → "true shrimp". Otherwise it can be pretty wide, including lobsters
lower_title_to_id['shrimp'] = lower_title_to_id['caridea']

lower_title_to_id['jellyfish'] = 'Q272388'
id_to_title['Q272388'] = 'Scyphozoa (true jellyfish)'

MOLIDAE = 'Q726231'
lower_title_to_id['sunfish'] = MOLIDAE
id_to_title[MOLIDAE] = 'Molidae (ocean sunfish)'

id_to_title['Q8332'] = 'Red fox' # otherwise defaults to domesticated silver fox
id_to_title['Q468500'] = 'Eastern gray squirrel'
#id_to_title['Q30263'] = 'Seal'
id_to_title[lower_title_to_id['horse']] = 'Horse'
id_to_title['Q10856'] = 'Dove/Pigeon'
id_to_title['Q31431'] = 'Parrot'
del lower_title_to_id['🎁'] # Genetically Improved Farmed Tilapia (GIFT)
del lower_title_to_id['🏏'] # 🦗 is too cute to miss
del lower_title_to_id['凧']
del lower_title_to_id['🝳'] # half-ounces aren't ounces
del lower_title_to_id['fish']
del lower_title_to_id['car']
del lower_title_to_id['kudu']
del lower_title_to_id['zorse']
del lower_title_to_id['zedonk']
del lower_title_to_id['egg']
del lower_title_to_id['alien']
del lower_title_to_id['invertebrate']


# The single-letter names are all a stretch.
for letter in 'abcdefghijklmnopqrstuvwxyz':
    if letter in lower_title_to_id:
        del lower_title_to_id[letter]

## ancestry hacks ##
print('Applying manual hierarchy adjustments.')
# quokkas are not kangaroos
id_to_parent[lower_title_to_id['quokka']] = id_to_parent[lower_title_to_id['kangaroo']]
# dogs are not wolves
id_to_parent[lower_title_to_id['dog']] = 'Q149892' # Canis
# give the Australians the benefit of the doubt re: dingo
id_to_parent[lower_title_to_id['dingo']] = 'Q149892'
# similarly, benefit red wolf being not a gray wolf
id_to_parent['Q200442'] = 'Q149892' # Set red wolf parent to Canis
# pigs are not wild boars
id_to_parent[lower_title_to_id['pig']] = 'Q10798' # Sus
# asses are not wild asses
id_to_parent['Q19707'] = 'Q27022' # ass < Equus
# turkeys are not wild turkeys
id_to_parent['Q848706'] = 'Q43794'

# mouse → Mus (typical mice)
MUS = 'Q39275'
id_to_title[MUS] = "Mus (typical mice)"
JUMPING_MICE = 'Q13174621'
id_to_title[JUMPING_MICE] = 'Zapodidae (jumping mice)'
lower_title_to_id['mouse'] = MUS
lower_title_to_id['mice'] = MUS
lower_title_to_id['mouses'] = MUS
lower_title_to_id['mus'] = MUS
lower_title_to_id['typical mice'] = MUS
lower_title_to_id['typical mouse'] = MUS
RATTUS = 'Q36396'
id_to_title[RATTUS] = "Rattus (typical rats)"
lower_title_to_id['typical rat'] = RATTUS
lower_title_to_id['typical rats'] = RATTUS

# Zebu
ZEBU = 'Q20747726'
id_to_parent[ZEBU] = 'Q237993' # Zebu < Bos
id_to_title[ZEBU] = 'Zebu'
lower_title_to_id['zebu'] = ZEBU
lower_title_to_id['bos indicus'] = ZEBU
lower_title_to_id['indicine cattle'] = ZEBU
lower_title_to_id['humped cattle'] = ZEBU


print(' Rearranging ducks.')
# Geese and swans are not ducks. This is like wasps/bees/ants but messier.
DUCK_PARENT = id_to_parent[lower_title_to_id['anatidae']]
GEESE = [
    'anser', 'branta', # all of Anser and Branta are geese
    # 'cape barren goose', 'cnemiornis' # tentatively Anseran
    'orinoco goose', low('spur-winged goose'), low('blue-winged goose'), 'magpie goose', 'egyptian goose'
]
SWANS = [
    'cygnus', # true swans
    'coscoroba swan'
]
for goose in GEESE: id_to_parent[lower_title_to_id[goose]] = 'VGOOSE'
for swan in SWANS: id_to_parent[lower_title_to_id[swan]] = 'VSWAN'
id_to_title['VGOOSE'] = 'Goose'
id_to_title['VSWAN'] = 'Swan'
old_goose = lower_title_to_id['goose']
old_swan = lower_title_to_id['swan']
for lt in list(lower_title_to_id):
    if lower_title_to_id[lt] == old_goose:
        lower_title_to_id[lt] = 'VGOOSE'
for lt in list(lower_title_to_id):
    if lower_title_to_id[lt] == old_swan:
        lower_title_to_id[lt] = 'VSWAN'
id_to_parent['VGOOSE'] = DUCK_PARENT
id_to_parent['VSWAN'] = DUCK_PARENT

def dummy(title, parent_id, take_names_from_id=None):
    dummy_id = 'V'+title.upper().replace(" ","_")
    #assert dummy_id not in id_to_title
    id_to_title[dummy_id] = title
    lower_title_to_id[low(title)] = dummy_id
    for lt in list(lower_title_to_id):
        if lower_title_to_id[lt] == take_names_from_id:
            lower_title_to_id[lt] = dummy_id
    id_to_parent[dummy_id] = parent_id
    return dummy_id

def regroup(ancestor_id, surnames):
    print('Regrouping', ancestor_id, id_to_title[ancestor_id], 'to', surnames)
    for surname in surnames:
        dummy_id = dummy(surname, ancestor_id)
        for animal_id, title in id_to_title.items():
            if title.split(' (')[0].endswith(low(surname)) and is_descendant(animal_id, ancestor_id):
                print(dummy_id, surname, '>', animal_id, id_to_title[animal_id])
                id_to_parent[animal_id] = dummy_id
    for animal_id, title in id_to_title.items(): # todo make a generator? could even make it more efficient
        if id_to_parent[animal_id] == ancestor_id:
            print(' remaining non-'+str(surnames), 'child in', ancestor_id, id_to_title[ancestor_id]+':', animal_id, id_to_title[animal_id])

def steal(victim_id, thief_id):
    for lt in lower_title_to_id:
        if lower_title_to_id[lt] == victim_id:
            lower_title_to_id[lt] = thief_id

print(' Rearranging eagles.')
ACCIPITRIFORMES = 'Q21736'
regroup(ACCIPITRIFORMES, ['Eagle','Hawk','Buzzard','Vulture','Kite'])
lower_title_to_id['🦅'] = 'VEAGLE'
steal('Q25510','VEAGLE')

print(' Rearranging corvids.')
CORVUS = 'Q43365'
id_to_title[CORVUS] = 'Corvus (crows & ravens)'
id_to_title['Q25357'] = 'Common raven'
regroup(CORVUS, ['Crow','Raven'])

print(' Rearranging condors.')
NEW_WORLD_VULTURE = 'Q184858'
CONDOR = dummy('Condor',NEW_WORLD_VULTURE)
id_to_parent['Q15042113'] = CONDOR # Vultur
id_to_parent['Q10763377'] = CONDOR # Gymnogyps

print(' Rearranging pinnipeds into seals, sea lions, and walrus.')
PINNIPED = 'Q30263'
SEAL = dummy("Seal",PINNIPED)
TRUE_SEAL = 'Q25587' # aka earless seals; phocidae
id_to_parent[TRUE_SEAL] = SEAL
OTARIIDAE = 'Q26700' # eared seals + sea lions
id_to_parent[OTARIIDAE] = SEAL
FUR_SEAL = 'Q1043473' # parent is otariidae
NORTHERN_FUR_SEAL = 'Q7966'
SOUTHERN_FUR_SEAL = 'Q776652' # Arctocephalus
id_to_parent[NORTHERN_FUR_SEAL] = FUR_SEAL
id_to_parent[SOUTHERN_FUR_SEAL] = FUR_SEAL # ambiguous term? enwiki might be wrong
SEA_LION = dummy('Sea lion',OTARIIDAE)
steal('Q3887135',SEA_LION)
id_to_parent['Q333649'] = SEA_LION # South American sea lion
id_to_parent['Q432513'] = SEA_LION # New Zealand sea lion
id_to_parent['Q744392'] = SEA_LION # Australian sea lion
id_to_parent['Q135911'] = SEA_LION # Zalophus
id_to_parent['Q431981'] = SEA_LION # Steller sea lion

print(' Rearranging lepidopterans.')
MOTH = 'Q1725788' # generic; parent is lepidoptera
PAPILIONOIDEA = 'Q756153'
LEPIDOPTERA = 'Q28319'
# Upgrade papilionoidea to child of lepidoptera
id_to_parent[PAPILIONOIDEA] = LEPIDOPTERA
# Everything in lepidoptera other than papilionoidea is a moth
for i in id_to_parent:
    if id_to_parent[i] == LEPIDOPTERA and i != PAPILIONOIDEA and i != MOTH:
        id_to_parent[i] = MOTH
RHOPALOCERA = 'Q21075224'
steal(RHOPALOCERA,PAPILIONOIDEA) # Rhopalocera otherwise gets 'butterfly'

print(' Tidying mites.')
ACARI = 'Q19137'
lower_title_to_id['mite'] = ACARI
lower_title_to_id['mites'] = ACARI
id_to_title[ACARI] = 'Mite'
# Ticks aren't mites
TICK = 'Q10304508'
ARACHNID = 'Q1358'
id_to_parent[TICK] = ARACHNID

# Todo could refactor this into regroup
print(' Rearranging leopard frogs.')
LEOPARD_FROG = dummy("Leopard frog", 'Q2047738')
for lt in lower_title_to_id:
    if lt.endswith(' leopard frog') and id_to_parent[lower_title_to_id[lt]] == 'Q2047738':
        id_to_parent[lower_title_to_id[lt]] = LEOPARD_FROG

# Would be fixed by pulling taxons from enwiki
print(' Rearranging newts.')
PLEURODELINAE = 'Q2280962'
for newt_genus in ['Q584203','Q1932844','Q663832','Q1971331','Q1545142','Q719534','Q310461','Q719409','Q2668598','Q310391','Q1377354','Q11844306','Q22712558','Q2698682','Q390135','Q2468331']:
    id_to_parent[newt_genus] = PLEURODELINAE
steal('Q10980893',PLEURODELINAE)
#id_to_title[PLEURODELINAE] = 'Newt'

# Would be fixed by pulling taxons from enwiki
print(' Rearranging chipmunks.')
TAMIINA = 'Q18227870'
for chipmunk_genus in ['Q5414381','Q6994195','Q7063278','Q22364']:
    id_to_parent[chipmunk_genus] = TAMIINA
steal('Q85752125',TAMIINA)
id_to_title[TAMIINA] = 'Chipmunk'
id_to_parent[TAMIINA] = 'Q389250'

print(' Rearranging jackals.')
JACKAL = 'Q125525'
for jackal_species in ['Q128098','Q125814326','Q125815593']:
    id_to_parent[jackal_species] = JACKAL # Skips a few taxons; they only have subtribe (Canina) 1in common



# Rockhopper penguins are a mess. Tuck them under one label.
print(' Rearranging rockhopper penguins.')
ROCKHOPPER = dummy("Rockhopper penguin",'Q591480')
for r in ('Q688641','Q3128902','Q1274339'): id_to_parent[r] = ROCKHOPPER
lower_title_to_id['rockhopper'] = ROCKHOPPER

print(' Rearranging snipes.')
SNIPE = dummy('Snipe','Q26626')
for snipe_genus in ('Q10787358','Q868199','Q786045'): id_to_parent[snipe_genus] = SNIPE
lower_title_to_id['snipes'] = SNIPE

print(' Rearranging foxes.')
CANIDAE = 'Q25324'
regroup(CANIDAE, ['Fox'])
lower_title_to_id['🦊'] = 'VFOX'
lower_title_to_id['vixen'] = 'VFOX'
lower_title_to_id['foxes'] = 'VFOX'
id_to_title['Q331850'] = 'Short-eared dog'

"""
GALLIFORMES = 'Q21659'
regroup(GALLIFORMES, ['Partridge','Quail','Peafowl',
lower_title_to_id['peacock'] = 'VPEAFOWL'
lower_title_to_id['peahen'] = 'VPEAFOWL'
"""

print(' Rearranging snakes.')

#lower_title_to_id['snake'] = 'Q2102'
#lower_title_to_id['serpent'] = 'Q2102'
#lower_title_to_id['serpentes'] = 'Q2102'
#lower_title_to_id['🐍'] = 'Q2102'

# Cobras
ELAPIDAE = 'Q186554'
COBRA = dummy('Cobra',ELAPIDAE)
for cobra_id in (
    'Q220475',  # Naja, true cobras
    'Q169936',  # rinkhal
    'Q48186',   # king cobra
    'Q3409752', # Goldie's tree cobra
    'Q690644',  # black tree cobra
    'Q690644',  # Cape coral snake
    'Q1547457', # Shield-nosed cobra
    'Q195357',  # Black desert cobra
):
    id_to_parent[cobra_id] = COBRA
lower_title_to_id['cobra'] = COBRA

# Rattlesnakes
PIT_VIPER = 'Q595983'
RATTLESNAKE = dummy('Rattlesnake', PIT_VIPER)
lower_title_to_id['rattlesnake'] = RATTLESNAKE
lower_title_to_id['rattler'] = RATTLESNAKE
id_to_parent['Q463637'] = RATTLESNAKE # Crotalus
id_to_parent['Q244198'] = RATTLESNAKE # Sistrurus

print(' Rearranging lizards.')
LACERTILIA = 'Q15879' # "lizard" is this, but it's a deprecated taxon.
for lizard in (
    'Q929105',   # Anguimorpha
    'Q914326',   # Dibamidae, the blind skinks
    'Q1008888',  # Gecko
    'Q661136',   # Iguania, the iguanas
    'Q13518423', # Lacertoidea
    'Q1050423'   # Scincomorpha
):
    id_to_parent[lizard] = LACERTILIA


print(' Rearranging gray squirrels.')
SCIURUS = 'Q281124'
GRAY_SQUIRREL = dummy('Gray squirrel', SCIURUS)
lower_title_to_id['gray squirrel'] = GRAY_SQUIRREL
lower_title_to_id['grey squirrel'] = GRAY_SQUIRREL
for gs in ('Q468500','Q1071837','Q777282','Q1768493'): id_to_parent[gs] = GRAY_SQUIRREL

print(' Rearranging linsangs.')
LINSANG = dummy('Linsang','Q25306') # from Carnivora
for linsang_genus in ('Q11757624','Q11846972'): id_to_parent[linsang_genus] = LINSANG

print(' Creating the sturddlefish.')
ACIPENSERIFORMES = 'Q192422'
STURDDLEFISH = dummy('Sturddlefish',ACIPENSERIFORMES)


print(' Rearranging goannas.')
VARANUS = 'Q81228'
GOANNA = dummy("Goanna", VARANUS)
for goanna in ("Perentie","Lace monitor","Sand goanna","Mertens' water monitor","Spiny-tailed monitor","Mangrove monitor","Black-headed monitor","Short-tailed monitor","Argus monitor","Rosenberg's monitor","Spencer's goanna","Storr's monitor","Dampier Peninsula monitor","Mitchell's water monitor","Kings' monitor","Southern Pilbara rock goanna","Black-palmed rock monitor","Kimberley rock monitor","Pygmy mulga monitor","Rusty desert monitor","Stripe-tailed goanna","Pilbara monitor","Black-spotted ridge-tailed monitor","Emerald tree monitor","Canopy goanna"):
    id_to_parent[lower_title_to_id[low(goanna)]] = GOANNA

print(' Rearranging bluefin.')
BLUEFIN_TUNA = dummy('Bluefin','Q21659')
id_to_title[BLUEFIN_TUNA] = 'Bluefin tuna (of which there are several species, actually, named after where they live)'
lower_title_to_id['bluefin tuna'] = BLUEFIN_TUNA
id_to_parent[lower_title_to_id['southern bluefin tuna']] = BLUEFIN_TUNA
id_to_parent[lower_title_to_id['pacific bluefin tuna']] = BLUEFIN_TUNA
id_to_parent[lower_title_to_id['atlantic bluefin tuna']] = BLUEFIN_TUNA

print(' Defining the New Guinea singing dog.')
NGSD = dummy('New Guinea singing dog','Q149892')

#id_to_title['jellyfish'] = 'Q272388'
#id_to_title['Q272388'] = 'Scyphozoa (true jellyfish)';

id_to_title[lower_title_to_id['mergus']] = 'Merganser'

id_to_title['Q995960'] = 'Agaonidae' # Not 'Fig wasp'; there are others

# UGH wikidata dumps take so long!
# todo import patches of them or something?
GTORT = dummy('Galápagos tortoise','Q2080003')
lower_title_to_id['galapagos tortoise'] = GTORT
lower_title_to_id['giant tortoise'] = GTORT
lower_title_to_id['giant turtle'] = GTORT


print('Writing Animalia to parent.js.')
with open('parent.js','w') as file:
    print('',file.write('PARENT='+json.dumps(id_to_parent,indent=1)),'bytes written.')

print('\nWriting lower_title_to_id.js and id_to_title.js.')
with open('lower_title_to_id.js','w') as file:
    print('',file.write('LOWER_TITLE_TO_ID='+json.dumps(lower_title_to_id,indent=1,ensure_ascii=False)),'bytes written.')
with open('id_to_title.js','w') as file:
    print('',file.write('ID_TO_TITLE='+json.dumps(id_to_title,indent=1,ensure_ascii=False)),'bytes written.')

print('Finding mononyms.')
mononyms = {}

mononyms[lower_title_to_id['human']] = '👩‍❤️‍💋‍👩,👩‍❤️‍👩,🥷,🤡,💁,🤷,👩‍💻,🤺,🧍,👤,👯,🕴️,🧑‍🌾,🧑‍🔬,🤸,🧓,👧,🧑‍🎓'.split(',')
#mononyms[lower_title_to_id['human']].extend(['𓀏','𓀓','𓀕','𓀗','𓁑','𓁕','𓁘','𓁙'])

for mononym, lower_title in [
    ('🦮','dog'), ('🐕‍🦺','dog'), ('🐩','dog'), ('🐈‍⬛','cat'),
    ('🕊️','dove'), ('🪶','philopteridae'), ('🦖','t rex'), ('🦕','sauropod'),
    ('🐳','whale'), ('🐠','angelfish'), ('🦀','crab'), ('🕸️','orbweaver'),
    # These are the only ZWJ animals we care about.
    ('🐦‍⬛','corvus'), ('🐦‍⬛','common blackbird'), ('🐦‍⬛','chinese blackbird'), ('🐦‍⬛','indian blackbird'), ('🐦‍⬛','tibetan blackbird'),
    ('🐻‍❄️','polar bear')
]:
    mononyms[lower_title_to_id[lower_title]] = mononyms.get(lower_title_to_id[lower_title], []) + [mononym]

mononyms['Q127282'] = ['🐟'] # ray-finned fish
del mononyms['Q752188']
mononyms['Q40802'] = ['🦀']

for lower_title in lower_title_to_id:
    if len(lower_title)==1:
        mononyms[lower_title_to_id[lower_title]] = mononyms.get(lower_title_to_id[lower_title], []) + [lower_title]
print(' Found',len(mononyms),'mononyms.')

for lower_title, hieroglyphs in {
     'african sacred ibis': ['𓅝', '𓅞'],
     'baboon': ['𓃷', '𓃻'], 'bennu heron': ['𓆀'], 'bovine': ['𓃜'], 'cattle egret': ['𓅥'],
     'egyptian cobra': ['𓆗', '𓆘'], 'cormorant': ['𓅧'], 'cow': ['𓃔', '𓃖', '𓃠','𓃒', '𓃓', '𓃽', '𓃾', '𓄀'], 'nile crocodile': ['𓆊', '𓆌'],
     'donkey': ['𓃘'], 'duck': ['𓅹'], 'dung beetle': ['𓆣'],
     'egyptian centipede': ['𓆨'], 'egyptian vulture': ['𓄿', '𓅀', '𓆂'], 'elephant': [], #𓃰
     'eurasian wigeon': ['𓅰'], 'falcon': ['𓅃'],
     'flamingo': ['𓅟'], 'flesh fly': ['𓆦'],
     'nile delta toad': ['𓆏'], 'egyptian toad': ['𓆏'],
     'gazelle': ['𓃴'], 'gecko': ['𓆈'], 'giraffe': ['𓃱'], 'glossy ibis': ['𓅠'],
     'goat': ['𓃙', '𓃚', '𓃶'], 'egyptian goose': ['𓅬', '𓅼'], 'guineafowl': ['𓅘'], 'cape hare': ['𓃹'], 'hartebeest': ['𓃛', '𓄃'], 'heron': ['𓅣'],
     'hippo': ['𓃯', '𓄁'], 'hoopoe': ['𓅙'], 'horned viper': ['𓆑'], 'horse': ['𓃗'], 'ibex': ['𓃵'], 'jackal': ['𓃥', '𓃦'],
     'labeobarbus bynni': ['𓆜'], 'lapwing': ['𓅚', '𓅛'], 'leopard': ['𓃮'], 'egyptian lion': ['𓃬', '𓃭'], 'egyptian locust': ['𓆧'], 'mormyridae': ['𓆞'],
     'mullet': ['𓆝'], 'nile puffer': ['𓆡'], 'nile tilapia': ['𓆛'], 'northern bald ibis': ['𓅜'], 'northern pintail': ['𓅭', '𓅮', '𓅯'],
     'oryx': ['𓃲'], 'ostrich': ['𓅦'], 'owl': ['𓅓', '𓅔'], 'petrocephalus bane': ['𓆟'], 'pig': ['𓃟'], 'pintail': ['𓅿'], 'egyptian plover': ['𓅺'],
     'quail': ['𓅱', '𓅳'], 'saddle billed stork': ['𓅡', '𓅢'], 'sheep': ['𓃝', '𓃞'], 'sparrow': ['𓅪'], 'spoonbill': ['𓆁'], 'starfish': ['𓇼'],
     'swallow': ['𓅨'], 'nile softshell turtle': ['𓆉'], 'egyptian tortoise': ['𓆉']
}.items():
    #if 'egyptian '+lower_title in lower_title_to_id: print('egyptian!',lower_title)
    #if 'egypt '+lower_title in lower_title_to_id: print('egypt!',lower_title)
    #if 'nile '+lower_title in lower_title_to_id: print('nile!',lower_title)
    if lower_title_to_id[lower_title] in mononyms:
        pass #print('already mononym:',hieroglyph, mononyms[lower_title_to_id[lower_title]], lower_title)
    else:
        print('including hieroglyphic mononyms:',hieroglyphs,lower_title)
        mononyms[lower_title_to_id[lower_title]] = hieroglyphs

mononyms['Q53636'] = ['🐸']

with open('mononyms.js','w') as file:
    file.write('MONONYMS='+json.dumps(mononyms, indent=1, ensure_ascii=False))



print('\nFinished in',(time.time()-t0)/60/60,'hours.')


# todo: don't use quotes for some of the js keys, to save space



# todo: 4 toed sloth
# todo: badger?
