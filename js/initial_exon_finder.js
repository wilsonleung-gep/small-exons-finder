/*global YUI */
YUI.add("initial_exon_finder",
    function (Y) {
        "use strict";

        var initialExonFinder = function(options) {
            var GEP = Y.GEP,
                aaInfo = GEP.aaInfo,
                donorSize,
                settings;

            settings = GEP.util.mergeSettings(options, {
                spliceDonor: "GT",
                matchPrefixes: GEP.util.objectKeys(aaInfo.startCodons)
            });

            donorSize = settings.spliceDonor.length;

            function matchSize(info) {
                var completeCodonsSize = info.cdsSize * aaInfo.codonSize;

                return completeCodonsSize + info.donorPhase + donorSize;
            }

            function hasCorrectSuffix(sequence) {
                var suffix = sequence.substr(-donorSize);

                return (suffix === settings.spliceDonor);
            }

            function getTranslateInfo(sequence, info) {
                var extractedLength = sequence.length - donorSize,
                    extractedSequence = sequence.substr(0, extractedLength),
                    translation = aaInfo.translate(extractedSequence, info);

                return {
                    sequence: extractedSequence,
                    translation: translation,
                    hasInFrameStops: aaInfo.hasInFrameStops(translation)
                };
            }

            function verify(sequence, info) {
                if (! hasCorrectSuffix(sequence)) {
                    return null;
                }

                var translateInfo = getTranslateInfo(sequence, info);
                if (translateInfo.hasInFrameStops) {
                    return null;
                }

                return translateInfo;
            }

            function addMatchDetails(match, matchInfo) {
                match.start = matchInfo.matchIdx;
                match.end = match.start + match.sequence.length;
                match.prefix = matchInfo.prefix;

                return match;
            }

            return {
                matchSize: matchSize,
                verify: verify,
                addMatchDetails: addMatchDetails,
                matchPrefixes: settings.matchPrefixes
            };
        };

        Y.namespace("GEP").initialExonFinder = initialExonFinder;
    },
    "0.0.1", {
        requires: ["gep", "node", "aa_info"]
    });
