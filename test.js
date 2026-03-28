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
}

function a(condition, label) {
    if (!condition) console.error(label);
    return condition;
}

runTests();
