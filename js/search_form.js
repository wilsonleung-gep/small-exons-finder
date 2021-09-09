/*global YUI */
YUI.add("search_form",
    function (Y) {
        "use strict";

        var searchForm = function(formID, options) {
            var GEP = Y.GEP,
                form = Y.byID(formID),
                validator = GEP.validator,
                fields,
                settings;

            function createPhaseList(value) {
                if (value === "any") {
                    return [0, 1, 2];
                }
                return [parseInt(value,0)];
            }

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "search_form",
                css: {
                    hidden: "hidden"
                },
                fileFields: [],
                fields: [
                    validator.list({
                        id: "type",
                        label: "Coding Exon Type",
                        validValues: ["initial", "internal", "terminal"]
                    }),
                    validator.positiveInt({ id: "start", label: "Start Position" }),
                    validator.positiveInt({ id: "end", label: "End Position" }),
                    validator.list({
                        id: "strand",
                        label: "Strand",
                        validValues: ["plus", "minus"],
                        transform: function (v) { return (v === "plus") ? "+" : "-"; }
                    }),
                    validator.positiveInt({ id: "cdsSize", label: "CDS Size" }),
                    validator.list({
                        id: "donorSite",
                        label: "Donor Site",
                        validValues: ["GT", "GC"],
                        required: function() {
                            return (Y.byID("type").get("value") !== "terminal");
                        }
                    }),
                    validator.list({
                        id: "acceptorPhases",
                        label: "Acceptor Phase",
                        validValues: ["any", "0", "1", "2"],
                        required: function() {
                            return (Y.byID("type").get("value") !== "initial");
                        },
                        transform: createPhaseList
                    }),
                    validator.list({
                        id: "donorPhases",
                        label: "Donor Phase",
                        validValues: ["any", "0", "1", "2"],
                        required: function() {
                            return (Y.byID("type").get("value") !== "terminal");
                        },
                        transform: createPhaseList
                    })
                ]
            });

            function createFormFields() {
                var fileFields = settings.fileFields,
                    numFileFields = fileFields.length,
                    validationFields = [], i;

                for (i=0; i<numFileFields; i+=1) {
                    validationFields.push(validator.file(fileFields[i]));
                }

                return validationFields.concat(settings.fields);
            }

            fields = createFormFields();

            function verifyFormFields() {
                var numFields = fields.length,
                    summary = { clean: {}, errors: [] },
                    field, fieldStatus, i;

                for (i=0; i<numFields; i+=1) {
                    field = fields[i];
                    fieldStatus = field.validate();

                    if (fieldStatus !== null) {
                        if (fieldStatus.isValid) {
                            summary.clean[field.id] = fieldStatus.value;
                        } else {
                            summary.errors.push(fieldStatus.message);
                        }
                    }
                }

                return summary;
            }

            function normalizeCoordinates(clean) {
                var start = Math.min(clean.start, clean.end),
                    end = Math.max(clean.start, clean.end);

                clean.start = start - 1;
                clean.end = end;

                return clean;
            }

            Y.on(settings.eventPrefix + ":formSubmit", function() {
                var summary = verifyFormFields(),
                    clean = summary.clean,
                    errors = summary.errors,
                    errorMsg;

                if (errors.length > 0) {
                    errorMsg = "Please correct the following form fields:\n" + errors.join("\n");

                    Y.fire("message_panel:error", {
                        message: GEP.util.nlTobr(errorMsg)
                    });
                } else {
                    Y.fire(settings.eventPrefix + ":values", normalizeCoordinates(clean));
                }
            });

            form.on("submit", function(e) {
                e.halt();

                Y.fire(settings.eventPrefix + ":formSubmit", e);

                return false;
            });

            function conditionalFieldsVisibility(value) {
                var hidden = settings.css.hidden,
                    donorSiteField = Y.byID("donorSite-options"),
                    donorPhasesField = Y.byID("donorPhases-options"),
                    acceptorPhasesField = Y.byID("acceptorPhases-options");

                if (value === "initial") {
                    donorSiteField.removeClass(hidden);
                    donorPhasesField.removeClass(hidden);
                    acceptorPhasesField.addClass(hidden);
                }

                if (value === "internal") {
                    donorSiteField.removeClass(hidden);
                    donorPhasesField.removeClass(hidden);
                    acceptorPhasesField.removeClass(hidden);
                }

                if (value === "terminal") {
                    donorSiteField.addClass(hidden);
                    donorPhasesField.addClass(hidden);
                    acceptorPhasesField.removeClass(hidden);
                }
            }

            function initializeConditionalFields() {
                var typeField = Y.byID("type");

                typeField.on("change", function(e) {
                    conditionalFieldsVisibility(e.target.get("value"));
                });

                conditionalFieldsVisibility(typeField.get("value"));

                form.after("reset", function() {
                    typeField.set("selectedIndex", 0);
                    conditionalFieldsVisibility(typeField.get("value"));
                });
            }

            initializeConditionalFields();

            return form;
        };

        Y.namespace("GEP").searchForm = searchForm;
    },
    "0.0.1", {
        requires: ["gep", "node",
            "file_validator", "list_validator", "positive_int_validator"]
    });
