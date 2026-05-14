daily = null;
currentChallenge = null;

function updateDaily(debugOffset=0) {
    let today = new Date();
    today.setDate(today.getDate() + debugOffset);
    daily = challengeForToday(today);
    daily.key = 'daily_' + today.getFullYear() + '_' + today.getMonth() + '_' + today.getDate();
    todayDesc.textContent = today.toLocaleDateString();
    if (localStorage['c_'+daily.key]) {
        dailyButton.disabled = true;
        dailyButton2.disabled = true;
        todaySection.title = "Already attempted daily for " + today.toLocaleDateString() + ". Come back tomorrow";
        todayDesc.textContent += ' ✔';
        return;
    } else {
        dailyButton.disabled = false;
        dailyButton2.disabled = false;
        todaySection.title = '';
        todayDesc.textContent += '❗';
    }
    return daily;
}

// Unimplemented idea
name100Challenge = {
    shortname: 'name100',
    title: 'list 100 animals',
    subtitle: 'as fast as you can',
    attributivizeScore: ()=> 'todo'
}

// Unused; probably too confusing
fishChallenge = {
    shortname: 'nontetrapodvertebrate',
    title: 'list non-tetrapod vertebrates until failure',
    subtitle: 'Fish Friday',
    rejection: function (guessId, guess) {
        for (const ancestor of lineage(guessId)) {
            if (ancestor==LOWER_TITLE_TO_ID.tetrapod) return "That's a tetrapod.";
            if (ancestor==LOWER_TITLE_TO_ID.mammal) return "That's a tetrapod. Mammals are tetrapods.";
            if (ancestor==LOWER_TITLE_TO_ID.cetacean) return "It sure looks like a fish, but it's taxonomically a tetrapod.";
            if (ancestor==LOWER_TITLE_TO_ID.vertebrate) return;
        }
        if (guessId==LOWER_TITLE_TO_ID.tullimonstrum) { challengeEggMessage = "If you say so!"; return; }
        return "Not a vertebrate.";
    }
}

// Not currently used
monotremeChallenge = singleTaxonChallenge('monotreme', 'egg-laying mammals');
monotremeChallenge.durationS = 9;
monotremeChallenge.queueFinalTrivia = ()=>{
    if (score<3) {
        queueTrivium("<a href=https://en.wikipedia.org/wiki/Monotreme target=_blank>The only extant monotremes are the platypus and echnidnas.</a>");
    } else {
        queueTrivium("You sure know your monotremes.");
    }
}

function singleTaxonChallenge(noun, subtitle, extraData) {
    extraData ??= {}
    article = extraData.article || (noun.match(/^[aeiou]/) ? 'an' : 'a');
    c = {
        noun: noun,
        subtitle: subtitle,
        rejection: function(guessId) {
            if (!ancestsOrIs(LOWER_TITLE_TO_ID[noun], guessId)) {
                return "Not " + article + " " + noun + ".";
            }
        },
    }
    for (i in extraData) { c[i] = extraData[i]; }
    return c;
}

