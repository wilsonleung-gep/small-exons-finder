/*global YUI */
YUI.add("exon_finder",
    function (Y) {
        "use strict";

        var exonFinder = function(options) {
            var GEP = Y.GEP,
                finder,
                settings;

            settings = GEP.util.mergeSettings(options, {
                spliceDonor: "GT",
                spliceAcceptor: "AG",
                donorPhase: 0,
                acceptorPhase: 0
            });

            function createFinder(info) {
                var type = GEP[info.type + "ExonFinder"];

                if (type === undefined) {
                    throw new TypeError("Invalid Exon Finder type: " + info.type);
                }

                return type(info);
            }

            finder = createFinder(settings);

            function processPrefixMatches(sequence, prefix, matches) {
                var matchSize = finder.matchSize(settings),
                    seqLength = sequence.length,
                    matchIdx = sequence.indexOf(prefix),
                    match, extractedSequence;

                while (matchIdx !== -1) {
                    if (matchIdx + matchSize <= seqLength) {
                        extractedSequence = sequence.substr(matchIdx, matchSize);

                        match = finder.verify(extractedSequence, settings);

                        if (match !== null) {
                            match = finder.addMatchDetails(match, {
                                matchIdx: matchIdx,
                                prefix: prefix
                            });

                            matches.push(match);
                        }
                    }

                    matchIdx = sequence.indexOf(prefix, matchIdx + 1);
                }
            }

            function findMatches(sequence) {
                var matchPrefixes = finder.matchPrefixes,
                    numPrefixes = matchPrefixes.length,
                    matches = [],
                    i;

                for (i=0; i<numPrefixes; i+=1) {
                    processPrefixMatches(sequence, matchPrefixes[i], matches);
                }

                return matches;
            }

            finder.findMatches = findMatches;

            return finder;
        };

        Y.namespace("GEP").exonFinder = exonFinder;
    },
    "0.0.1", {
        requires: ["gep", "node", "initial_exon_finder",
            "internal_exon_finder", "terminal_exon_finder"]
    });
