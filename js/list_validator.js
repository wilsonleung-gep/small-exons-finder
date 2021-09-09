/*global YUI */
YUI.add("list_validator",
    function (Y) {
        "use strict";

        var listValidator = function(options) {
            var GEP = Y.GEP,
                validValues,
                settings;

            settings = GEP.util.mergeSettings(options, {
                validValues: []
            });

            validValues = settings.validValues;

            settings.errorMessage = settings.errorMessage ||
      "must be one of the following values: " + validValues.join(", ");

            settings.validator = settings.validator || function(v) {
                var numItems = validValues.length,
                    i;

                for (i=0; i<numItems; i+=1) {
                    if (validValues[i] === v) {
                        return true;
                    }
                }

                return false;
            };

            return GEP.fieldValidator(settings);
        };

        Y.namespace("GEP.validator").list = listValidator;
    },
    "0.0.1", {
        requires: ["field_validator"]
    });
