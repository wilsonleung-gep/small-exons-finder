/*global YUI */
/**
 * Bridge to handle communication with Flash Player ExternalInterface.
 * The current implementation uses the infrastructure provided by
 * the YUI Uploader but the events published by the uploader are restricted
 * to file upload.
 *
 * This bridge allow custom messages to pass from the Flash Player to
 * YUI sandbox that subscribed to the custom event.
 */
window.GEPBridge = function(e) {
    "use strict";

    var custom_event = "gepbridge:" + e.event_name;

    YUI().use("event-custom", function (YBridge) {
        YBridge.publish(custom_event, { broadcast: 2, fireOnce: true });
        YBridge.fire(custom_event, e.results);
    });
};

YUI.add("flash_text_file_reader",

    function (Y) {
        "use strict";

        var flashTextFileReader = function(fieldID, options) {
            var GEP = Y.GEP,
                settings,
                container,
                uploader,
                detailsSpan;

            settings = GEP.util.mergeSettings(options, {
                eventPrefix: "text_reader",
                tpl: '<div id="{id}" class="{buttonStyle}"></div>' +
          '<span id="{detailsID}" class="{messageStyle}"></span>',
                suffix: {
                    wrapper: "-wrapper",
                    container: "-container",
                    details: "-details"
                },
                css: {
                    buttonStyle: "flashButton",
                    messageStyle: "flashButtonMessage"
                },
                uploaderCfg: {
                    width: "80px",
                    height: "30px",
                    multipleFiles: false,
                    uploadURL: "_localread_",
                    swfURL: "js/as/FlashFileReader.swf?t=" + Math.random(),
                    selectButtonLabel: "Browse...",
                    withCredentials: false
                }
            });

            Y.Uploader = Y.UploaderFlash;
            if (Y.Uploader.TYPE === "none") {
                throw new Error("Please install Adobe Flash before using this program");
            }

            function initializeFileReader() {
                var suffix = settings.suffix,
                    detailsID = fieldID + suffix.details,
                    flashContainerID = fieldID + suffix.container,
                    fileNode;

                Y.byID(fieldID).remove(true);
                container = Y.byID(fieldID + suffix.wrapper);

                fileNode = Y.Node.create(Y.Lang.sub(settings.tpl, {
                    id: flashContainerID,
                    detailsID: detailsID,
                    messageStyle: settings.css.messageStyle,
                    buttonStyle: settings.css.buttonStyle
                }));

                container.append(fileNode);

                detailsSpan = Y.byID(detailsID);
                detailsSpan.setContent("No file selected.");

                uploader = new Y.Uploader(settings.uploaderCfg);
                uploader.render("#" + flashContainerID);
            }

            function initializeFileSelectListener() {
                uploader.after("fileselect", function(e) {
                    var fileList = e.fileList,
                        numFiles = fileList.length;

                    if (numFiles === 0) {
                        return;
                    }

                    if (uploader.get("fileList").length > 1) {
                        uploader.set("fileList", [fileList[0]]);
                    }

                    detailsSpan.setContent(fileList[0].get("name"));

                    uploader.set("postVarsPerFile",
                        Y.merge(uploader.get("postVarsPerFile"), { parser: "textfile" } ));
                });
            }

            function readCompleted(e) {
                if ((! e.data) || (e.data.content === undefined)) {
                    Y.fire(settings.eventPrefix + ":error", new Error("Unreadable file"));

                } else {
                    Y.fire(settings.eventPrefix + ":completed", {
                        target: { result: e.data.content }
                    });
                }
            }
            function initializeListeners() {
                initializeFileSelectListener();

                Y.Global.on("gepbridge:readcomplete", readCompleted);

                Y.Global.on("gepbridge:readerror", function(e) {
                    Y.fire(settings.eventPrefix + ":error", e);
                });
            }

            initializeFileReader();
            initializeListeners();

            function getFieldValue() {
                return uploader.get("fileList")[0];
            }

            function loadFileAsync() {
                uploader.upload(getFieldValue());
            }

            return {
                loadFileAsync: loadFileAsync,
                getFieldValue: getFieldValue
            };
        };

        Y.namespace("GEP").flashTextFileReader = flashTextFileReader;
    },
    "0.0.1", {
        requires: ["gep", "uploader", "uploader-flash"]
    }
);
