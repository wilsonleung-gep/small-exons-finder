/*global YUI */
YUI.add("exon_search_engine",
    function (Y) {
        "use strict";

        var exonSearchEngine = function(seqRecord, options) {
            var GEP = Y.GEP,
                seqView,
                searchInfo,
                originalCDSsize,
                settings,
                searchOffset = 0;

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "search_engine",
                spliceSiteSize: 2,
                searchInfo: {}
            });

            function extractSearchSettings(info) {
                var keys = ["acceptorPhase", "acceptorPhases", "cdsSize", "start", "end",
                        "donorPhase", "donorPhases", "donorSite", "strand", "type"],
                    numKeys = keys.length,
                    padding = settings.spliceSiteSize,
                    cloneInfo = {}, i, offsetStart;

                for (i=0; i<numKeys; i+=1) {
                    cloneInfo[keys[i]] = info[keys[i]];
                }

                if (seqRecord.extractedOffset !== null) {
                    offsetStart = seqRecord.extractedOffset.start;

                    searchOffset = offsetStart - 1;
                    info.start -= offsetStart;
                    info.end -= offsetStart;
                }

                cloneInfo.spliceDonor = info.donorSite;

                cloneInfo.start = Math.max(0, info.start - padding);
                cloneInfo.end = Math.min(seqRecord.getLength(), info.end + padding);

                return cloneInfo;
            }

            searchInfo = extractSearchSettings(settings.searchInfo);
            originalCDSsize = GEP.util.fetchProperty(searchInfo, "cdsSize");
            seqView = GEP.sequenceView(seqRecord, searchInfo);

            function sortByStart(a, b) {
                if (a.start === b.start) {
                    return (a.end === b.end) ? 0 : (a.end < b.end) ? -1 : 1;
                }

                return (a.start < b.start) ? -1 : 1;
            }

            function hasMatches(item) {
                return (item.data.length > 0);
            }

            function findSmallExonMatches(info, results) {
                var exonFinder = GEP.exonFinder(info),
                    matches = exonFinder.findMatches(seqView.viewSeq),
                    match, i, span;

                for (i=0; i<matches.length; i+=1) {
                    span = seqView.getSpan(matches[i]);

                    match = Y.merge(matches[i], {
                        spanStart: span.start + searchOffset,
                        spanEnd: span.end + searchOffset,
                        donorPhase: info.donorPhase,
                        acceptorPhase: info.acceptorPhase
                    });

                    results.push(match);
                }
            }

            function searchSelectedPhases(cdsSize) {
                var donorPhases = searchInfo.donorPhases || [null],
                    acceptorPhases = searchInfo.acceptorPhases || [null],
                    i, j, results = [];

                searchInfo.cdsSize = cdsSize;

                for (i=0; i<donorPhases.length; i+=1) {
                    searchInfo.donorPhase = donorPhases[i];

                    for (j=0; j<acceptorPhases.length; j+=1) {
                        searchInfo.acceptorPhase = acceptorPhases[j];
                        findSmallExonMatches(searchInfo, results);
                    }
                }

                return {
                    cdsSize: cdsSize,
                    data: results.sort(sortByStart)
                };
            }

            function runIterativeSearch() {
                var i, results = [];

                for (i=1; i<originalCDSsize; i+=1) {
                    results = [
                        searchSelectedPhases(originalCDSsize - i),
                        searchSelectedPhases(originalCDSsize + i)
                    ];

                    if (hasMatches(results[0]) || hasMatches(results[1])) {
                        break;
                    }
                }

                return results;
            }

            function search() {
                var results = {};

                try {
                    results = {
                        exact: searchSelectedPhases(originalCDSsize),
                        approximate: []
                    };

                    if (! hasMatches(results.exact)) {
                        results.approximate = runIterativeSearch();
                    }
                } finally {
                    searchInfo.cdsSize = originalCDSsize;
                }

                return results;
            }

            return {
                search: search,
                seqView: seqView
            };
        };

        Y.namespace("GEP").exonSearchEngine = exonSearchEngine;
    },
    "0.0.1", {
        requires: ["gep", "sequence_view", "exon_finder"]
    });