CHALLENGES = {
    /* Yearly challenges */
    halloween: {
        title: 'list animals on Halloween',
        subtitle: "the timer is hidden until it isn't",
        durationS: 60 + 10.31,
        verbed: 'listed on Halloween'
    },
    leapDay: singleTaxonChallenge('frog', 'leap day challenge'),
    eightEight: {
        title: 'list arachnids & octopuses until failure',
        rejection: function(guessId) {
            if (!anyAncestsOrIs([LOWER_TITLE_TO_ID.arachnid, LOWER_TITLE_TO_ID.octopus], guessId)) {
                return "Not arachnid nor octopus.";
            }
        },
        durationS: 8, incrementS: 8,
        noun: 'arachnids/octopuses'
    },
    /* Combined taxa challenges */
    leechOrTick: { // * Unused. TODO add mosquitos
        title: 'list leeches and ticks until failure',
        subtitle: 'yummy yummy blood',
        noun: 'leech/tick',
        pluralNoun: 'leeches/ticks',
        rejection: function (guessId, guess) {
            for (const ancestor of lineage(guessId)) {
                if (ancestor==LOWER_TITLE_TO_ID.leech) return;
                if (ancestor==LOWER_TITLE_TO_ID.tick) return;
            }
            return 'Not a leech or a tick.';
        },
        durationS: 30
    },
    /* Single-taxon-with-exception challenges */
    dino: {
        title: 'list non-bird dinosaurs until failure',
        rejection: function (guessId, guess) {
            if (guess=='pterodactyl') return "Pterodactyls aren't technically dinosaurs. Don't blame me.";
            if (guessId==LOWER_TITLE_TO_ID.tullimonstrum) { return "I'm not convinced."; }
            for (const ancestor of lineage(guessId)) {
                if (ancestor==LOWER_TITLE_TO_ID.bird) return "That's a bird.";
                if (ancestor==LOWER_TITLE_TO_ID.dinosaur) return;
                if (ancestor==LOWER_TITLE_TO_ID.pterosaur) return "Pterosaurs aren't technically dinosaurs.";
            }
            return "Not a dinosaur.";
        },
        noun: 'non-bird dinosaur'
    },
    invertebrate: {
        noun: 'invertebrate',
        subtitle: 'spineless animals',
        rejection: function(guessId, guess) {
            if (guessId==LOWER_TITLE_TO_ID.tullimonstrum) {
                challengeEggMessage = "If you say so."; return;
            }
            if (ancestsOrIs(LOWER_TITLE_TO_ID.human, guessId)) return "I definitely have a spine.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.vertebrata, guessId)) return "That's a vertebrate.";
        }
    },
    nonmammal: {
        shortname: 'non-mammal',
        title: 'list non-mammal animals until failure',
        rejection: function(guessId, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mammal, guessId)) return "That's a mammal.";
        },
        noun: 'non-mammal'
    },
    /* Single taxon challenges */
    arachnid: {
        noun: 'arachnid',
        rejection: function(guessId, guess) {
            for (const ancestor of lineage(guessId)) {
                if (ancestor==LOWER_TITLE_TO_ID.arachnid) return;
                if (ancestor==LOWER_TITLE_TO_ID.insect) return "That's an insect. Arachnids have 8 legs, not 6.";
                if (ancestor==LOWER_TITLE_TO_ID.crustacea) return "That's a crustacean, but not an arachnid.";
                if (ancestor==LOWER_TITLE_TO_ID.arthropoda) return "That's an arthropod, but not an arachnid.";
                if (guess=='vriska' || guess=='vriska serket' || guess=='mindfang') return "Not spidertrolls.";
            }
            return 'Not an arachnid.';
        },
        durationS: 38, incrementS: 8
    },
    canid: {
        noun: 'canid',
        subtitle: 'doglike creatures',
        rejection: function(guessId, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.canid, guessId)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.felid, guessId)) return "That's a felid, not a canid.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guessId)) return "That's a mustelid, not a canid.";
            return "Not a canid.";
        },
        durationS: 40
    },
    felid: {
        noun: 'felid',
        subtitle: 'cats, big or small',
        rejection: function(guessId, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.felid, guessId)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.canid, guessId)) return "That's a canid, not a felid.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guessId)) return "That's a mustelid, not a felid.";
            return "Not a felid.";
        },
        durationS: 40
    },
    insect: {
        noun: 'insect',
        rejection: function(guessId) {
            for (const ancestor of lineage(guessId)) {
                if (ancestor==LOWER_TITLE_TO_ID.insect) return;
                if (ancestor==LOWER_TITLE_TO_ID.spider) return "Spiders are arachnids, not insects.";
                if (ancestor==LOWER_TITLE_TO_ID.scorpion) return "Scorpions are arachnids, not insects.";
                if (ancestor==LOWER_TITLE_TO_ID.arachnid) return "That's an arachnid, not an insect.";
                if (ancestor==LOWER_TITLE_TO_ID.hexapoda) return "That's a hexapod, but not all hexapods are insects.";
                if (ancestor==LOWER_TITLE_TO_ID.crustacea) return "That's a crustacean, but not an insect.";
                if (ancestor==LOWER_TITLE_TO_ID.arthropoda) return "That's an arthropod, but not all arthropods are insects.";
            }
            return 'Not an insect.';
        }
    },
    /* single-taxon challenges */
    amphibia: singleTaxonChallenge('amphibian', 'members of the class Amphibia'),
    ant: {
        noun: 'ant',
        rejection: function(guessId, guess) {
            if (guess=='velvet ant') return "Velvet ants aren't actually ants. Sorry.";
            if (!ancestsOrIs(LOWER_TITLE_TO_ID.ant, guessId)) return "Not an ant.";
        }
    },
    bat: singleTaxonChallenge('bat'),
    bear: singleTaxonChallenge('bear', "there are only like 8 of them", {durationS:25}),
    beetle: singleTaxonChallenge('beetle', 'insects with hardened wing-cases'),
    cetacea: singleTaxonChallenge('cetacean','dolphins, porpoises, & whales'),
    corvid: singleTaxonChallenge(
        'corvid',
        'crows, ravens, rooks, magpies, jackdaws, jays, treepies, choughs, & nutcrackers'
    ),
    hymenoptera: singleTaxonChallenge('hymenopteran', 'wasps, bees, ants, and sawflies'),
    lepidoptera: singleTaxonChallenge('lepidopteran', '🦋 butterflies & moths 🦋'),
    mollusk: singleTaxonChallenge('mollusk', 'gastropods, cephalopods, & bivalves'),
    myriapod: singleTaxonChallenge('myriapod', 'centipedes & millipedes'),
    owl: singleTaxonChallenge('owl'),
    primate: singleTaxonChallenge('primate'),
    roach: singleTaxonChallenge('cockroach', 'including termites', {durationS:30, pluralNoun:'roaches'}),
    rodent: {
        noun:'rodent', subtitle: 'from Latin <i>rōdēns</i>, “gnawing”',
        rejection: function(guessId, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.rodent, guessId)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guessId)) return "That's a mustelid, not a rodent.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guessId)) return "That's a marsupial, not a rodent.";
            return "Not a rodent.";
        },
    },
    snake: singleTaxonChallenge('snake'),
    sauropsid: singleTaxonChallenge('sauropsid', 'bird & reptiles'),
    tick: singleTaxonChallenge('tick', null, {durationS:20}), // * Unused
    waterfowl: singleTaxonChallenge("waterfowl","ducks, geese, & swans", null, {pluralNoun:"waterfowl"}),
    arthropod: {
        specialStart: ()=>{ window.arthropodConfusion = 0; },
        noun: 'arthropod',
        subtitle: 'Arthropod Thursday. (Exoskeletoned invertebrates. Bugs, more or less.)',
        rejection: function(guessId, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.arthropod, guessId)) return;
            if (window.arthropodConfusion++==4) {
                queueShyTrivium("<a href=https://en.wikipedia.org/wiki/Arthropod target=_blank>Read about arthropods</a> or <a href=https://rose.systems/bugs target=_blank>browse my arthropod photos</a>.");
            }
            if (guessId==LOWER_TITLE_TO_ID.tullimonstrum) return "Not an arthropod. Probably.";
            return "Not an arthropod.";
        }
    },
    bird: singleTaxonChallenge('bird', 'Bird Sunday'),
    mammal: singleTaxonChallenge('mammal', 'Mammal Monday'),
    /* Speed challenges */
    halftime: {
        title: 'list animals fast',
        subtitle: 'speedrun saturday',
        durationS: 30, incrementS: 3,
        verbed: 'listed fast (30s+3s)'
    },
    superfast: {
        title: 'list animals faster!',
        durationS: 10, incrementS: 2,
        verbed: 'listed faster (10s+2s)'
    },
    oneMinute: {
        title: 'list animals in one minute',
        subtitle: 'no time bonus for listed animals',
        durationS: 60, incrementS: 0,
        verbed: 'listed in 1 min'
    },
    /* Orthographic challenges */
    alphabetical: {
        title: 'list animals in alphabetical order',
        subtitle: 'abcdefghijklmnopqrstuvwxyz',
        rejection: function (_guessId, guess) {
            let prevGuess = correctGuesses[correctGuesses.length-1];
            if (!prevGuess) return;
            if (guess.localeCompare(prevGuess)<0 && guess.replaceAll(' ','').localeCompare(prevGuess.replaceAll(' ',''))<0) {
                 return "That alphabetically precedes " + prevGuess + ".";
            }
        },
        verbed: 'listed alphabetically',
        orthographic: true
    },
    endsWithFish: {
        noun: 'fish', pluralNoun: 'fish',
        title: 'list animals whose names end in -fish',
        rejection: function(guessId, guess) {
            if (guess.endsWith('fish') || ID_TO_TITLE[guessId].endsWith('fish')) return;
            return "That doesn't end in “fish”.";
        },
        orthographic: true
    },
    oneWord: { // * Unused
        noun: 'one-word animal',
        subtitle: "all guesses must be exactly one word",
        rejection: function (_guessId, guess) {
            let wordCount = guess.split(' ').length;
            if (wordCount!=1) return "That's " + wordCount + " words.";
        },
        orthographic: true
    },
    twoWord: { // * Unused
        noun: 'one-word animal',
        subtitle: "all guesses must be exactly two words",
        rejection: function (_guessId, guess) {
            let wordCount = guess.split(' ').length;
            if (wordCount==2) return;
            if (wordCount==1) return "That's only one word.";
            if (wordCount==3) return "That's three words.";
            return "That's " + wordCount + " words.";
        },
        orthographic: true
    },
    wordchain: {
        title: 'list animals in a word chain',
        subtitle: 'each guess must begin with the last letter of the previous guess',
        rejection: function (_guessId, guess) {
            if (!correctGuesses.length) return;
            let prevGuess = correctGuesses[correctGuesses.length-1];
            let requiredInitial = prevGuess.slice(prevGuess.length-1);
            if (guess.slice(0,1) != requiredInitial) {
                return "That doesn't begin with " + requiredInitial + ".";
            }
        },
        verbed: 'wordchained'
    },
    // Misc challenges
    invisibleTimer: { // * Unused
        title: 'list animals invisibly timed',
        subtitle: "The timer is invisible. Is this easier without the looming countdown?"
    }
}

