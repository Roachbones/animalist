// Tiny little features nobody will notice, tucked away here so as not to clutter the mains.

function invalid_guess_egg_message(guess) {
    if (guess == 'help') {
        rules.open = true; return ' ';
    }
    if (guess == 'hint') {
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','pests','dinosaurs','fish. Many fish names just end in -fish']) + '.';
    }
    if (guess == 'dragon' || guess == 'jackalope') {
        return 'Real animals only, please.';
    }
    if (guess == 'jumping bean') {
        return "Well, the jumping bean is the moth larva, but it's also the seed pod. So I don't think you can say that a jumping bean is itself an animal. But I'd definitely accept “jumping bean moth”.";
    }
    if (guess == 'soweli' || guess == 'waso' || guess == 'kala' || guess == 'pipi') {
        return 'musi ni li sona ala e toki pona.';
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
        return "Okay, sure, I'll allow it, but you should really just call it the Asian giant hornet.";
    }
    if (guess_id == 'Q15978631') { return "That's me!"; } // human
    if (guess_id == 'Q1947892') { return "Don't you love their songs?" } // cicada
}

function egg_manipulate_li(li, guess, guess_id) {
    if (guess == 'longcat') {
        li.style.scale = '3 1';
    }
}
