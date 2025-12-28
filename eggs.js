// Tiny little features nobody will notice, tucked away here so as not to clutter the mains.


function ancests(possible_ancestor_id, guess_id) {
    var ancestor_id = PARENT[guess_id];
    while (PARENT[ancestor_id]) {
        if (ancestor_id == possible_ancestor_id) { return true; }
        ancestor_id = PARENT[ancestor_id];
    }
}

major_groups = {
    Bird: 'Q5113'
}

function descendant_streak(ancestor, length) {
    if (guessed_ids.length < length) { return false; }
    for (guess_id of guessed_ids.slice(-length)) {
        if (!ancests(ancestor, guess_id)) { return false; }
    }
    return true;
}

function progress_egg() {
    if (descendant_streak(major_groups.Bird, 20) && !document.body.classList.contains('sky')) {
        document.body.classList = ['sky']
        document.body.style.backgroundImage = 'url(media/clouds.svg?'+Date.now()+')'; // restart animation
    }
    if (descendant_streak('Q25371', 9)) {
        document.body.classList = ['water'];
        document.body.style = '';
    }
}

function invalid_guess_egg_message(guess) {
    if (guess == 'help') {
        rules.open = true; return ' ';
    }
    if (guess == 'hint') {
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','pests','dinosaurs','fish. Many fish names just end in -fish']) + '.';
    }
    if (guess == 'dragon' || guess == 'jackalope' || guess == 'tsuchinoko' || guess=='bigfoot') {
        return 'Real animals only, please.';
    }
    if (guess == 'jumping bean') {
        return "Well, the jumping bean is the moth larva, but it's also the seed pod. So I don't think you can say that a jumping bean is itself an animal. But I'd definitely accept “jumping bean moth”.";
    }
    if (guess == 'soweli' || guess == 'waso' || guess == 'kala' || guess == 'pipi') {
        return 'musi ni li sona ala e toki pona.';
    }
    if (guess == 'zedonk') {
        return "The zedonk doesn't have its own English Wikipedia page; it's merely a subheading on Zebroid.";
    }
    if (guess == 'xyzzy') { return 'Nothing happens.'; }
    if (guess == 'fish') { return 'Surely you can name a specific kind of fish. I believe in you!'; }
    if (guess == 'shellfish') { return "That's more of a culinary term. Try naming a specific shellfish."; }
    if (guess == 'haggis' || guess == 'wild haggis') { return 'Left-footed or right-footed?'; }
    if (guess == 'plankton') {
        var m = "The term “plankton” actually refers to all drifting organisms lacking means to propel.";
        if (guesses.slice(-5).includes('sponge')) { m += " I know, Spongebob lied to you."; }
        return m;
    }
    if (guess=='zooplankton' || guess=='zooplankter' || guess=='plankter') {
        return 'Way too vague.';
    }
    if (guess=='scabie' || guess=='scabies') {
        var m = "Nice try, but the animal that causes scabies isn't called “a scabie”."
        if (guesses.slice(0,-1).includes('scabie') || guesses.slice(0,-1).includes('scabies')) {
            m += " No, really. It's from a latin word meaning scratch or itch. So it basically means “the itches”.";
        }
        return m;
    }
    if (guess=='ringworm') { return "That's a fungal infection, actually."; }
    if (guess=='pidgeon') { return "Not actually spelled with a “d”."; }
    if (guess=='softshell crab' || guess=='soft shell crab' || guess=='soft shelled crab' || guess=='softshelled crab') {
        return "That's a culinary term for any crab killed while vulnerable from a recent molt.";
    }
}

function valid_guess_egg_message(guess, guess_id) {
    if (guess == 'unicorn') {
        return "You probably didn't mean the genus of goblin spider named after its characteristic pointed facial projection, but whatever, sure.";
    }
    if (guess == 'sphinx') {
        return 'You mean sphinx moths, right? Not the mythical riddlers?';
    }
    if (guess == 'mule') {
        return 'Kind of a weird case, but sure, it counts.';
    }
    if (guess == 'killer hornet') {
        return "Okay, I'll allow it, but you should just call it the Asian giant hornet.";
    }
    if (guess == 'anemone') {
        return 'An “anemone” is actually a flower that the sea anemone is named after. I guess nowadays the animal is better-known than its namesake.';
    }
    if (guess == 'sea urchin' && guesses.at(-1) == 'urchin') {
        return "Yeah. They're named after hedgehogs. Sea urchins are sea hedgehogs.";
    }
    if (guess == 'dingo' && guesses.includes('dog')) {
        return "Are you Australian?";
        // ID_TO_TITLE[LOWER_TITLE_TO_ID['dingo']] = 'Dingo (totally not a kind of dog)';
    }
    if (guess=='ca' && !guess.includes('cat')) {
        return "You probably meant cat instead of Ca (genus of moths) but whatever.";
    }
    if (guess == 'featherless biped') { MONONYMS['Q15978631'] = ['𓅾']; return "That's me?"; }
    if (guess_id == 'Q15978631') { return "That's me!"; }
    if (guess_id == 'Q1947892') { return "Don't you love their songs?"; }
    if (guess_id == 'Q134944') { return "Okay, I'll just... file that under Animalia, I guess."; }
}

function equivalence_egg_message(guess, guess_id) {
    if (guess_id == 'Q10856' && (guess=='dove' || guess=='pigeon') && guesses.includes('dove') && guesses.includes('pigeon')) {
        return "Pigeons and doves are basically the same. They share a Wikipedia page.";
    }
}

function ancestry_egg_message(guess, descendant_id, ancestor_id) {
    if (guess=='ermine' && ancestor_id=='Q28521') { return '(In North America, ermines are also called short-tailed weasels.)'; }
    if (descendant_id==LOWER_TITLE_TO_ID['stoat'] && ancestor_id=='Q28521') { return '(Stoats are also called short-tailed weasels.)'; }
    if (descendant_id==LOWER_TITLE_TO_ID['toad'] && ancestor_id=='Q53636') { return '(Toads are frogs.)'; }
    if (descendant_id==LOWER_TITLE_TO_ID['tortoise'] && ancestor_id==LOWER_TITLE_TO_ID['turtle']) {
        return '(English definitions of “turtle” and “tortoise” are inconsistent and contradictory.)';
    }
    if (descendant_id=='Q206070' && ancestor_id=='Q273291') { return "Yep, coconut crabs are hermit crabs. I didn't know either."; }
    if (ancestor_id=='Q127960' && guess=='panther') {
        return "I assume you mean “panther” in the general sense of any big cat.";
    }
    if (descendant_id=='Q1861297' && ancestor_id=='Q273291') {
        return "Yeah, there's an argument for king crabs to be considered hermit crabs. I can't blame you for disagreeing.";
    }
    if ((guess=='ox' || guess=='oxen') && (guesses.includes('cow') || guesses.includes('cattle') || guesses.includes('bull'))) {
        return "An ox is just a bovine trained to pull stuff.";
    }
    //if (descendant_id=='Q727919' && ancestor_id=='Q83902') {
    //    return "(Some katydids have been called long-horned grasshoppers.)";
    //}
}

function egg_manipulate_li(li, guess, guess_id) {
    if (guess == 'longcat') {
        li.style.scale = '3 1';
    }
    if (guess == 'dropbear' || guess == 'drop bear') {
        // todo animation
    }
}
