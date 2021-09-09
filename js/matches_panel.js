/*global YUI */
YUI.add("matches_panel",
    function (Y) {
        "use strict";

        var matchesPanel = function(containerID, options) {
            var GEP = Y.GEP,
                create = Y.Node.create,
                sub = Y.Lang.sub,
                container = Y.byID(containerID),
                containerAnim,
                exactInfoSection,
                approximateInfoSection,
                extractedRegionSection,
                settings;

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "matches_panel",
                animCfg: {
                    node: container,
                    from: { backgroundColor: "#FFFFB2" },
                    to:   { backgroundColor: "#FFF" },
                    duration: 0.5
                },
                suffix: {
                    exact: "-exact",
                    approximate: "-approximate"
                },
                divTpl: "<div id='{id}'></div>",
                notFoundMessage: "No CDS's found that satisfies the search criteria"
            });

            containerAnim = new Y.Anim(settings.animCfg);

            function hasMatches(item) {
                return (item.data.length > 0);
            }

            function buildContainer() {
                var divTpl = settings.divTpl,
                    suffix = settings.suffix;

                exactInfoSection = create(
                    sub(divTpl, { id: containerID + suffix.exact}));

                approximateInfoSection = create(
                    sub(divTpl, { id: containerID + suffix.approximate}));

                extractedRegionSection = create("<div></div>");

                container.appendChild("<hr>");
                container.appendChild("<h1>Search results</h1>");
                container.appendChild(extractedRegionSection);
                container.appendChild(exactInfoSection);
                container.appendChild(approximateInfoSection);
            }

            function resetContainer() {
                exactInfoSection.hide();
                approximateInfoSection.hide();
            }

            function showExactMatches(summary, featureType) {
                var tableID = containerID + "-exact-data";

                exactInfoSection.setContent(
                    "<h2>List of CDS that matched the search criteria:</h2>" +
          sub(settings.divTpl, { id: tableID }));

                GEP.matchesTable(tableID, {
                    type: featureType,
                    matches: summary.data
                });

                exactInfoSection.show();
            }

            function buildApproximateSection(info) {
                var tablePrefix = containerID + "-approximate-data",
                    subsectionTpl = "<h2>CDS size = {cdsSize}</h2>" + settings.divTpl,
                    content = ["<h1>Matches with the smallest changes in CDS size</h1>"],
                    matchSummary, tableID, tablesData = [], i;

                for (i=0; i<info.length; i+=1) {
                    matchSummary = info[i];

                    if (hasMatches(matchSummary)) {
                        tableID = tablePrefix + i;

                        content.push(sub(subsectionTpl, {
                            cdsSize: matchSummary.cdsSize, id: tableID }));

                        tablesData.push({ id: tableID, data: matchSummary.data });
                    }
                }

                approximateInfoSection.setContent(content.join(""));

                return tablesData;
            }

            function showNoMatches(summary) {
                exactInfoSection.setContent(settings.notFoundMessage +
        Y.Lang.sub(": (CDS search range: 1-{maxSize} aa)", {
            maxSize: summary.exact.cdsSize * 2 - 1
        })
                );

                exactInfoSection.show();
            }

            function showApproximateMatches(summary, featureType) {
                var tablesData, i;

                exactInfoSection.setContent(settings.notFoundMessage);
                tablesData = buildApproximateSection(summary.approximate);

                if (tablesData.length === 0) {
                    showNoMatches(summary);
                    return;
                }

                for (i=0; i<tablesData.length;i+=1) {
                    GEP.matchesTable(tablesData[i].id, {
                        type: featureType,
                        matches: tablesData[i].data
                    });
                }

                exactInfoSection.show();
                approximateInfoSection.show();
            }

            function updateExtractedRegionSection(seqRecord) {
                var extractedOffset = seqRecord.extractedOffset;

                if (extractedOffset === null) {
                    extractedRegionSection.setContent("");
                } else {
                    extractedRegionSection.setContent(
                        "<h2>Search Region: " +
                            "<span class='region-highlight'>" +
                                extractedOffset.scaffold + ":" +
                                extractedOffset.start + "-" + extractedOffset.end +
                            "</span>" +
                        "</h2>"
                    );
                }
            }

            function showResults(summary, info, seqRecord) {
                var featureType = GEP.util.fetchProperty(info, "type");

                resetContainer();

                updateExtractedRegionSection(seqRecord);

                if (hasMatches(summary.exact)) {
                    showExactMatches(summary.exact, featureType);
                } else {
                    showApproximateMatches(summary, featureType);
                }

                container.show();
                containerAnim.run();
            }

            buildContainer();

            container.hide();
            container.removeClass(GEP.data.cssHidden);

            return {
                container: container,
                showResults: showResults
            };
        };

        Y.namespace("GEP").matchesPanel = matchesPanel;
    },
    "0.0.1", {
        requires: ["gep", "anim", "matches_table"]
    });
