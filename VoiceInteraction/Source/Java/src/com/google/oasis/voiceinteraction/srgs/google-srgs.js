//https://www.google.com/speech-api/v2/recognize?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&output=json&lang=en-us
//
//{"result":[]}
//{"result":[{"alternative":[{"transcript":"hello Google","confidence":0.98762906},{"transcript":"hello Google I"}],"final":true],"result_index":0}
//
// 

function applySrgsToGoogleResults(grammar, result) {
    var smlResults = [];
    for (var i = 0; i < result.result.length; i++) {
        if (result.result[i].final) {
            for (var j = 0; j < result.result[i].alternative.length; j++) {
                var alt = result.result[i].alternative[j];
                var transcript = alt.transcript;
                var chart = parseString(transcript, grammar, grammar.$root);
                var out = {};
                if (chart.out) {
                    out = chart.out;
                    //out["@confidence"] = alt.confidence;
                }
                out["@utteranceConfidence"] = alt.confidence ? alt.confidence : 1.0;
                out["@text"] = transcript;
                var sml = {
                    SML: out
                }
                var smlResult = JSON.stringify(sml);
                if (chart.out) {
                    return smlResult; // return the matching result
                }
                smlResults.push(smlResult);
            }
        }
    }
    if (smlResults.length > 0) {
        return smlResults[0]; // just return the first non-matching result
    }
    return "{\"SML\":{}}";
}
