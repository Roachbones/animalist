daily = null;
currentChallenge = null;

function updateDaily(debugOffset=0) {
    today = new Date();
    today.setDate(today.getDate() + debugOffset);
    daily = challengeForToday();
    daily.key = 'daily_' + today.getFullYear() + '_' + today.getMonth() + '_' + today.getDate();
    dailydesc.textContent = today.toLocaleDateString();
    if (localStorage['c_'+daily.key]) {
        dailybutton.disabled = true;
        dailybutton2.disabled = true;
        dailypage.title = "Already attempted daily for " + today.toLocaleDateString() + ". Come back tomorrow";
        dailydesc.textContent += ' ✔';
        return;
    } else {
        dailybutton.disabled = false;
        dailybutton2.disabled = false;
        dailypage.title = '';
        dailydesc.textContent += '❗';
    }
    return daily;
}

wordchainChallenge = {
    shortname: 'wordchain',
    title: 'list animals in a word chain',
    subtitle: 'each guess must begin with the last letter of the previous guess',
    rejection: wordchain_rejection,
    attributivizeScore: ()=>{ score + ' animal' + (score==1 ? '' : 's') + ' wordchained' }
}
function wordchain_rejection (_guess_id, guess) {
    if (!correct_guesses.length) return;
    let prevGuess = correct_guesses[correct_guesses.length-1];
    let requiredInitial = prevGuess.slice(prevGuess.length-1);
    if (guess.slice(0,1) != requiredInitial) {
        return "That doesn't begin with " + requiredInitial + ".";
    }
}

function singleInitialChallenge(letter) {
    const LETTER = letter.toUpperCase();
    return {
        shortname: LETTER + '-animals',
        title: 'list animals starting with ' + LETTER,
        subtitle: 'each guess must begin with ' + LETTER,
        rejection: function (_guess_id, guess) {
            if (!guess.startsWith(letter)) return "That doesn't start with "+LETTER+".";
        },
        attributivizeScore: ()=> score + ' ' + LETTER + '-animal' + (score==1 ? '' : 's') + ' listed'
    }
}

alphabeticalChallenge = {
    shortname: 'alphabetical',
    title: 'list animals in alphabetical order',
    subtitle: 'abcdefghijklmnopqrstuvwxyz',
    rejection: function (_guess_id, guess) {
        let prevGuess = correct_guesses[correct_guesses.length-1];
        if (prevGuess && guess.localeCompare(prevGuess)<0) return "That alphabetically precedes " + prevGuess + ".";
    },
    orthographic: true,
    attributivizeScore: ()=> score + ' animal' + (score==1 ? '' : 's') + ' listed alphabetically'
}

invisibleTimerChallenge = {
    shortname: 'invisibletimer',
    title: 'list animals invisibly timed',
    subtitle: "the timer is invisible. maybe it's easier without the big red countdown",
    rejection: ()=>{}
}

oneWordChallenge = {
    shortname: 'one-word',
    title: 'list one-word animals',
    subtitle: "all guesses must be exactly one word",
    rejection: function (_guess_id, guess) {
        let wordCount = guess.split(' ').length;
        if (wordCount!=1) return "That's " + wordCount + " words.";
    },
    orthographic: true,
    noun: 'one-word animal'
}
twoWordChallenge = {
    shortname: 'two-word',
    title: 'list two-word animals',
    subtitle: "all guesses must be exactly two words",
    rejection: function (_guess_id, guess) {
        let wordCount = guess.split(' ').length;
        if (wordCount==2) return;
        if (wordCount==1) return "That's only one word.";
        if (wordCount==3) return "That's three words.";
        return "That's " + wordCount + " words.";
    },
    orthographic: true,
    noun: 'two-word animal'
}

