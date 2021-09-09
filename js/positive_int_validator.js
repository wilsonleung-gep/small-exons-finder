/*global YUI */
YUI.add("positive_int_validator",
    function (Y) {
        "use strict";

        var postiveIntValidator = function(options) {
            var GEP = Y.GEP,
                settings,
                tryParseInt = GEP.util.tryParseInt;

            settings = GEP.util.mergeSettings(options, {
                errorMessage: "must be a positive integer",
                transform: tryParseInt
            });

            settings.validator = settings.validator || function(v) {
                var value = tryParseInt(v);

                return ((value !== null) && (value > 0));
            };

            return GEP.fieldValidator(settings);
        };

        Y.namespace("GEP.validator").positiveInt = postiveIntValidator;
    },
    "0.0.1", {
        requires: ["field_validator"]
    });
