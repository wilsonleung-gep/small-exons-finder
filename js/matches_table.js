/*global YUI */
YUI.add("matches_table",
    function (Y) {
        "use strict";

        var matchesTable = function(containerID, options) {
            var GEP = Y.GEP,
                container = Y.byID(containerID),
                featureType,
                settings;

            settings = GEP.util.mergeSettings(options, {
                tplSource: "matchesTable-template",
                rowTplSource: "matchesTable-row-template",
                matches: [],
                basesPerLine: 30,
                lineSeparator: "<br>",
                notAvailable: "NA",
                type: "internal"
            });

            featureType = settings.type;

            function formatSequence(sequence) {
                var seqLength = sequence.length,
                    basesPerLine = settings.basesPerLine,
                    lines = [],
                    i;

                if (seqLength < basesPerLine) {
                    return sequence;
                }

                for (i=0; i<seqLength; i+=basesPerLine) {
                    lines.push(sequence.substr(i, basesPerLine));
                }

                return lines.join(settings.lineSeparator);
            }

            function formatAcceptor(phase) {
                if (featureType === "initial") {
                    return settings.notAvailable;
                }

                return phase;
            }

            function formatDonor(phase) {
                if (featureType === "terminal") {
                    return settings.notAvailable;
                }

                return phase;
            }


            function buildResultsTable(matches) {
                var sub = Y.Lang.sub,
                    create = Y.Node.create,
                    table = create(Y.byID(settings.tplSource).getHTML()),
                    rowTpl = Y.byID(settings.rowTplSource).getHTML(),
                    tbody = table.one("tbody"),
                    numItems = matches.length,
                    result,
                    i;

                for (i=0; i<numItems; i+=1) {
                    result = matches[i];

                    tbody.append(create(sub(rowTpl, {
                        spanStart: result.spanStart + 1,
                        spanEnd: result.spanEnd,
                        translation: formatSequence(result.translation),
                        acceptorPhase: formatAcceptor(result.acceptorPhase),
                        donorPhase: formatDonor(result.donorPhase),
                        sequence: formatSequence(result.sequence)
                    })));
                }

                table.appendChild(tbody);

                container.setContent(table);
            }

            buildResultsTable(settings.matches);

            return container;
        };

        Y.namespace("GEP").matchesTable = matchesTable;
    },
    "0.0.1", {
        requires: ["gep"]
    });
