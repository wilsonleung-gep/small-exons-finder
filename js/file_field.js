/*global YUI */
YUI.add("file_field",
    function (Y) {
        "use strict";

        var fileField = function(fieldID, options) {
            var GEP = Y.GEP,
                hasFileReader = (window.File && window.FileReader),
                fileField,
                readerCfg,
                settings;

            settings = GEP.util.mergeSettings(options, {
                id: "sequenceFile",
                label: "Sequence File",
                eventPrefix: fieldID,
                rtfMagicNumber: "{",
                suffix: "-wrapper",
                readerCfg: {}
            });

            readerCfg = settings.readerCfg;

            function reportReadError(e) {
                var errorMessage = "Unknown error";

                if ((e.target) && (e.target.error)) {
                    errorMessage = e.target.error.message || errorMessage;
                } else if (e.message) {
                    errorMessage = e.message;
                }

                Y.fire(settings.eventPrefix + ":error", {
                    message: errorMessage
                });
            }

            function isRichText(content) {
                return (content.indexOf(settings.rtfMagicNumber) === 0);
            }

            function reportContent(e) {
                if (! e.target || ! e.target.result) {
                    reportReadError(e);
                    return;
                }

                var content = e.target.result;

                if (isRichText(content)) {
                    reportReadError({
                        message: "Sequence file is in Rich Text instead of Plain Text format" });

                    return;
                }

                Y.fire(settings.eventPrefix + ":completed", { content: content });
            }

            if (hasFileReader) {
                fileField = GEP.textFileReader(fieldID, readerCfg);
            } else {
                fileField = GEP.flashTextFileReader(fieldID, readerCfg);
            }

            Y.on("text_reader:completed", reportContent);
            Y.on("text_reader:error", reportReadError);

            fileField.id = fileField.id || settings.id;
            fileField.label = fileField.label || settings.label;

            return fileField;
        };

        Y.namespace("GEP").fileField = fileField;
    },
    "0.0.1", {
        requires: ["gep", "text_file_reader", "flash_text_file_reader"]
    });
