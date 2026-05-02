
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