function singleInitialChallenge(letter) {
    const LETTER = letter.toUpperCase();
    letter = letter.toLowerCase(); // for safety
    return {
        shortname: letter + 'Animals',
        noun: LETTER + '-animal',
        title: 'list animals starting with ' + LETTER,
        subtitle: 'each guess must begin with ' + LETTER,
        rejection: function (_guessId, guess) {
            if (!guess.startsWith(letter)) return "That doesn't start with "+LETTER+".";
        }
    }
}
COMMON_LETTERS = 'etaoinshrdlcumwfg'
for (letter of COMMON_LETTERS) {
    challenge = singleInitialChallenge(letter);
    CHALLENGES[challenge.shortname] = challenge;
}
for (shortname in CHALLENGES) {
    const challenge = CHALLENGES[shortname];
    challenge.shortname = shortname;
    challenge.durationS ??= 60;
    challenge.incrementS ??= 6;
    challenge.rejection ??= ()=>{};
    challenge.noun ??= 'animal';
    challenge.pluralNoun ??= challenge.noun+'s';
    challenge.verbed ??= 'listed';
    challenge.attributivizeScore ??= ()=> score + ' ' + (score==1 ? challenge.noun : challenge.pluralNoun) + ' ' + challenge.verbed;
    challenge.title ??= 'list ' + challenge.pluralNoun + ' until failure';
}