function debugWipeDailyHistory() {
    for (i in localStorage) {
        if (i.startsWith('c_daily_')) localStorage.removeItem(i);
    }
}
function challengeForToday() {
    if (1==0) return {
        shortname: '0.5s-1s',
        title: 'half-second test challenge',
        duration_s: 0.5, increment_s: -1,
        rejection: ()=>{}
    }
    let month = today.getMonth(); let date = today.getDate(); let day = today.getDay();
    // Specific dates (by which I mean month and day. No wait, day means weekday, uh,)
    if (month==2-1 && date==29) return singleTaxonChallenge('frog', 'leap day challenge');
    if (day==8 && month==8-1) return {
        shortname: 'arachnids/octopuses',
        title: 'list arachnids & octopuses until failure',
        rejection: function(guess_id) {
            if (!anyAncestsOrIs([LOWER_TITLE_TO_ID.arachnid, LOWER_TITLE_TO_ID.octopus], guess_id)) {
                return "Not arachnid nor octopus.";
            }
        },
        duration_s: 8, increment_s: 8,
        noun: 'arachnids/octopuses'
    }

    insectChallenge = singleTaxonChallenge('insect');
    insectChallenge.rejection = function(guess_id) { // defined a function but now overriding. Optimize?
        for (const ancestor of lineage(guess_id)) {
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
    arachnidChallenge = singleTaxonChallenge('arachnid');
    arachnidChallenge.rejection = function(guess_id, guess) {
        for (const ancestor of lineage(guess_id)) {
            if (ancestor==LOWER_TITLE_TO_ID.arachnid) return;
            if (ancestor==LOWER_TITLE_TO_ID.insect) return "That's an insect. Arachnids have 8 legs, not 6.";
            if (ancestor==LOWER_TITLE_TO_ID.crustacea) return "That's a crustacean, but not an arachnid.";
            if (ancestor==LOWER_TITLE_TO_ID.arthropoda) return "That's an arthropod, but not an arachnid.";
            if (guess=='vriska' || guess=='vriska serket' || guess=='mindfang') return "Not spidertrolls.";
        }
        return 'Not an arachnid.';
    }
    arachnidChallenge.duration_s = 38; arachnidChallenge.increment_s = 8;
    if (day==0) return singleTaxonChallenge('bird', "Bird Sunday"); // Bird Sunday
    if (day==1) return singleTaxonChallenge('mammal', 'Mammal Monday');
    if (day==4) {
        arthropodConfusion = 0;
        c = singleTaxonChallenge('arthropod', 'Arthropod Thursday. (Exoskeletoned invertebrates. Bugs, more or less.)'); // Arthropod Thursday
        c.rejection = function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.arthropod, guess_id)) return;
            if (arthropodConfusion++==4) {
                queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Arthropod target=_blank>Read about arthropods</a> or <a href=https://rose.systems/bugs target=_blank>browse my arthropod photos</a>.");
            }
            return "Not an arthropod.";
        }
    }
    if (day==6) return { // todo scrap this one?
        shortname: '30s+3s',
        title: 'list animals fast',
        subtitle: 'speedrun saturday',
        duration_s: 30, increment_s: 3,
        rejection: ()=>{},
        attributivizeScore: ()=> score + ' animal' + (score==1 ? '' : 's') + ' listed fast (30s+3s)'
    }

    if (date==1) return singleTaxonChallenge('snake');
    if (date==2) return singleTaxonChallenge('corvid', 'crows, ravens, rooks, magpies, jackdaws, jays, treepies, choughs, & nutcrackers');
    if (date==3) return singleTaxonChallenge('bee');
    if (date==4) return singleTaxonChallenge('beetle');
    if (date==5) return singleTaxonChallenge('primate');
    if (date==6) return insectChallenge;
    if (date==7) return singleTaxonChallenge('ruminant', 'hooved grazers');
    if (date==8) return arachnidChallenge;
    if (date==9) return wordchainChallenge;
    if (date==10) return {
        shortname: '10-1',
        title: 'list animals faster!',
        duration_s: 10, increment_s: 2,
        rejection: ()=>{},
        attributivizeScore: ()=>{ score + ' animal' + (score==1 ? '' : 's') + ' listed faster (10s+1s)' }
    }
    if (date==11) return {
        shortname: 'non-mammal',
        title: 'list non-mammal animals until failure',
        rejection: function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mammal, guess_id)) return "That's a mammal.";
        }
    };
    if (date==12) return singleTaxonChallenge('beetle', 'insects with hardened wing-cases');
    if (date==13) {
        let letters = 'etaoinshrdlcumwfg';
        letter = letters[(date + day + today.getFullYear()) % letters.length];
        return singleInitialChallenge(letter);
    }
    if (date==14) return singleTaxonChallenge('crustacean');
    if (date==15) return singleTaxonChallenge('lepidopteran', '🦋 butterflies & moths 🦋');
    if (date==16) return singleTaxonChallenge('mollusk', 'gastropods, cephalopods, & bivalves');
    if (date==17) {
        c = singleTaxonChallenge('felid', 'cats, big or small');
        c.rejection = function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.felid, guess_id)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.canid, guess_id)) return "That's a canid, not a felid.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guess_id)) return "That's a mustelid, not a felid.";
            return "Not a felid.";
        }
        c.duration_s = 40;
        c.increment_s = 6;
        return c;
    }
    if (date==18) {
        c = singleTaxonChallenge('canid', 'doglike creatures');
        c.rejection = function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.canid, guess_id)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.felid, guess_id)) return "That's a felid, not a canid.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guess_id)) return "That's a mustelid, not a canid.";
            return "Not a canid.";
        }
        c.duration_s = 40;
        c.increment_s = 6;
        return c;
    }
    if (date==19) return singleTaxonChallenge('amphibian', 'members of the class Amphibia');

    // img ref for this one?
    //if (date==20) return singleTaxonChallenge('carnivoran', 'an order of placental mammals specialized primarily in eating flesh; includes felids, canids, and others');
    if (date==20) {
        c = singleTaxonChallenge('monotreme', 'egg-laying mammals');
        c.duration_s = 9; c.increment_s = 6;
        c.queueFinalTrivia = ()=>{
            if (score<3) {
                queue_trivium("<a href=https://en.wikipedia.org/wiki/Monotreme target=_blank>The only extant monotremes are the platypus and echnidnas.</a>");
            } else {
                queue_trivium("You sure know your monotremes.");
            }
        }
        return c;
    }
    //if (date==21) return singleTaxonChallenge('wasp', 'not including bees & ants');
    if (date==22) return {
        shortname: '-fish',
        title: 'list animals whose names end in -fish',
        rejection: function(guess_id, guess) {
            if (guess.endsWith('fish') || ID_TO_TITLE[guess_id].endsWith('fish')) return;
            return "That doesn't end in “fish”.";
        },
        orthographic: true,
        noun: 'fish'
    };
    if (date==24) {
        c = singleTaxonChallenge('bear', "there are only like 8 of them");
        c.duration_s = 25; c.increment_s = 5;
        return c;
    }
    if (date==25) {
        c = singleTaxonChallenge('rodent', 'from Latin <i>rōdēns</i>, “gnawing”');
        c.rejection = function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.rodent, guess_id)) return;
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guess_id)) return "That's a mustelid, not a rodent.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.mustelid, guess_id)) return "That's a marsupial, not a rodent.";
            return "Not a rodent.";
        }
        return c;
    }
    if (date==26) return alphabeticalChallenge;
    if (date==27) return singleTaxonChallenge('sauropsid', 'bird & reptiles');
    if (date==28) return singleTaxonChallenge('marsupial');
    if (date==29) return {
        shortname: '60-0',
        title: 'list animals in one minute',
        subtitle: 'no time bonus for listed animals',
        duration_s: 60, increment_s: 0,
        rejection: ()=>{},
        verbed: 'listed in 1 min'
    }
    if (date==30) return {
        shortname: 'invertebrate',
        title: 'list invertebrates until failure',
        subtitle: 'spineless animals',
        rejection: function(guess_id, guess) {
            if (ancestsOrIs(LOWER_TITLE_TO_ID.human, guess_id)) return "I definitely have a spine.";
            if (ancestsOrIs(LOWER_TITLE_TO_ID.vertebrata, guess_id)) return "That's a vertebrate.";
        }
    };
    //if (date==30) return singleTaxonChallenge('myriapod', 'centipedes & millipedes');
    if (date==31) return singleTaxonChallenge('owl');
    if (date==32) {
        c = singleTaxonChallenge('ant');
        c.rejection = (guess_id, guess) => {
            if (guess=='velvet ant') return "Velvet ants aren't actually ants. Sorry.";
            if (!ancestsOrIs(LOWER_TITLE_TO_ID.ant, guess_id)) return "Not an ant.";
        };
        c.duration_s = 20;
        c.increment_s = 4;
        return c;
    }
    if (date==NaN) return singleTaxonChallenge('tullimonstrum');
    return insectChallenge;
}

// bad?
// maybe ancestor_name, overrides=null?
function singleTaxonChallenge(ancestor_name, subtitle, ancestor_article, ancestor_name_plural) {
    ancestor_name_plural ||= ancestor_name + 's';
    ancestor_article ||= ancestor_name.match(/^[aeiou]/) ? 'an' : 'a';
    return {
        shortname: ancestor_name,
        title: "list " + ancestor_name_plural + " until failure",
        subtitle: subtitle,
        rejection: function(guess_id) {
            if (!ancestsOrIs(LOWER_TITLE_TO_ID[ancestor_name], guess_id)) {
                return "Not " + ancestor_article + " " + ancestor_name + ".";
            }
        },
        noun: ancestor_name,
        pluralNoun: ancestor_name_plural
    }
}
