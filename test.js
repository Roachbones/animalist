function testLow(s) {
    return s.toLowerCase().replaceAll("-"," ").replaceAll('’',"'").replaceAll(/ +/g, ' ');
}

function nameQid(qid) {
    return qid+" "+ID_TO_TITLE[qid];
}

function runTests() {
    for (let commonId of COMMONS) {
        if (!a(ID_TO_TITLE[commonId], 'untitled common '+commonId)) continue;
        let hopefullyCommonId = LOWER_TITLE_TO_ID[testLow(ID_TO_TITLE[commonId])];
        a(
            hopefullyCommonId==commonId,
            "Common "+nameQid(commonId)+" not evoked by name; overshadowed by " + nameQid(hopefullyCommonId)
        );
    }
    /*for (let i in ID_TO_TITLE) {
        let hopefullyId = LOWER_TITLE_TO_ID[testLow(ID_TO_TITLE[i])];
        a(
            hopefullyId==i,
            "Uncommon "+nameQid(i)+" not evoked by name; overshadowed by " + nameQid(hopefullyId)
        );
    }*/
//    testDailyGen();
}

function a(condition, label) {
    if (!condition) console.error(label);
    return condition;
}

function endsWithOneOf(s, suffixes) {
    for (const suffix of suffixes) {
        if (s.endsWith(suffix)) return true;
    }
    return false;
}

function testChallenge(challenge, suffixes) {
    suffixes ??= ' ' + challenge.noun;
    if (typeof suffixes == 'string') suffixes = [suffixes];
    for (const qid in ID_TO_TITLE) {
        const title = ID_TO_TITLE[qid];
        const guess = title.trim().toLowerCase().replaceAll("-"," ").replaceAll('’',"'").replaceAll(/ +/g, ' ');
        if (!endsWithOneOf(guess, suffixes)) {
            continue;
        }
        const r = challenge.rejection(qid, guess);
        a(!r, r + ' - ' + nameQid(qid));
    }
}

function testGuess(guess) {
    guessbox.value = guess;
    tryAttempt();
}

function heavy(m) {
    t0 = new Date();
    m ||= 800;
    let n = 0;
    for (const i in ID_TO_TITLE) {
        let title = ID_TO_TITLE[i];
        testGuess(title);
        n++;
        console.log(n);
        if (n>m) break;
    }
    t = new Date() - t0;
    console.log(m +' in '+t+'ms');
    console.log(Math.round(m/t) + ' guesses per ms');
}

function testDailyGen() {
    let i=0;
    while (i<9999){updateDaily(i++);startDaily();}
}

runTests();