function debugWipeDailyHistory() {
    for (i in localStorage) {
        if (i.startsWith('c_daily_')) localStorage.removeItem(i);
    }
}

function getHighScores() {
    const highScores = {}
    for (i in localStorage) {
        if (!i.startsWith('hs_')) continue;
        const c = i.substring(3);
        if (!Object.hasOwn(CHALLENGES, c)) continue;
        highScores[c] = localStorage[i];
    }
    return highScores;
}

function updateChallengesTbody() {
    const highScores = getHighScores();
    const shortnames = Object.keys(highScores);
    shortnames.sort((a,b)=>CHALLENGES[a].title.localeCompare(CHALLENGES[b].title));
    challengesTbody.textContent = '';
    for (const shortname of shortnames) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const button = document.createElement('button');
        td1.append(button);
        const td2 = document.createElement('td');
        button.textContent = CHALLENGES[shortname].title;
        button.onclick = ()=>{ startChallenge(CHALLENGES[shortname]); };
        td2.textContent = highScores[shortname];
        tr.append(td1, td2);
        challengesTbody.append(tr);
    }
}

// challenge ideas:
// carnivoran? would require a visual aid to explain what they are.
function challengeForToday(today) {
    const month = today.getMonth();
    const date = today.getDate();
    const weekday = today.getDay();
    const year = today.getFullYear();
    /* Yearlies */
    if (month==2-1 && date==29) return CHALLENGES.leapDay;
    if (month==10-1 && date==31) return CHALLENGES.halloween;
    if (month==8-1 && date==8) return CHALLENGES.eightEight;
    /* Weeklies */
    if (weekday==0) return CHALLENGES.bird;
    if (weekday==1) return CHALLENGES.mammal;
    if (weekday==4) return CHALLENGES.arthropod;
    if (weekday==6) return CHALLENGES.halftime;
    /* Monthlies */
    if (date==1) return CHALLENGES.snake;
    if (date==2) return CHALLENGES.corvid;
    if (date==3) return CHALLENGES.hymenoptera
    if (date==4) return CHALLENGES.beetle;
    if (date==5) return CHALLENGES.primate;
    if (date==6) return CHALLENGES.insect;
    if (date==7) return CHALLENGES.dino;
    if (date==8) return CHALLENGES.arachnid;
    if (date==9) return CHALLENGES.wordchain;
    if (date==10) return CHALLENGES.superfast;
    if (date==11) return CHALLENGES.nonmammal;
    if (date==12) return CHALLENGES.beetle;
    if (date==13) return CHALLENGES[COMMON_LETTERS[(month + year*12) % COMMON_LETTERS.length]+'Animals'];
    if (date==14) return [CHALLENGES.oneWord, CHALLENGES.twoWord, CHALLENGES.insect][month % 3];
    if (date==15) return CHALLENGES.halftime;
    if (date==16) return CHALLENGES.mollusk;
    if (date==17) return CHALLENGES.felid;
    if (date==18) return CHALLENGES.canid;
    if (date==19) return CHALLENGES.amphibia;
    if (date==20) return CHALLENGES.bat;
    if (date==21) return CHALLENGES.ant;
    if (date==22) return CHALLENGES.endsWithFish;
    if (date==23) return [CHALLENGES.cetacea, CHALLENGES.waterfowl][month % 2];
    if (date==24) return CHALLENGES.bear;
    if (date==25) return CHALLENGES.rodent;
    if (date==26) return CHALLENGES.alphabetical;
    if (date==27) return CHALLENGES.sauropsid;
    if (date==28) return CHALLENGES.lepidoptera;
    if (date==29) return CHALLENGES.oneMinute;
    if (date==30) return CHALLENGES.invertebrate;
    if (date==31) return [CHALLENGES.owl, CHALLENGES.myriapod][month % 2];
    /* Safeguards */
    if (isNaN(date)) return singleTaxonChallenge('tullimonstrum');
    return CHALLENGES.insect;
}

// Legacy support
challengeSynonyms={'30s+3s':'halftime','10s+2s':'superfast','-fish':'endsWithFish','60-0': 'oneMinute','i-animals':'iAnimals'}
if (!localStorage.highScoresTracked) {
    for (i in localStorage) {
        if (!i.startsWith('c_daily_')) continue;
        const parts = localStorage[i].split(' ');
        if (parts.length != 2) continue;
        const shortname = parts[0] || challengeSynonyms[parts[0]];
        if (!CHALLENGES[shortname]) continue;
        localStorage['hs_'+shortname] = Math.max(localStorage['hs_'+shortname] || 0, parts[1]);
    }
    //localStorage.highScoresTracked = 1;
}
