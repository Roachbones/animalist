// Tiny little features nobody will notice, tucked away here so as not to clutter the mains.

function invalid_guess_egg_message(guess) {
    if (guess == 'help') {
        rules.open = true; return ' ';
    }
    if (guess == 'hint') {
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','pests','dinosaurs','fish. Many fish names just end in -fish']) + '.';
    }
    if (guess == 'dragon' || guess == 'jackalope' || guess == 'tsuchinoko') {
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
    if (guess_id == 'Q15978631') { return "That's me!"; }
    if (guess_id == 'Q1947892') { return "Don't you love their songs?"; }
    if (guess_id == 'Q134944') { return "Okay, I'll just... file that under Animalia, I guess."; }
    if (guess == 'featherless biped') { MONONYMS['Q15978631'] = ['𓅾']; return; }
}

function equivalence_egg_message(guess, guess_id) {
    
}

function ancestry_egg_message(guess, descendant_id, ancestor_id) {
    if (guess=='ermine' && ancestor_id=='Q28521') { return '(In North America, ermines are also called short-tailed weasels.)'; }
    if (descendant_id==LOWER_TITLE_TO_ID['stoat'] && ancestor_id=='Q28521') { return '(Stoats are also called short-tailed weasels.)'; }
    if (descendant_id=='Q53636' && ancestor_id==LOWER_TITLE_TO_ID['toad']) { return '(Toads are frogs.)'; }
    if (descendant_id==LOWER_TITLE_TO_ID['tortoise'] && ancestor_id==LOWER_TITLE_TO_ID['turtle']) {
        return '(English definitions of “turtle” and “tortoise” are inconsistent and contradictory.)';
    }
    if (descendant_id=='Q206070' && ancestor_id=='Q273291') { return "Yep, coconut crabs are hermit crabs. I didn't know either."; }
}

function egg_manipulate_li(li, guess, guess_id) {
    if (guess == 'longcat') {
        li.style.scale = '3 1';
    }
}
