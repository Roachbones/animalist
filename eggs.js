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
    }
    if (descendant_streak('Q25371', 8)) {
        document.body.classList = ['water'];
    }
    if (descendant_streak('Q1357', 8)) {
        spider.style.display = 'block';
        visualshint.style.display = 'block';
    }
    if (descendant_streak('Q28425', 3)) {
        bat.style.display = 'block';
        visualshint.style.display = 'block';
    }
    if (descendant_streak('Q4867740', 3)) {
        snail.style.display = 'block';
        visualshint.style.display = 'block';
    }
    if (descendant_streak(LOWER_TITLE_TO_ID.crow, 7)) {
        bteq();
        visualshint.style.display = 'block';
    }
}

function swoop() {
    kettle.classList.add('swooping');
}

function invalid_guess_egg_message(guess) {
    if (guess=='dragon' || guess == 'jackalope' || guess == 'tsuchinoko' || guess=='bigfoot' || guess=='yeti') {
        return 'Real animals only, please.';
    }
    if (guess=='jumping bean') {
        return "Well, the jumping bean is the moth larva, but it's also the seed pod. So I don't think you can say that a jumping bean is itself an animal. But I'd definitely accept “jumping bean moth”.";
    }
    if (guess=='soweli' || guess == 'waso' || guess == 'kala' || guess == 'pipi') {
        return 'musi ni li sona ala e toki pona.';
    }
    if (guess=='zedonk' || guess=='zorse') {
        return "The "+guess+" doesn't have its own English Wikipedia page; it's merely a subheading on Zebroid.";
    }
    if (guess=='wolfdog') { return "Well, which is it? Wolf or dog?"; }
    if (guess=='xyzzy') { return 'Nothing happens.'; }
    if (guess=='fish') { return 'Surely you can name a specific kind of fish. I believe in you!'; }
    if (guess=='yellowfin') { return "So many fish have yellow fins. Can you be more specific?"; }

    if (guess=='plankton') {
        queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Plankton>read about plankton</a>");
        var m = "The term “plankton” actually refers to all drifting organisms lacking means to propel.";
        if (guesses.slice(-5).includes('sponge')) { m += " I know, Spongebob lied to you."; }
        return m;
    }
    if (guess=='zooplankton' || guess=='zooplankter' || guess=='plankter') {
        return 'Way too vague.';
    }
    if (guess=='phytoplankton') { return "“phyto” means “plant”."; }

    // Culinary terms
    if (guess=='softshell crab' || guess=='soft shell crab' || guess=='soft shelled crab' || guess=='softshelled crab') {
        queue_trivium("You mentioned <a href=https://en.wikipedia.org/wiki/Soft-shell_crab>softshell crab</a>, and that got me thinking: I think it's one of the worst meats, morally. Like I'm not even vegan but imagine you get caught by a giant and she puts you in a jail cell with a shower. Eventually you decide to take a shower, and then the giant is like, “hey great, your clothes are off, now I don't have to bother shucking them!” And then puts you on a shelf for someone to buy, and then someone buys you and cooks you WHILE YOU'RE NAKED. So undignified");
        return "That's a culinary term for any crab killed while vulnerable from a recent molt.";
    }
    if (guess=='shellfish') { return "That's more of a culinary term. Try naming a specific shellfish."; }
    if (guess=='kipper') { return "That's more of a culinary term; it's a herring or salmon corpse that has been split and salted."; }
    if (guess=='haggis' || guess == 'wild haggis') { return 'Left-footed or right-footed?'; }
    if (guess=='pork' || guess=='ham' || guess=='beef' || guess=='steak' || guess=='mutton' || guess=='veal') {
        return "That term only refers to the animal's corpse.";
    }
    if (guess=='cornish game hen' || guess=='cornish hen') { return "That's a culinary term. It's just chicken."; }
    if (guess=='imitation crab') return 'Really?';

    // Misspellings
    if (guess=='pidgeon' || guess.endsWith(' pidgeon')) {
        queue_trivium("“pidgeon” <a href=https://en.wiktionary.org/wiki/pidgeon#English>is actually a documented archaic spelling</a>, but it's considered incorrect nowadays.");
        return "Not actually spelled with a “d”.";
    }
    if (/^(sea )?a[mn]e[mn]o[mn]e$/.test(guess)) {
        queue_trivium("To remember how to spell “anemone”, consider the etymology: the Latin <i>anemone</i>; from Greek <i>anemonē</i> meaning “wind flower” or “daughter of the wind”, from <i>anemos</i> meaning “wind”. <i>anemos</i> comes from the Proto-Indo-European root <b>*ane-</b>, loosely meaning “to breathe”. This root is used for what seems to breathe: in other words, the <i>animate</i>, which comes from <i>anima</i> (meaning living being, soul, mind, passion, courage, anger, spirit, feeling) which comes from <b>*ane-</b>. Another word that comes from anima: <b>animal</b>!");
        return "Not quite how it's spelled.";
    }
    if (guess=='dear' && !guesses.includes('deer')) { return "Wrong spelling, dear."; }
    if (guess=='muscle' || guess=='mussle' && guessed_ids.includes(lower_title_to_id.mussel)) {
        queue_trivium("The modern spelling “mussel”, distinguished from “muscle”, has been recorded since the 1600s, but wasn't fully established until the 1870s.");
        return "Not quite how it's spelled.";
    }
    if (guess=='caterpiller') {
        // TODO review this one
        queue_trivium("“caterpillar” is spelled with “-pillar”, not “-piller”, but the etymology derives from the Middle English «<a href=https://en.wiktionary.org/wiki/piller#Etymology_1>piller</a>», meaning to plunder. Presumably because they eat so much.");
        return "It ends in -pillar, not -piller.";
    }
    if (guess=='lunar moth') { return "It's “luna”, actually."; }
    if (guess=='cheeta') { return "You're missing a letter."; }
    if (guess=='any') { return "Any what?"; }
    var h = h‌ash(guess);
    if (h==7182294905658010 || h==6344346315172974) { return "Adorable guess, but it's spelled “rosy”."; }

    // Just not animals
    if (guess=='algae' || guess=='seaweed') { return "No."; }
    if (guess=='amoeba') {
        queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Amoeba>Learn what an amoeba is</a>");
        return "Not really a kind of animal.";
    }
    if (guess=='bacteria') { return "Bacteria aren't animals."; }
    if (guess=='lichen') { return "That's a fungus/algae combination, not an animal."; }
    if (guess=='mushroom') { return "No, fungi aren't animals."; }
    if (guess=='slime mold') { return "Slime molds aren't animals."; }
    if (guess=='protozoa' || guess=='protozoan') { return "Not all protozoans are animals."; }
    if (guess=='ringworm') { return "That's a fungal infection, actually."; }
    if (guess=='scabie' || guess=='scabies') {
        queue_trivium("The word “scabies” actually comes from the Latin «<a href=//en.wiktionary.org/wiki/scabo#Latin>scabō</a>», a verb meaning to scratch or scrape. It's easy to assume that “scabies” refers to the parasites, but it basically just means “the itches”.");
        return "Nice try, but the animal that causes scabies isn't called “a scabie”."
    }
    if (guess=='tree') { return "Animals, not plants, please."; }
    if (guess=='yeast') { return "That's fungus."; }
    if (guess=='plant') { h1.innerText = "list ANIMALS until failure"; return ' '; }
    if (guess=='fungus') { return "No." }
    if (guess=='car') return "With wheels?";

    if (guess=='cryptobug') { return "That's a brand name."; }
    if (guess=='mockingjay') { return "Not actually a real bird."; }
    if (guess=='jabberjay') { return "Come on, you know that one's fictional."; }
    if (guess=='pikachu') { return "What? No. That is a Pokémon."; }
    if (guess=='black panther') { return "Not really a distinct animal."; }
    if (guess=='white elephant') { return "That's not really a distinct kind of elephant."; }
    if (guess=='kudu') { return 'Lesser or greater?'; }
    if (guess=='arctic seal') { return "Lots of seals live in the Arctic. Can you be more specific?"; }
    if (guess=='yellow butterfly') { return "Lots of butterflies are yellow. Can you be more specific?"; }
    if (guess=='green snake') { return "So many snakes are green. Which one?"; }
    if (guess=='brown squirrel') { return "That's not really a distinct kind of squirrel."; }
    if (guess=='mantaray') { return "It's two words, actually."; }
    if (guess=='carrier pigeon' || guess=='homing pigeon' || guess=='war pigeon' || guess=='mail pigeon' || guess=='messenger pigeon'
        || guess=='cleaner shrimp'
        || guess=='worker bee' || guess=='queen bee'
        || guess=='lab mouse' || guess=='laboratory mouse' || guess=='lab rat'
        || guess=='parasite') {
        return "That's more of an occupation, isn't it?";
    }
    if (guess=='polyp') { return "That's more of a shape, really."; }
    if (guess=='larva') { return "Many animals have a larval stage. Can you be more specific?"; }
    if (guess=='doe') {
        //todo trivium
        return "That can actually refer to a lot of different animals.";
    }

    if (guess=='secretariat' || guess=='clever hans' || guess=='potoooooooo') {
        return "If individuals counted, you could just name people.";
    }

    if (guess=='hint' || h==613114319434169 || (guess=='help' && (guessed_ids.length || rules.open))) {
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','dinosaurs','fish. Many fish names just end in -fish']) + '.';
    }
    if (guess=='help') { rules.open = true; return ' '; }
    if (h==6386118624072996) { return "You can't fool me."; }
}

