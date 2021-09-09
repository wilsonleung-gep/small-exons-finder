/*global YUI */
YUI.add("terminal_exon_finder",
    function (Y) {
        "use strict";

        var terminalExonFinder = function(options) {
            var GEP = Y.GEP,
                aaInfo = GEP.aaInfo,
                acceptorSize, codonSize,
                settings;

            settings = GEP.util.mergeSettings(options, {
                spliceAcceptor: "AG",
                matchPrefixes: ["AG"]
            });

            codonSize = aaInfo.codonSize;
            acceptorSize = settings.spliceAcceptor.length;

            function matchSize(info) {
                var completeCodonsSize = info.cdsSize * codonSize;

                return acceptorSize + info.acceptorPhase + completeCodonsSize;
            }

            function hasCorrectSuffix(sequence) {
                var suffix = sequence.substr(-codonSize);

                return aaInfo.isStopCodon(suffix);
            }

            function hasInternalStops(translation) {
                var firstStopCodonPos = translation.indexOf(aaInfo.stopAA),
                    lastIdx = translation.length - 1;

                return (firstStopCodonPos !== lastIdx);
            }

            function getTranslateInfo(sequence, info) {
                var extractedLength = sequence.length - acceptorSize,
                    extractedSequence = sequence.substr(acceptorSize, extractedLength),
                    translation = aaInfo.translate(extractedSequence, info);

                return {
                    sequence: extractedSequence,
                    translation: translation,
                    hasInFrameStops: hasInternalStops(translation)
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

        Y.namespace("GEP").terminalExonFinder = terminalExonFinder;
    },
    "0.0.1", {
        requires: ["gep", "node", "aa_info"]
    });
