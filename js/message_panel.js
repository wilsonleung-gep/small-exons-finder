/*global YUI */
YUI.add("message_panel",
    function (Y) {
        "use strict";

        var messagePanel = function(containerID, options) {
            var GEP = Y.GEP,
                container = Y.byID(containerID),
                contentNode, iconNode, messageNode,
                settings, css;

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "message_panel",
                contentSuffix: "-content",
                iconSuffix: "-icon",
                messageSuffix: "-message",
                css: {
                    prefix: "message",
                    hidden: "hidden",
                    error: "error",
                    info: "info",
                    warning: "warning",
                    success: "success",
                    wait: "wait",

                    icons: {
                        prefix: "fa fa-2x",
                        error: "fa-times-circle",
                        info: "fa-info-circle",
                        warning: "fa-exclamation-triangle",
                        success: "fa-check",
                        wait: "fa-spinner fa-spin"
                    }
                }
            });

            css = settings.css;
            contentNode = Y.byID(containerID + settings.contentSuffix);
            iconNode = Y.byID(containerID + settings.iconSuffix);
            messageNode = Y.byID(containerID + settings.messageSuffix);


            function updatePanelContent(info) {
                var type = info.type || "info",
                    message = info.message;

                contentNode.set("className", css.prefix + " " + css[type]);
                iconNode.set("className", css.icons.prefix + " " + css.icons[type]);
                messageNode.setContent(message);
            }

            Y.on(settings.eventPrefix + ":show", function(e) {
                updatePanelContent(e);
                container.show();
            });

            Y.on(settings.eventPrefix + ":wait", function(e) {
                updatePanelContent({
                    type: "wait",
                    message: (e.message || "Processing") + " ..."
                });

                container.show();
            });

            Y.on(settings.eventPrefix + ":error", function(e) {
                var errorMessage = (e && e.message) || ("Unknown error: " + e);

                updatePanelContent({ type: "error", message: errorMessage });
                container.show();
            });


            Y.on(settings.eventPrefix + ":hide", function() {
                container.hide();
            });


            container.hide();
            container.removeClass(css.hidden);

            return container;
        };

        Y.namespace("GEP").messagePanel = messagePanel;
    },
    "0.0.1", {
        requires: ["gep", "node"]
    });