awoo = 'awo';
function valid_guess_egg_message(guess, guess_id) {
    if (guesses.length <= 7 && (guess_id==LOWER_TITLE_TO_ID.human || guess_id==LOWER_TITLE_TO_ID.crow)) { bteq(); }
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
    if (guess=='pug') { return "I generously assume you mean the little brown moths called pugs."; }
    if (guess=='house spider') {
        queue_trivium("The term “house spider” can refer to <a href=https://en.wikipedia.org/wiki/House_spider>multiple kinds of spider</a>, but it has <a href=extras/praiſe_of_the_houſe_Spider>a single entry in a 1600s bestiary that goes on and on about its wondrous beauty.</a>.");
    }
    if (guess=='poodle moth') {
        queue_shy_trivium("I allowed “poodle moth”, but that's not really the name of an animal. An adorable photo captioned “Poodle moth, Venezuela” went viral after being taken in Canaima National Park in 2009. Its species is unknown; we only know it kinda resembles the poorly-understood <i>Artace</i> genus. So if you're in Venezuela, consider photographing moths!");
    }
    if (guess_id==LOWER_TITLE_TO_ID.oz && !guesses.includes('ounce')) {
        queue_shy_trivium("Snow leopards used to be called ounces."); // TODO elaborate w bestiary entry
    }
    if (guess=='elf') { return "Surely you mean the butterfly?"; }
    if (guess == 'featherless biped') { MONONYMS['Q15978631'] = ['𓅾']; return "That's me?"; }
    if (guess_id == 'Q15978631') { return "That's me!"; }
    if (guess_id == 'Q1947892') { return "Don't you love their songs?"; }
    if (guess_id == 'Q134944') { return "Okay, I'll just... file that under Animalia, I guess."; }
    if (ancests(LOWER_TITLE_TO_ID.wolf, guess_id) || (ancests(LOWER_TITLE_TO_ID.canina, guess_id) && guess.endsWith(" wolf"))) {
        awoo += 'o';
        return awoo + '!';
    } else { awoo='awo'; }
    var h = h‌ash(guess);
    if (h==5898045759296372 || h==7974293014591210 || h==2284322406280126 || h==268876411488211 || h==8279950606841495 || h==6858254965870390 || h==7434973200667552) {
        return "Thanks!";
    }
}

