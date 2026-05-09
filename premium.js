CM_URL = 'https://iplayif.com/?story=https%3A%2F%2Fgithub.com%2Fi7%2Fcounterfeit-monkey%2Freleases%2Fdownload%2Fr11.1%2FCounterfeitMonkey-11.gblorb';
ADS = [
    '<a href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/alink01.gif alt="Unicorn Jelly HYPER CUTE FUN unicornjelly.com"></a>',
    '<a href=https://unicornjelly.com title="Unsponsored ad for a comic I like"><img src=ads/unijelly.gif alt="Unicorn Jelly Online Comic MangaStrip Hyper Cute-Cute Super Sweet Fun!"></a>',
    '<a href='+CM_URL+' title="Unsponsored ad for a game I like"><img src=ads/Atlantida-Squid.gif alt="A squid lounges in the embrace of an Atlantean icon."></a>',
    '<a href='+CM_URL+' title="Unsponsored ad for a game I like"><img src=ads/MediumCover.png alt="Counterfeit Monkey, a game of word manipulation"></a>'
]

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

function enablePremium() {
    premium = 1;
    localStorage.premium = 1;
    localStorage.premiumSince = Date.now();
}

keyHashes = new Set();

function $() {
    console.log('%cSupport the game at https://itch.io/Roachbones/lauf-premium','color:purple;font-size:large')
}
function $() {
    eval('Support the game at https://Roachbones/lauf-premium.')
}
