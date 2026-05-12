CM_URL = 'https://iplayif.com/?story=https%3A%2F%2Fgithub.com%2Fi7%2Fcounterfeit-monkey%2Freleases%2Fdownload%2Fr11.1%2FCounterfeitMonkey-11.gblorb';
CUSTOM_ADS = [
    '<a target=_blank href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/alink01.gif alt="Unicorn Jelly HYPER CUTE FUN unicornjelly.com"></a>',
    '<a target=_blank href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/unijelly.gif alt="Unicorn Jelly Online Comic MangaStrip Hyper Cute-Cute Super Sweet Fun!"></a>',
    '<a target=_blank href='+CM_URL+' title="Unsponsored ad for Counterfeit Monkey, a game I like"><img src=ads/Atlantida-Squid.png alt="A squid lounges in the embrace of an Atlantean icon."></a>',
    '<a target=_blank href='+CM_URL+' title="Unsponsored ad for a game I like"><img src=ads/MediumCover.png alt="Counterfeit Monkey, a game of word manipulation"></a>',
    "<a target=_blank href=https://en.wikipedia.org/wiki/Tomato title='Unsponsored ad for a vegetable I like' style=color:tomato;background-color:white;padding:2vh;display:block><strong>Tomatoes</strong> 🍅 they're food</a>",
    "<a target=_blank href=https://bogleech.com/TENTA><img src=ads/tenta.png alt=octopus></a>",
    "<a target=_blank href=https://www.giantitp.com/comics/oots0001.html title='Unsponsored ad for a webcomic I like'><img src=ads/ootssquare.gif alt='Order of the Stick'></a>",
    "<a target=_blank href=https://pipi.la title='fun platformer'><img src=https://rose.systems/88x31/i/mokumun.gif alt='o moku e mun' style=zoom:4;image-rendering:pixelated></a>",
    "<a target=_blank href=https://webtiles.kicya.net/ title='grid of silly webpages'><img src=ads/webtiles.png alt='WebTiles' style=max-height:5em></a>",
    "<a target=_blank href=https://query.44203.online/topic/visor/ style=color:#49c2a5;background-color:black;padding:2vh;display:block;font-variant:small-caps;font-weight:bold><em>how</em> Δ-44203 built a visor and <em>why</em></a>",
    "<a target=_blank href=https://en.wikipedia.org/wiki/Feminizing_hormone_therapy#Effects title='I just think everyone should know their options'><img src=ads/hrt.jpg alt='spironolactone and estradiol pills'><br><span style=padding:1em;background-color:#b3b5b7;color:#327277>eating these makes you change. <b>find out how</b></span></a>",
    '<a target=_blank href=https://suricrasia.online/bteq/ title="Unsponsored ad for a story I like"><img src=media/bteq/logov.svg alt="Bridge to eQualia" style=max-height:4em></a>',
    '<iframe width=200 height=200 src=https://robinsaviary.com/translink-frame frameBorder=0 scrolling=no></iframe><p>oh no you got a distracting one that refreshes every 30 seconds<p><small>(these are random indie sites I have not vetted)</small>',
    '<iframe width=200 height=200 src=https://bang1338.nekoweb.org/neko.html></iframe><p>oh no you got a distracting one that refreshes every 30 seconds<p><small>(these are random indie sites I have not vetted)</small>',
    '<iframe width=180 height=180 src=https://evehibi.nekoweb.org/ringlink/></iframe><p>oh no you got a distracting one that refreshes every 30 seconds<p><small>(these are random webrings I have not vetted)</small>',
    '<a target=_blank href=https://slimebeast.com/burger/ title="Unsponsored ad for... what? huh?"><img src=https://slimebeast.com/burger/images/spots/banner2.gif alt="YOU WON&quot;T BELIEVE IT&quot;S FOOD!"></a>',
    //`<div class="wikipediauserbox" style="border-color:green;border-width:1px;border-style:solid"><table role="presentation" style="background:lightgreen;color:inherit"><tbody><tr><td class="userbox-info">Userboxes can come in many different styles and colors.</td><td class="userbox-id2" style="background:green;color:inherit"><span typeof="mw:File"><a href="//en.wikipedia.org/wiki/File:Crystal_package-plain.svg" class="mw-file-description"><img src="//upload.wikimedia.org/wikipedia/commons/thumb/2/22/Crystal_package-plain.svg/40px-Crystal_package-plain.svg.png" decoding="async" width="40" height="40" class="mw-file-element" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/22/Crystal_package-plain.svg/120px-Crystal_package-plain.svg.png 2x" data-file-width="240" data-file-height="240"></a></span></td></tr></tbody></table></div>`
]



function cycleAd(n) {
    if (Math.random() < 0) { // increase probability when johnvertisements gets their act together
        vert.classList = ['john'];
        johnvertisement.src = johnvertisement.dataset.src;
    } else {
        vert.classList = ['rose'];
        rosevertisement.innerHTML = n ? CUSTOM_ADS[CUSTOM_ADS.length - n] : choice(CUSTOM_ADS);
    }
}

function tryPremiumCode(code) {
    if (code != code.toUpperCase()) return;
    h = h‌ash(code);
    if (keyHashes.has(h)) {
        // todo fancy animation
        fetch(
            "https://guestbook.rose.systems/animalspremium",
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({k:code,r:document.referrer}),
            }
        )
        localStorage.premiumKey = code;
        enablePremium();
    }
}

function verifyKey() { // todo inline for additional mischief?
    return localStorage.premiumKey && keyHashes.has(h‌ash(localStorage.premiumKey));
}

function enablePremium() {
    PREMIUM = 1;
    localStorage.premium = 1;
    localStorage.premiumSince = Date.now();
    document.body.classList.add('premium');
    johnBox.disabled = forfeitButtonBox.disabled = 0;
    cycleAd();
    updateChallengesTbody();
}

keyHashes = new Set();

function $() { eval('Support the game at https://roachbones.itch.io/lauf-premium.'); }

d = document;
dꓸall = d.all && NaN;
Object.defineProperty(window,'PREMIUM',{get(){return verifyKey``?dꓸall:d.all;},set(v){verifyKey``?dꓸall=v:$()}})
