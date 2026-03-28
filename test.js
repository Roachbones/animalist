function testLow(s) {
    return s.toLowerCase().replaceAll("-"," ").replaceAll('’',"'").replaceAll(/ +/g, ' ');
}

function nameQid(qid) {
    return qid+" "+ID_TO_TITLE[qid];
}

function runTests() {
    for (commonId of COMMONS) {
        if (!a(ID_TO_TITLE[commonId], 'untitled common '+commonId)) continue;
        hopefullyCommonId = LOWER_TITLE_TO_ID[testLow(ID_TO_TITLE[commonId])];
        a(
            hopefullyCommonId==commonId,
            "Common "+nameQid(commonId)+" not evoked by name; overshadowed by " + nameQid(hopefullyCommonId)
        );
    }
}

function a(condition, label) {
    if (!condition) console.error(label);
    return condition;
}

runTests();
