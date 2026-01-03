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
    if (descendant_streak(major_groups.Bird, 16) && !document.body.classList.contains('sky')) {
        document.body.classList = ['sky']
        document.body.style.backgroundImage = 'url(media/clouds.svg?'+Date.now()+')'; // restart animation
    }
    if (descendant_streak('Q25371', 8)) {
        document.body.classList = ['water'];
        document.body.style = '';
    }
    if (descendant_streak('Q1357', 8)) {
        spider.style.display = 'block';
    }
    if (descendant_streak('Q28425', 3)) {
        bat.style.display = 'block';
    }
}

function invalid_guess_egg_message(guess) {
    if (guess == 'help') {
        rules.open = true; return ' ';
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
    if (guess=='zedonk' || guess=='zorse') {
        return "The "+guess+" doesn't have its own English Wikipedia page; it's merely a subheading on Zebroid.";
    }
    if (guess == 'xyzzy') { return 'Nothing happens.'; }
    if (guess == 'fish') { return 'Surely you can name a specific kind of fish. I believe in you!'; }
    if (guess == 'shellfish') { return "That's more of a culinary term. Try naming a specific shellfish."; }
    if (guess == 'haggis' || guess == 'wild haggis') { return 'Left-footed or right-footed?'; }
    if (guess == 'plankton') {
        queue_trivium("<a href=https://en.wikipedia.org/wiki/Plankton>read about plankton</a>");
        var m = "The term “plankton” actually refers to all drifting organisms lacking means to propel.";
        if (guesses.slice(-5).includes('sponge')) { m += " I know, Spongebob lied to you."; }
        return m;
    }
    if (guess=='zooplankton' || guess=='zooplankter' || guess=='plankter') {
        return 'Way too vague.';
    }
    if (guess=='scabie' || guess=='scabies') {
        queue_trivium("The word “scabies” actually comes from the Latin «<a href=//en.wiktionary.org/wiki/scabo#Latin>scabō</a>», a verb meaning to scratch or scrape. So while it's easy to assume that “scabies” refers to the parasites, but it basically just means “the itches”.");
        return "Nice try, but the animal that causes scabies isn't called “a scabie”."
    }
    if (guess=='ringworm') { return "That's a fungal infection, actually."; }
    if (guess=='pidgeon') {
        queue_trivium("“pidgeon” <a href=https://en.wiktionary.org/wiki/pidgeon#English>is actually a documented archaic spelling</a>, but it's considered incorrect nowadays.");
        return "Not actually spelled with a “d”.";
    }
    if (guess=='softshell crab' || guess=='soft shell crab' || guess=='soft shelled crab' || guess=='softshelled crab') {
        queue_trivium("You mentioned <a href=https://en.wikipedia.org/wiki/Soft-shell_crab>softshell crab</a>, and that got me thinking: I think it's one of the worst meats, morally. Like I'm not even vegan but imagine you get caught by a giant and she puts you in a jail cell with a shower. Eventually you decide to take a shower, and then the giant is like, “hey great, your clothes are off, now I don't have to bother shucking them!” And then puts you on a shelf for someone to buy, and then someone buys you and cooks you WHILE YOU'RE NAKED. So undignified");
        return "That's a culinary term for any crab killed while vulnerable from a recent molt.";

    }
    if (/^(sea )?a[mn]e[mn]o[mn]e$/.test(guess)) {
        queue_trivium("To remember how to spell “anemone”, consider the etymology: the Latin <i>anemone</i>; from Greek <i>anemonē</i> meaning “wind flower” or “daughter of the wind”, from <i>anemos</i> meaning “wind”. <i>anemos</i> comes from the Proto-Indo-European root <b>*ane-</b>, loosely meaning “to breathe”. This root is used for what seems to breathe: in other words, the <i>animate</i>, which comes from <i>anima</i> (meaning living being, soul, mind, passion, courage, anger, spirit, feeling) which comes from <b>*ane-</b>. Another word that comes from anima: <b>animal</b>!");
        return "Not quite how it's spelled.";
    }
    if (guess=='dear' && !guesses.includes('deer')) { return "Wrong spelling, dear."; }
    var h = h‌ash(guess);
    if (guess == 'hint' || h==613114319434169) {
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','dinosaurs','fish. Many fish names just end in -fish']) + '.';
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
    }
    if (guess=='ca' && !guesses.includes('cat')) {
        return "You probably meant cat instead of Ca (genus of moths) but whatever.";
    }
    if (guess=='house spider') {
        queue_trivium("The term “house spider” can refer to <a href=https://en.wikipedia.org/wiki/House_spider>multiple kinds of spider</a>, but it has <a href=extras/praiſe_of_the_houſe_Spider>a single entry in a 1600s bestiary that goes on and on about its wondrous beauty.</a>.");
    }
    if (guess=='elf') { return "Surely you mean the butterfly?"; }
    if (guess == 'featherless biped') { MONONYMS['Q15978631'] = ['𓅾']; return "That's me?"; }
    if (guess_id == 'Q15978631') { return "That's me!"; }
    if (guess_id == 'Q1947892') { return "Don't you love their songs?"; }
    if (guess_id == 'Q134944') { return "Okay, I'll just... file that under Animalia, I guess."; }
    var h = h‌ash(guess);
    if (
        h==5898045759296372 || h==7974293014591210 || h==2284322406280126 || h==268876411488211 || h==8279950606841495 || h==6858254965870390) {
        return "Thanks!";
    }
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
        li.style.position='relative';
        li.style.top='-200vh';
        li.style.transition='top 1s ease-in';
        setTimeout(()=>{ li.style.top=0; }, 10)
    }
}

function queue_trivium(html) {
    // TODO check for hash in localStorage.usedHashes?
    // localStorage.usedHashes += ' ' + h‌ash(html);
    let p = document.createElement('p');
    p.innerHTML = html;
    p.classList.add('trivium');
    for (e in p.children) { if (e.tagName=='A') { e.setAttribute('target','_blank') } }
    trivia.append(p);
}

function queue_final_trivia() {
    if (guessed_ids.includes('Q26972265') && guessed_ids.includes('Q38584')) {
        queue_trivium("You listed both dingos and dogs, so I gave you the benefit of the doubt, but <a href=https://en.wikipedia.org/wiki/Dingo#Taxonomy>there's disagreement on whether the dingo is its own species of canid, a subspecies of grey wolf, or simply a breed of dog.</a>");
    }
}

const {now:hash} = Date;
function h‌ash(str) {
  let h1 = 3735928559, h2 = 0x41c6ce57;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

