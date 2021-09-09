/*global YUI */
YUI.add("aa_info",
    function (Y) {
        "use strict";

        var aaInfo = (function(options) {
            var GEP = Y.GEP,
                arrayToObject = GEP.util.arrayToObject,
                settings;

            settings = GEP.util.mergeSettings(options, {
                codonSize: 3,
                aaTable: {
                    "TTT": "F", "TCT": "S", "TAT": "Y", "TGT": "C",
                    "TTC": "F", "TCC": "S", "TAC": "Y", "TGC": "C",
                    "TTA": "L", "TCA": "S", "TAA": "*", "TGA": "*",
                    "TTG": "L", "TCG": "S", "TAG": "*", "TGG": "W",
                    "CTT": "L", "CCT": "P", "CAT": "H", "CGT": "R",
                    "CTC": "L", "CCC": "P", "CAC": "H", "CGC": "R",
                    "CTA": "L", "CCA": "P", "CAA": "Q", "CGA": "R",
                    "CTG": "L", "CCG": "P", "CAG": "Q", "CGG": "R",
                    "ATT": "I", "ACT": "T", "AAT": "N", "AGT": "S",
                    "ATC": "I", "ACC": "T", "AAC": "N", "AGC": "S",
                    "ATA": "I", "ACA": "T", "AAA": "K", "AGA": "R",
                    "ATG": "M", "ACG": "T", "AAG": "K", "AGG": "R",
                    "GTT": "V", "GCT": "A", "GAT": "D", "GGT": "G",
                    "GTC": "V", "GCC": "A", "GAC": "D", "GGC": "G",
                    "GTA": "V", "GCA": "A", "GAA": "E", "GGA": "G",
                    "GTG": "V", "GCG": "A", "GAG": "E", "GGG": "G"
                },
                startCodons: arrayToObject(["ATG"]),
                stopCodons: arrayToObject(["TAG", "TAA", "TGA"]),
                unknownAA: "X",
                stopAA: "*",
                startAA: "M"
            });

            function getInPhaseSequence(sequence, prop) {
                if ((prop === undefined) ||
          (prop.acceptorPhase === undefined)) {
                    return sequence;
                }

                var phase = prop.acceptorPhase;

                if (phase < 0 || phase >= settings.codonSize) {
                    throw new TypeError("Invalid acceptor phase");
                }

                return (phase > 0) ? sequence.substr(phase) : sequence;
            }

            function isStartCodon(codon) {
                return (settings.startCodons[codon] !== undefined);
            }

            function isStopCodon(codon) {
                return (settings.stopCodons[codon] !== undefined);
            }

            function hasInFrameStops(peptide) {
                return (peptide.indexOf(settings.stopAA) !== -1);
            }

            function translate(sequence, prop) {
                var codonSize = settings.codonSize,
                    aaTable = settings.aaTable,
                    inPhaseSequence = getInPhaseSequence(sequence, prop),
                    inPhaseLength = inPhaseSequence.length,
                    codon, i, translation = [];

                inPhaseLength -= (inPhaseLength % codonSize);

                for (i=0; i<inPhaseLength; i+=codonSize) {
                    codon = inPhaseSequence.substr(i, codonSize);
                    translation.push(aaTable[codon] || settings.unknownAA);
                }

                return translation.join("");
            }

            return GEP.util.mergeSettings(settings, {
                isStartCodon: isStartCodon,
                isStopCodon: isStopCodon,
                translate: translate,
                hasInFrameStops: hasInFrameStops
            });

        }(Y.GEP.data.aaInfo || {}));


        Y.namespace("GEP").aaInfo = aaInfo;
    },
    "0.0.1", {
        requires: ["gep", "node"]
    });
