// Tiny little features nobody will notice, tucked away here so as not to clutter the mains.


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
    if (guess=='me') return "And what are you?";
    if (guess=='dragon' || guess == 'jackalope' || guess == 'tsuchinoko' || guess=='bigfoot' || guess=='yeti') {
        return 'Real animals only, please.';
    }
    if (guess=='jumping bean') {
        return "Well, the jumping bean is the moth larva, but it's also the seed pod. So I don't think you can say that a jumping bean is itself an animal. But I'd definitely accept “jumping bean moth”.";
    }
    if (guess=='semislug' || guess=='semi slug' || guess=='quasislug' || guess=='quasi slug') {
        return "I don't know that animal. Sorry, I'm not that slug-savvy.";
    }
    if (guess=='soweli' || guess == 'waso' || guess == 'kala' || guess == 'pipi' || guess=='akesi') {
        return 'musi ni li sona ala e toki pona.';
    }
    if (guess=='zedonk' || guess=='zorse') {
        return "The "+guess+" doesn't have its own English Wikipedia page; it's merely a subheading on Zebroid.";
    }
    if (guess=='wolfdog') { return "Well, which is it? Wolf or dog?"; }
    if (guess=='xyzzy') { return 'Nothing happens.'; }
    if (guess=='fish') { return 'Surely you can name a specific kind of fish. I believe in you!'; }
    if (guess=='invertebrate' || guess=='invert') return "97% of animals are invertebrates. Surely you can be more specific?";
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
    if (guess=='kipper') { return "That's more of a culinary term; it's a herring or salmon corpse, split and salted."; }
    if (guess=='haggis' || guess == 'wild haggis') { return 'Left-footed or right-footed?'; }
    if (guess=='pork' || guess=='ham' || guess=='beef' || guess=='steak' || guess=='mutton' || guess=='veal' || guess=='escargot') {
        return "That term only refers to the animal's corpse.";
    }
    if (guess=='cornish game hen' || guess=='cornish hen') { return "That's a culinary term. It's just chicken."; }
    if (guess=='imitation crab') return 'Really?';
    if (guess=='roe') return "I don't think that counts.";
    if (guess=='thagomizer') return "That's just the tail.";

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
    if ((guess=='muscle' || guess=='mussle') && !guessed_ids.includes(LOWER_TITLE_TO_ID.mussel)) {
        queue_trivium("The modern spelling “mussel”, distinguished from “muscle”, has been recorded since the 1600s, but wasn't fully established until the 1870s.");
        return "Not quite how it's spelled.";
    }
    if (guess=='pink toed tarantula') return "It's “pinktoe”, actually.";
    if (LOWER_TITLE_TO_ID[guess.replace('black tipped','blacktip')]) return "It's “blacktip”, actually.";
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
    if (guess=='cuddlefish') return "Cute, but it's actually “cuttlefish”.";

    // Just not animals
    if (guess=='algae' || guess=='seaweed') { return "No."; }
    if (guess=='kelp') return "Not a plant, but not an animal either.";
    if (guess=='amoeba') {
        queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Amoeba>Learn what an amoeba is</a>");
        return "Not really a kind of animal.";
    }
    if (guess=='bacteria') { return "Bacteria aren't animals."; }
    if (guess=='e coli' || guess=='e. coli') { return "That's bacteria."; }
    if (guess=='lichen') { return "That's a fungus/algae combination, not an animal."; }
    if (guess=='mushroom') { return "No, fungi aren't animals."; }
    if (guess=='slime mold') { return "Slime molds aren't animals."; }
    if (guess=='protozoa' || guess=='protozoan') { return "Not all protozoans are animals."; }
    if (guess=='ringworm') { return "That's a fungal infection, actually."; }
    if (guess=='scabie' || guess=='scabies') {
        queue_trivium("The word “scabies” actually comes from the Latin «<a href=//en.wiktionary.org/wiki/scabo#Latin>scabō</a>», a verb meaning to scratch or scrape. It's easy to assume that “scabies” refers to the parasites, but it basically just means “the itches”.");
        return "Nice try, but the animal that causes scabies isn't called “a scabie”."
    }
    if (guess=='tree' || guess=='moss' || guess=='flower' || guess=='apple' || guess=='venus flytrap' || guess=='venus fly trap') { return "Animals, not plants, please."; }
    if (guess=='yeast') { return "That's fungus."; }
    if (guess=='mold') { return "That's fungus, typically."; }
    if (guess=='plant') { h1.innerText = "list ANIMALS until failure"; return ' '; }
    if (guess=='fungus' || guess=='fungi' || guess=='virus' || guess=='diatom' || guess=='germ' || guess=='cordyceps') { return "No." }
    if (guess=='car') return "With wheels?";
    if (guess=='funnel web' || guess=='funnelweb') return "Just the web?";
    if (guess=='star') return "So close! That is a shape.";
    if (guess=='mantaray' || guess=='fruitbat' || guess=='dungbeetle' | guess=='spidermonkey') {
        return "It's two words, actually.";
    }
    if (guess=='sand piper') { return "It's one word, actually."; }
    if (guess=='dumbo squid') return "It's an octopus, actually.";

    if (guess=='cryptobug') { return "That's a brand name."; }
    if (guess=='mockingjay') { return "Not actually a real bird."; }
    if (guess=='jabberjay') { return "Come on, you know that one's fictional."; }
    if (guess=='pikachu') { return "What? No. That is a Pokémon."; }
    if (guess=='dewgong') { return "That's the Pokémon."; }
    if (guess=='black panther') { return "Not really a distinct animal."; }
    if (guess=='white elephant') { return "That's not really a distinct kind of elephant."; }
    if (guess=='kudu') { return 'Lesser or greater?'; }
    if (guess=='arctic seal') { return "Lots of seals live in the Arctic. Can you be more specific?"; }
    if (guess=='yellow butterfly') { return "Lots of butterflies are yellow. Can you be more specific?"; }
    if (guess=='green snake') { return "So many snakes are green. Which one?"; }
    if (guess=='brown squirrel') { return "That's not really a distinct kind of squirrel."; }
    if (guess=='carrier pigeon' || guess=='homing pigeon' || guess=='war pigeon' || guess=='mail pigeon' || guess=='messenger pigeon'
        || guess=='cleaner shrimp'
        || guess=='worker bee' || guess=='queen bee'
        || guess=='lab mouse' || guess=='laboratory mouse' || guess=='lab rat'
        || guess=='parasite'
        || guess=='harvester ant'
        || guess=='woodboring beetle' || guess=='wood boring beetle') {
        return "That's more of an occupation, isn't it?";
    }
    if (guess=='flying ant') {
        queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Nuptial_flight target=_blank>Ant colonies reproduce by sending off <dfn>alates</dfn> (winged individuals) to mate and create new nests. The queen sheds its wings once it settles down.</a>");
        return "Most ant colonies produce winged individuals from time to time.";
    }
    if (guess=='polyp') { return "That's more of a shape, really."; }
    if (guess=='larva' || guess=='larvae') { return "Many animals have a larval stage. Can you be more specific?"; }
    if (guess=='doe') {
        //todo trivium
        return "That can actually refer to a lot of different animals.";
    }

    if (guess=='secretariat' || guess=='clever hans' || guess=='potoooooooo' || guess=='wojtek') {
        return "If individuals counted, you could just name people.";
    }
    if (guess=='nemo') return "And what kind of fish is he?";

    if (guess=='hint' || h==613114319434169 || (guess=='help' && (guessed_ids.length || rules.open))) {
        if (currentChallenge) return "Maybe read Wikipedia later.";
        return choice(['Try thinking of ']) + choice(['bugs','farm animals','dinosaurs','fish. Many fish names just end in -fish']) + '.';
    }
    if (guess=='help') { rules.open = true; return ' '; }
    if (guess=='a') return "No need to recite the alphabet.";
    if (h==6386118624072996) { return "You can't fool me."; }
}

