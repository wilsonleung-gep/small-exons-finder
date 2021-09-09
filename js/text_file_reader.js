/*global YUI */
YUI.add("text_file_reader",
    function (Y) {
        "use strict";

        var textFileReader = function(fieldID, options) {
            var GEP = Y.GEP,
                settings;

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "text_reader"
            });

            function reportContent(e) {
                Y.fire(settings.eventPrefix + ":completed", e);
            }

            function reportReadError(e) {
                Y.fire(settings.eventPrefix + ":error", e);
            }

            function loadFileAsync(fastaFile) {
                var reader = new window.FileReader();

                reader.onload = reportContent;
                reader.onerror = reportReadError;

                reader.readAsText(fastaFile);
            }

            function getFieldValue() {
                return Y.byID(fieldID).getDOMNode().files[0];
            }

            return {
                loadFileAsync: loadFileAsync,
                getFieldValue: getFieldValue
            };
        };

        Y.namespace("GEP").textFileReader = textFileReader;
    },
    "0.0.1", {
        requires: ["gep", "event"]
    });
