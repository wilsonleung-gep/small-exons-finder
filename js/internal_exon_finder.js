/*global YUI */
YUI.add("internal_exon_finder",
    function (Y) {
        "use strict";

        var internalExonFinder = function(options) {
            var GEP = Y.GEP,
                aaInfo = GEP.aaInfo,
                donorSize, acceptorSize,
                settings;

            settings = GEP.util.mergeSettings(options, {
                spliceDonor: "GT",
                spliceAcceptor: "AG",
                matchPrefixes: ["AG"]
            });

            donorSize = settings.spliceDonor.length;
            acceptorSize = settings.spliceAcceptor.length;

            function matchSize(info) {
                var completeCodonsSize = info.cdsSize * aaInfo.codonSize;

                return acceptorSize + info.acceptorPhase + completeCodonsSize +
          info.donorPhase + donorSize;
            }

            function hasCorrectSuffix(sequence) {
                var suffix = sequence.substr(-donorSize);

                return (suffix === settings.spliceDonor);
            }

            function getTranslateInfo(sequence, info) {
                var extractedLength = sequence.length - donorSize - acceptorSize,
                    extractedSequence = sequence.substr(acceptorSize, extractedLength),
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
                match.start = matchInfo.matchIdx + acceptorSize;
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

        Y.namespace("GEP").internalExonFinder = internalExonFinder;
    },
    "0.0.1", {
        requires: ["gep", "node", "aa_info"]
    });
