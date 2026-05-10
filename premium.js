CM_URL = 'https://iplayif.com/?story=https%3A%2F%2Fgithub.com%2Fi7%2Fcounterfeit-monkey%2Freleases%2Fdownload%2Fr11.1%2FCounterfeitMonkey-11.gblorb';
CUSTOM_ADS = [
    '<a target=_blank href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/alink01.gif alt="Unicorn Jelly HYPER CUTE FUN unicornjelly.com"></a>',
    '<a target=_blank href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/unijelly.gif alt="Unicorn Jelly Online Comic MangaStrip Hyper Cute-Cute Super Sweet Fun!"></a>',
    '<a target=_blank href='+CM_URL+' title="Unsponsored ad for Counterfeit Monkey, a game I like"><img src=ads/Atlantida-Squid.png alt="A squid lounges in the embrace of an Atlantean icon."></a>',
    '<a target=_blank href='+CM_URL+' title="Unsponsored ad for a game I like"><img src=ads/MediumCover.png alt="Counterfeit Monkey, a game of word manipulation"></a>',
    "<a target=_blank href=https://en.wikipedia.org/wiki/Tomato style=color:tomato><strong>Tomatoes</strong> 🍅 they're food</a>"
]

function cycleAd() {
    if (Math.random() < 0.33) {
        vert.classList = ['john'];
        johnvertisement.src = johnvertisement.dataset.src;
    } else if (Math.random() < 0.5) {
        vert.classList = ['ari'];
        arivertisement.src = arivertisement.dataset.src;
    } else {
        vert.classList = ['rose'];
        rosevertisement.innerHTML = choice(CUSTOM_ADS);
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

function $() { eval('Support the game at https://Roachbones/lauf-premium.'); }

d = document;
dꓸall = d.all && NaN;
Object.defineProperty(window,'PREMIUM',{get(){return verifyKey``?dꓸall:d.all;},set(v){verifyKey``?dꓸall=v:$()}})
