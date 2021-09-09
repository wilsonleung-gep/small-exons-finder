/*global YUI */
YUI.add("file_validator",
    function (Y) {
        "use strict";

        var fileValidator = function(options) {
            var GEP = Y.GEP,
                settings;

            settings = GEP.util.mergeSettings(options, {
                errorMessage: "no file selected",
                getFieldValue: function(value) {
                    return (value === undefined) ?
                        Y.byID(settings.id).getDOMNode().files[0] : value;
                },
                validator: function(value) {
                    return (value !== undefined);
                }
            });

            return GEP.fieldValidator(settings);
        };

        Y.namespace("GEP.validator").file = fileValidator;
    },
    "0.0.1", {
        requires: ["field_validator"]
    });
