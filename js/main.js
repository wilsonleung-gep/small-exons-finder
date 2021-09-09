/*global YUI */
YUI().use(
    "file_field",
    "message_panel",
    "search_form",
    "exon_search_engine",
    "matches_panel",

    function (Y) {
        "use strict";

        var GEP = Y.GEP,
            searchInfo = {},
            matchesPanel;

        function showMatchesTable(results, seqRecord) {
            matchesPanel = matchesPanel || GEP.matchesPanel("matchesPanel");

            matchesPanel.showResults(results, searchInfo, seqRecord);
        }

        function runSmallExonFinder(seqRecord) {
            var searchEngine = GEP.exonSearchEngine(seqRecord, { searchInfo: searchInfo }),
                results = null;

            try {
                results = searchEngine.search();

                Y.fire("message_panel:hide");
                showMatchesTable(results, seqRecord);

            } catch (error) {
                Y.fire("message_panel:error", error);
            }
        }

        function initializeListeners() {
            Y.on("sequence_file:completed", function(event) {
                Y.fire("message_panel:wait", { message: "Searching for small exons"});

                runSmallExonFinder(GEP.sequenceRecord({ content: event.content }));
            });

            Y.on("sequence_file:error", function(e) {
                var errorMessage = ((e && e.message ) || "Unknown error");

                Y.fire("message_panel:error", {
                    message: "Cannot read sequence file: " + errorMessage
                });
            });
        }

        function initializeForm() {
            var fileField = GEP.fileField("sequenceFile", {
                eventPrefix: "sequence_file"
            });

            GEP.searchForm("searchForm", { fileFields: [fileField] });

            Y.on("search_form:values", function(values) {
                searchInfo = values;

                Y.fire("message_panel:wait", { message: "Reading sequence file" });
                fileField.loadFileAsync(searchInfo.sequenceFile);
            });
        }

        function initializePanel() {
            GEP.messagePanel("messagePanel");
        }

        function main() {
            initializePanel();
            initializeForm();
            initializeListeners();
        }

        main();
    });
