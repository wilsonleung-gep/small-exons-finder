/*global YUI */
YUI.add("sequence_record",
    function (Y) {
        "use strict";

        var sequenceRecord = function(options) {
            var GEP = Y.GEP,
                settings,
                id = options.id || "unknown",
                description = options.description || "",
                sequence = options.sequence || "",
                extractedOffset = null;

            settings = GEP.util.mergeSettings(options, {
                recordSeparator: ">",
                complement: { "A": "T",  "C": "G", "G": "C", "T": "A" }
            });

            function extractOffset(description) {
                var match = description.match(/range=(\S+):(\d+)-(\d+)/);

                if (match === null) {
                    return null;
                }

                return {
                    "scaffold": match[1],
                    "start": parseInt(match[2], 10),
                    "end": parseInt(match[3], 10)
                };
            }

            function loadHeader(line) {
                var spacePos = line.indexOf(" ");

                if (spacePos === -1) {
                    id = line.substr(1);
                } else {
                    id = line.substr(1, spacePos - 1);
                    description = line.substr(spacePos + 1).trim();
                    extractedOffset = extractOffset(description);
                }
            }

            function loadContent(content) {
                var lines = content.trim().split(/[\r\n]+/),
                    separator = settings.recordSeparator;

                if (lines[0].indexOf(separator) === 0) {
                    loadHeader(lines.shift());
                }

                sequence = lines.join("").toUpperCase().replace(/\s+/g, "");

                if (sequence.indexOf(separator) !== -1) {
                    throw new TypeError("Sequence contains multiple fasta records");
                }
            }

            if (options.content) {
                loadContent(options.content);
            }

            function getLength() {
                return sequence.length;
            }

            function reverseComplement() {
                var bases = sequence.split(""),
                    lastIdx = sequence.length - 1,
                    complement = settings.complement,
                    i,
                    results = [];

                for (i=lastIdx; i>=0; i-=1) {
                    results.push(complement[bases[i]] || bases[i]);
                }

                return results.join("");
            }

            function extractRegion(regionInfo) {
                var start = regionInfo.start || 0,
                    end = regionInfo.end || sequence.length;

                return sequence.substr(start, end - start);
            }

            return {
                id: id,
                description: description,
                sequence: sequence,
                extractedOffset: extractedOffset,

                getLength: getLength,
                reverseComplement: reverseComplement,
                extractRegion: extractRegion
            };
        };


        Y.namespace("GEP").sequenceRecord = sequenceRecord;
    },
    "0.0.1", {
        requires: ["gep", "node"]
    });