const DOGS_IS_THE_SAME = [
    "Dogs are dogs.",
    "That's still just a dog.",
    "Dogs are the same animal!",
    "They aren't that different!",
    "They're all the same!!",
    "Stop listing dogs!!"
]
dog_index = 0;
function equivalence_egg_message(guess, guess_id) {
    if (guess_id == 'Q10856' && (guess=='dove' || guess=='pigeon') && guesses.includes('dove') && guesses.includes('pigeon')) {
        return "Pigeons and doves are basically the same. They share a Wikipedia page.";
    }
    if (guess_id == 'Q18099' && (guess='bison' || guess=='buffalo') && guesses.includes('bison') && guesses.includes('buffalo')) {
        queue_trivium_once("You might argue this game should interpret “bison” as <a href=https://en.wikipedia.org/wiki/Bison><i>Bison bison</i>, aka the American buffalo</a>, and interpret “buffalo” as <a href=https://en.wikipedia.org/wiki/True_buffalo><i>true</i> buffalo</a>, but since the American (and <a href=https://en.wikipedia.org/wiki/European_bison>European</a>) bison are colloquially known as “buffalo”, I think it's fair to treat them as interchangable terms. So anyone wanting points for buffalo has to name a specific one, like the African buffalo or dwarf buffalo or water buffalo.");
        return "Sorry, but “buffalo” and “bison” have been interchanged for centuries.";
    }
    if (guess_id==LOWER_TITLE_TO_ID.dog && (!guesses.slice(0,-1).includes(guess) || !DOGS_IS_THE_SAME[0])) {
        if (dog_index > 3) { h1.innerText = "list animals OTHER THAN DOGS"; }
        return DOGS_IS_THE_SAME[dog_index++] || "Fuck you!!";
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
    if (descendant_id=='Q186946' && ancestor_id=='Q132379' && guesses.includes('dung beetle')) {
        return "(idk, some dung beetles are scarabs and some scarabs are dung beetles)";
    }
    if (descendant_id=='Q221612' && ancestor_id=='Q9482') {
        return "(Groundhogs are marmots, which are ground squirrels, which are squirrels.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.chipmunk && ancestor_id==LOWER_TITLE_TO_ID.squirrel) {
        return "(Chipmunks are squirrels.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.snail && ancestor_id==LOWER_TITLE_TO_ID.slug) {
        return "(The snail/slug line is blurry.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.termite && ancestor_id==LOWER_TITLE_TO_ID.roach) {
        return "(It's arguable, but Wikipedia calls termites “a group of detritophagous eusocial cockroaches”.)";
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
    if (guess == 'sidewinder') { li.style.rotate = '-90deg'; }
    if (guess_id = 'Q2525560') {
        li.classList.add('wheelspider')
    }
}

localStorage.triviaHashes ||= '';
function queue_trivium_once(html) {
    let h = h‌ash(html);
    if (!localStorage.triviaHashes.split(' ').includes(''+h)) {
        queue_trivium(html);
        localStorage.triviaHashes += ' ' + h;
    }
}

function queue_trivium(html) {
    let p = document.createElement('p');
    p.innerHTML = html;
    p.classList.add('trivium');
    for (e in p.children) { if (e.tagName=='A') { e.setAttribute('target','_blank') } }
    trivia.append(p);
}

shy_trivia = [] // trivia to only be shown alone, if there is no other eligible trivia; and then, only once
function queue_shy_trivium(html) {
    if (!localStorage.triviaHashes.split(' ').includes(''+h‌ash(html))) {
        shy_trivia.push(html);
    }
}

COMMONS = ['Q26972265','Q57818409','Q46889','Q10758650','Q140','Q18498','Q780','Q787','Q19939','Q29350771','Q13174621','Q659685','Q36396','Q685653','Q33609','Q36611','Q862089'];
YOU_FORGOT_STARS = [
    "You didn't list *.", "You left out *.",
    'Did * not cross your mind?', 'Next time, remember the humble *.',
    'What about *?', 'Never heard of a *?'
]
function queue_final_trivia() {
    if (guessed_ids.includes('Q26972265') && guessed_ids.includes('Q38584')) {
        queue_trivium_once("You listed both dingos and dogs, so I gave you the benefit of the doubt, but <a href=https://en.wikipedia.org/wiki/Dingo#Taxonomy>there's disagreement on whether the dingo is its own species of canid, a subspecies of grey wolf, or simply a breed of dog.</a>");
    }
    if (!trivia.innerText && Math.random() < .5) {
        try_queue_pic_for(guessed_ids[guessed_ids.length-1]);
    }
    if (!trivia.innerText && shy_trivia[0]) {
        queue_trivium_once(shy_trivia.pop());
    }
    shy_trivia = [];
    if (
        !trivia.innerText // No trivia so far
        && score > 1 // Enough guesses to criticize
        && guessed_descendant[LOWER_TITLE_TO_ID.bird] && guessed_descendant[LOWER_TITLE_TO_ID.insect] // Doesn't seem to be a challenge run like "only name birds"
    ) {
        for (common_id of COMMONS) {
            if (Math.random() < 0.1) break;
            if (!guessed_ids.includes(common_id) && !guessed_descendant[common_id]) {
                YOU_FORGOT_STAR = YOU_FORGOT_STARS[Math.floor(Math.random()**3 * YOU_FORGOT_STARS.length)];
                queue_trivium_once(YOU_FORGOT_STAR.replace('*',ID_TO_TITLE[common_id].toLowerCase()));
                break;
            }
        }
    }
}

function try_queue_pic_for(guess_id) {
    let pics = ID_TO_PICS[guess_id];
    if (pics) {
        return queue_pic_once(choice(pics));
    }
}

localStorage.picHashes ||= '';
function queue_pic_once(pic) {
    let h = h‌ash(pic.src);
    if (localStorage.picHashes.split(' ').includes(''+h)) { return 0; }
    localStorage.picHashes += ' ' + h;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.append(summary);
    summary.innerText = 'Photo of ' + (pic.title || pic.alt)
    const img = document.createElement('img');
    img.setAttribute('src', pic.src);
    img.setAttribute('alt', pic.alt);
    details.append(img);
    const p = document.createElement('p');
    p.innerHTML = pic.artist.attribution;
    details.append(p);
    details.classList.add('pic');
    trivia.append(details);
    return 1;
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


// https://www.celestialprogramming.com/snippets/moonage.html
const DAYS_PER_LUNAR_MONTH = 29.530588853;
function moonAge() {
    let jd = Date.now() / 86400000 + 2440587.5
    let f=((jd-2451550.1)/DAYS_PER_LUNAR_MONTH)%1;
    f=(f<0) ? f+1:f;
    return f*DAYS_PER_LUNAR_MONTH;
}
function isMoonFull() { return moonAge < DAYS_PER_LUNAR_MONTH+1 && moonAge > DAYS_PER_LUNAR_MONTH-1; }
LOWER_TITLE_TO_ID.werewolf = isMoonFull() ? LOWER_TITLE_TO_ID.wolf : LOWER_TITLE_TO_ID.human;


function bteq() {
    const BTEQ_BGS = ['babylon1.jpg','babylon2.jpg','dream2.jpg','dream.jpg','eq_1.jpg','eq_destroyed1.jpg','eq_destroyed2.jpg','eq_destroyed3.jpg','eq_destroyed4.jpg','eq_room2.jpg','library1.jpg','library2.jpg','mhouse2.jpg','mhouse.jpg','mroom1.jpg','mroom2.jpg','mroom3.jpg','mroom4.jpg','mroom5.jpg','sl_city1.jpg','sl_city2.jpg','sl_explore1.jpg','sl_explore3.jpg','sl_explore5.jpg','sl_explore7.jpg','sl_fly.jpg','sl_rave.jpg','stacks.jpg','ws_1.jpg','ws_2.jpg'];
    underlay.style.backgroundImage = "url(media/bteq/" + choice(BTEQ_BGS) + ")";
    underlay.style.backgroundBlendMode = 'hard-light';
    underlay.style.backgroundColor = 'var(--background-color)';
    underlay.style.animationName = 'none';
    visualshint.style.display = 'block';
    THANKS.push('check out <a href=https://suricrasia.online/bteq/ target=_blank><img src=media/bteq/logov.svg alt="Bridge to eQualia" style=max-height:4em;vertical-align:middle></a>');
}


minecraft_animal_names = [
    'armadillo','axolotl',
    'bat','bee',
    'camel','cat','chicken','cod','coral','cow',
    'dolphin','donkey',
    'fox','frog',
    'goat',
    'horse',
    'mule',
    'nautilus',
    'ocelot',
    'llama',
    'panda','parrot','pig','polar bear','pufferfish',
    'rabbit',
    'sheep','silverfish','spider','sponge','squid',
    'turtle',
    'wolf'
]