awoo = 'awo';
function valid_guess_egg_message(guess, guess_id) {
    if (guesses.length <= 7 && (guess_id==LOWER_TITLE_TO_ID.human || guess_id==LOWER_TITLE_TO_ID.crow)) { bteq(); }
    if (guess=='crab') return "(Carcinization makes it hard to define “crab”, so I'm pretending you said “brown crab”.)";
    if (guess == 'unicorn') {
        return "You probably didn't mean the genus of goblin spider named after its characteristic pointed facial projection, but whatever, sure.";
    }
    if (guess == 'sphinx') {
        return 'You mean sphinx moths, right? Not the mythical riddlers?';
    }
    if (guess == 'mule') {
        return 'Kind of a weird case, but sure, it counts.';
    }
    if (guess == 'sturddlefish') return "I GUESS?";
    if (guess_id=='Q131216') return "If you say so.";
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
    if (guess=='parakeet') return "(“parakeet” is dialectal so I'm not sure which bird(s) you mean, exactly.)";
    if (guess=='house spider') {
        queue_trivium("The term “house spider” can refer to <a href=https://en.wikipedia.org/wiki/House_spider>multiple kinds of spider</a>, but it has <a href=extras/praiſe_of_the_houſe_Spider>a single entry in a 1600s bestiary that goes on and on about its wondrous beauty.</a>.");
    }
    if (guess=='poodle moth') {
        queue_shy_trivium("I allowed “poodle moth”, but that's not really the name of an animal. An adorable photo captioned “Poodle moth, Venezuela” went viral after being taken in Canaima National Park in 2009. Its species is unknown; we only know it kinda resembles the poorly-understood <i>Artace</i> genus. So if you're in Venezuela, consider photographing moths!");
    }
    if (guess_id==LOWER_TITLE_TO_ID.oz && !guesses.includes('ounce')) {
        queue_shy_trivium("Snow leopards used to be called ounces."); // TODO elaborate w bestiary entry
    }
    if (h‌ash(guess_id)==5714064253812690){
        queue_shy_trivium(
            '<a href=https://' + ID_TO_TITLE[guess_id] + 's.com target=_blank><img src=https://' + ID_TO_TITLE[guess_id] + 's.com/button.png width=88 height=31></a>'
        );
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
    "Stop listing dogs!!",
    "THAT'S A DOG AGAIN!!"
]
dog_index = 0;
function equivalence_egg_message(guess, guess_id) {
    if (guess_id == 'Q10856' && (guess=='dove' || guess=='pigeon') && guesses.includes('dove') && guesses.includes('pigeon')) {
        return "Pigeons and doves are basically the same. They share a Wikipedia page.";
    }
    if (guess_id == 'Q18099' && (guess=='bison' || guess=='buffalo') && guesses.includes('bison') && guesses.includes('buffalo')) {
        queue_trivium_once("You might argue this game should interpret “bison” as <a href=https://en.wikipedia.org/wiki/Bison><i>Bison bison</i>, aka the American buffalo</a>, and interpret “buffalo” as <a href=https://en.wikipedia.org/wiki/True_buffalo><i>true</i> buffalo</a>, but since the American (and <a href=https://en.wikipedia.org/wiki/European_bison>European</a>) bison are colloquially known as “buffalo”, I think it's fair to treat them as interchangable terms. So anyone wanting points for buffalo too has to name a specific one, like the African buffalo or dwarf buffalo or water buffalo.");
        return "Sorry, but “buffalo” and “bison” have been interchanged for centuries.";
    }
    if (guess=='parakeet' && guesses.includes('parrot')) {
        return "(Sorry, “parakeet” is dialectal so I'm not sure which bird(s) you mean.)";
    }
    if ((guess=='possum' && guesses.includes('opossum')) || (guess=='opossum' && guesses.includes('possum'))) {
        queue_shy_trivium("Some would have you believe “possum” and “opossum” are mutually exclusive terms, but in colloquial language they are interchangeable. For example, the Virginia (o)possum is called both. The Wikipedia page for Possum even starts “The possums (sometimes opossums)”.");
        return "Sorry but they're used interchangeably.";
    }
    if (guess_id==LOWER_TITLE_TO_ID.dog && (!guesses.slice(0,-1).includes(guess) || !DOGS_IS_THE_SAME[0])) {
        if (dog_index > 3) { h1.innerText = h1.innerText.replace("until failure", "OTHER THAN DOGS") }
        return DOGS_IS_THE_SAME[dog_index++] || "NO!";
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
    if (descendant_id=='Q30359' && ancestor_id=='Q9482') {
        return "(Prairie dogs are ground squirrels.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.marmot && ancestor_id==LOWER_TITLE_TO_ID.squirrel) {
        return "(Marmots are large ground squirrels.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.chipmunk && ancestor_id==LOWER_TITLE_TO_ID.squirrel) {
        return "(Yes, chipmunks are squirrels.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.snail && ancestor_id==LOWER_TITLE_TO_ID.slug) {
        return "(The snail/slug line is blurry.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.termite && ancestor_id==LOWER_TITLE_TO_ID.roach) {
        return "(It's arguable, but Wikipedia calls termites “a group of detritophagous eusocial cockroaches”.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.rattlesnake && ancestor_id==LOWER_TITLE_TO_ID.viper) {
        return "(Rattlesnakes are pit vipers.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.wallaby && ancestor_id==LOWER_TITLE_TO_ID.kangaroo) {
        return "(I know they're usually different, but the antilopine wallaroo is called either.)";
    }
    if (descendant_id=='Q499627' && ancestor_id==LOWER_TITLE_TO_ID.ladybug && guesses.includes('ladybug')) {
        return "(Yes, the Asian lady beetle is a ladybug.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID['king cobra'] && ancestor_id==LOWER_TITLE_TO_ID.cobra) {
        return "(I know king cobras aren't “true cobras”, but come on, it has cobra in the name)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.mosquito && ancestor_id == LOWER_TITLE_TO_ID.fly) {
        if (guess=='fly') { // you don't know what a fly is if you're guessing it after mosquito
            queue_shy_trivium("A “fly” is an insect with one pair of wings. Other winged insects typically have two pairs. Dragonflies, damselflies, and dobsonflies aren't flies. Crane flies, robber flies, gnats, and mosquitos are flies.");
        }
        return "(Yes, mosquitos are flies.)";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.bobcat && ancestor_id==LOWER_TITLE_TO_ID.lynx) {
        if (guess=='lynx') queue_shy_trivium("<a href=https://en.wikipedia.org/wiki/Bobcat target=_blank>The bobcat is also known as the <i>bay lynx</i> or <i>red lynx</i>.</a>");
        return "Yes, bobcats are lynxes. If you want credit for both, name one of the other three lynxes.";
    }
    if (descendant_id==LOWER_TITLE_TO_ID.elk && ancestor_id==LOWER_TITLE_TO_ID.deer) return "(Yes, elk are deer.)";
    if (descendant_id==LOWER_TITLE_TO_ID.moose && ancestor_id==LOWER_TITLE_TO_ID.deer) return "(Yes, moose are deer.)";
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
    if (guess_id == 'Q2525560') {
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
    if (queuedTrivia.has(html)) return;
    queuedTrivia.add(html);
    let p = document.createElement('p');
    p.innerHTML = html;
    p.classList.add('trivium');
    for (e in p.children) { if (e.tagName=='A') { e.setAttribute('target','_blank') } }
    trivia.append(p);
}

shy_trivia = [] // trivia to only be shown alone, if there is no other eligible trivia; and then, only once
function queue_shy_trivium(html) {
    if (queuedTrivia.has(html)) return;
    if (!localStorage.triviaHashes.split(' ').includes(''+h‌ash(html))) {
        shy_trivia.push(html);
    }
}

COMMONS = ['Q26972265','Q57818409','Q140','Q10758650','Q780','Q19939','Q787','Q29350771','Q18498','Q13174621','Q2372824','Q36396','Q862089','Q685653','Q32789','Q36611','Q7386','Q31431','Q13410384','Q23390','Q12404854','Q11788','Q25537662','VEAGLE','Q168366','Q7372','Q1357','Q25312'];
COMMONS = ['Q26972265','Q57818409','Q46889','Q140','Q10758650','Q780','Q19939','Q787','Q29350771','Q18498','Q13174621','Q2372824','Q36396','Q862089','Q33609','Q685653','Q10856','Q32789','Q36611','Q7386','Q31431','Q13410384','Q23390','Q12404854','Q11788','Q33602','Q188879','Q25537662','VEAGLE','Q168366','VFOX','Q122783','Q26843','Q34706','Q7372','Q18099','Q23193','Q182968','Q4126704','Q1357','VCROW','Q19707','Q53636','Q34505','Q23907','Q7556','Q9147','Q36101','Q43169','Q25312','Q530397','Q34718','Q36341','Q35517','Q15978631','Q40152','Q171004','Q7391','Q9482','Q42196','Q41050','Q129026','Q35255','Q756153','Q5113','VGOOSE','Q223044','Q6146274','Q40802','Q6573',/*'Q1251421' wasp,*/'VRAVEN','Q472616','Q7367','VHAWK','Q121439','Q15879','Q22671','Q30263','Q127960','Q42046','Q2699803','Q1038113','Q81900','Q208490','Q199758','Q35694','Q25522','Q460967','Q46076','Q213383','Q4867740','Q25349','Q28425','Q25327','Q41960','Q123141','Q25309','Q44299','Q972452','Q56057','Q6596143','Q46360','Q25222','Q58697','Q21834','Q2576337','Q3887135','Q128685','VCOBRA','Q28922','Q2274076','Q80117','Q180404','Q1192405','Q1075697','Q6120','Q127216','Q47542','Q677014','Q1725788','Q113297','Q81214','Q39624','Q15343','VRATTLESNAKE','Q2857311','Q43794','Q79803','VSWAN','Q41692','Q93208','Q270748','Q132631','Q7375','Q4504','Q858444','Q205531','Q43447','Q43489','VVULTURE','Q209067','Q3901583','Q131538','Q271218','Q16546828','Q200184','Q102470','Q131250','Q178973','Q199788','Q42569','Q188622','Q190858','Q14332','Q19125','Q20958','Q61865','Q3174175','Q11906411','Q188212','Q102857','Q40994','Q80066','Q159429','Q167367','Q334422','Q5328202','Q38584','Q546583','Q53663','Q107411','Q59576','Q43624','Q201701','Q80378','Q132072','Q74363','Q83902','Q82738','Q25407','Q161829','Q147256','Q1479472','Q28319','Q124378','Q122181742','Q19610691','Q47867','Q134015','Q30197','Q131907','Q14403','Q217129','Q46212','Q25439','Q159426','Q37686','Q13537131','Q19413','Q85752125','Q25317','Q164327','Q1536199','Q19537','Q212398','Q182573','Q474636','Q28521','Q166111','Q42797','Q1149509','Q1325045','Q132905','Q132379','Q144923','Q8332','Q206948','Q221612','Q83244','Q649817','Q185038','Q163656','Q302006','Q130888','Q150578','Q160835','Q83483','Q1178471','Q10304508','Q7609','Q2729629','Q47328','Q22718','Q55805','Q43502','Q108675804','Q1190541','Q14384','Q271634','Q53750','Q219329','Q388162','Q43642','Q36715','Q179204','Q39861','Q127470','Q23175','Q134964','Q242602','Q21824','Q25348','Q18789','Q468500','Q1144302','Q228241','Q14388','Q18960','Q756859','Q25345','Q4802403','Q33261','Q215887','Q188029','Q430','Q853286','Q42710','Q48186','Q215388','Q25234','Q457471','Q1315837','Q149069','Q284352','Q185215','Q10867','Q10802953','Q25420','Q311761','Q6481228','Q273291','Q475711','Q192930','Q170177','Q185230',/*'Q2280962' newt,*/'Q1861297','Q17141247','Q168473','Q30535','Q18926800','Q3246258','Q4388','Q131564','Q9490','Q190691','Q13408062','Q11687','Q41181','Q59577','Q492841','Q25365','Q4790721','Q135119','Q208600','Q188717','Q28507','Q31448','Q1390','Q125525','Q5194','Q25332','Q743973','Q26733','Q214145','Q80479','Q133006','Q187986','Q10627','Q1075355','Q30359','Q650212','Q3645260','Q159404','Q1947892','Q41631','Q25432','Q17700','Q41407','Q8154335','Q165278','Q184858','Q188690','Q13098211','Q183350','Q14334','Q43012','Q258244','Q1311395','Q839823','Q147873','Q55651528','Q1358','Q186946','Q1329239','Q220457','Q3222766','Q173128','Q1280912','Q3549947','Q81228','Q29498','Q35076','Q3745367','Q540649','Q193921','Q134436','Q272206','Q253941','Q80952','Q5883','Q185939','Q4989113','Q327028','Q26842','Q131567','Q168327','Q17149','Q121221','Q2191516','Q1210085','Q514809','VGALÁPAGOS_TORTOISE','Q940337','Q178202','Q214278','Q2165737','Q157875','Q40171','Q2075952','Q15122569','Q30153','Q754747','Q460286','Q1527843','Q478759','Q1031335','Q2396858','Q69581','Q190469','Q185237','Q844839','Q208304','Q159918','Q82037','Q201231','Q25404','Q183686','Q430342','Q1044378','Q756901','Q177601','Q723435','Q181871','Q4164940','Q273179','Q1165550','Q81515','Q591305','Q220328','Q334855','Q25418','Q192662','Q457267','Q739059','Q504247','Q207058','Q192056','Q182209','Q25661318','Q905354','Q726151','Q173651','Q464424','Q276290','Q882668','Q280949','Q185231','Q73901','Q205329','Q750027','Q5185','Q185385','Q42326','Q208786','Q134747','Q641142']
YOU_FORGOT_STARS = [
    "You didn't list *.", "You left out *.",
    'Did * not cross your mind?', 'Next time, remember the humble *.',
    'What about *?', 'Never heard of a *?'
]
function queue_final_trivia() {
    currentChallenge?.queueFinalTrivia?.();
    if (guessed_ids.includes('Q26972265') && guessed_ids.includes('Q38584')) {
        queue_trivium_once("You listed both dingos and dogs, so I gave you the benefit of the doubt, but <a href=https://en.wikipedia.org/wiki/Dingo#Taxonomy>there's disagreement on whether the dingo is its own species of canid, a subspecies of grey wolf, or simply a breed of dog.</a>");
    }
    if (guessed_ids.includes('Q200442') && guessed_ids.includes('Q18498')) {
        queue_shy_trivium("The red wolf's classification as a species has long been contentious. Some consider it a subspecies of grey wolf or a coyote-wolf hybrid.");
    }
    if (!trivia.innerText) {
        let sharks = 0; // todo optimize
        for (guessed_id of guessed_ids) {
            if (ID_TO_TITLE[guessed_id]?.endsWith('shark') || ancests(LOWER_TITLE_TO_ID.shark, guessed_id)) sharks++;
        }
        if (sharks > 7) queue_trivium_once('Sharks are older than trees.');
    }
    if (!trivia.innerText && shy_trivia[0]) {
        queue_trivium_once(shy_trivia.pop());
    }
    shy_trivia = [];
    if (!trivia.innerText) {
        try_queue_pic_for(guessed_ids[0]);
        if (try_queue_pic_for(guessed_ids[guessed_ids.length-1])) return;
        for (let i=guessed_ids.length; i > 0; i--) {
            if (try_queue_pic_for(guessed_ids[i]) || Math.random() > 0.9) break;
        }
    }
    if (
        !trivia.innerText // No trivia so far
        && (score > 9 || currentChallenge) // Enough guesses to criticize
        && (
            currentChallenge
            || guessed_descendant[LOWER_TITLE_TO_ID.bird] && guessed_descendant[LOWER_TITLE_TO_ID.insect] // Doesn't seem to be a self-imposed challenge like "only name birds"
        )
    ) {
        for (common_id of COMMONS) {
            if (Math.random() < 0.00) break; // TODO change back to .05
            if (currentChallenge?.rejection?.(common_id, ID_TO_TITLE[common_id].toLowerCase())) continue;  // If these common animal isn't allowed per the challenge, skip it
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
    if (!pics) return;
    for (pic of pics) {
        if (queue_pic_once(pic)) return 1;
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
    summary.innerText = 'photo of ' + (pic.title || pic.alt)
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
