/*global YUI */
YUI.add("field_validator",
    function (Y) {
        "use strict";

        var fieldValidator = function(options) {
            var GEP = Y.GEP,
                id,
                settings;

            settings = GEP.util.mergeSettings(options, {
                id: "field",
                errorMessage: "contains invalid values",
                validator: function() {
                    return true;
                }
            });

            id = settings.id;

            settings.getFieldValue = settings.getFieldValue || function(value) {
                return (value === undefined) ?
                    Y.byID(id).get("value").trim() : value;
            };

            function getLabel() {
                return settings.label || id;
            }

            function invalidField() {
                return {
                    isValid: false,
                    message: getLabel() + ": " + settings.errorMessage
                };
            }

            function isRequired() {
                var requiredFunc = settings.required;

                if (requiredFunc === undefined) {
                    return true;
                }

                if (Y.Lang.isFunction(requiredFunc)) {
                    return requiredFunc();
                }

                return requiredFunc;
            }

            function validate(value) {
                if (! isRequired()) {
                    return null;
                }

                value = settings.getFieldValue(value);

                var isValid = settings.validator(value);

                if (isValid) {
                    return {
                        isValid: true,
                        value: settings.transform ? settings.transform(value) : value
                    };
                }

                return invalidField();
            }


            return {
                id: id,
                validate: validate
            };
        };

        Y.namespace("GEP").fieldValidator = fieldValidator;
    },
    "0.0.1", {
        requires: ["gep", "node"]
    });
