/*global YUI */
YUI.add("sequence_view",
    function (Y) {
        "use strict";

        var sequenceView = function(seqRecord, options) {
            var GEP = Y.GEP,
                settings,
                isReversed = false,
                offset,
                viewSeq;

            settings = GEP.util.mergeSettings(options, {
                strand: "+",
                start: 0
            });

            isReversed = (settings.strand === "-");
            offset = settings.start;

            function createView() {
                viewSeq = seqRecord.extractRegion(settings);

                if (isReversed) {
                    viewSeq = GEP.sequenceRecord({ sequence: viewSeq }).reverseComplement();
                }
            }

            function viewToSequenceCoord(position) {
                if (isReversed) {
                    return offset + (viewSeq.length - position);
                }

                return offset + position;
            }

            function getSpan(coords) {
                var span = {
                    start: viewToSequenceCoord(coords.start),
                    end: viewToSequenceCoord(coords.end)
                };

                if (isReversed) {
                    return { start: span.end, end: span.start };
                }

                return span;
            }

            createView();

            return {
                getSpan: getSpan,
                viewSeq: viewSeq
            };
        };

        Y.namespace("GEP").sequenceView = sequenceView;
    },
    "0.0.1", {
        requires: ["gep", "sequence_record"]
    });
