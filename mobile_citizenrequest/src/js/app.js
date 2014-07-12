/*
 *
 *
 * Your custom code goes here
 *
 *
 */

jQuery.fn.exists = function () {
    return jQuery(this).length > 0;
};

function applicationInitialize() {
    var appGlobals = {
        map: null,
        collectMode: false,
        citizenRequestLayer: null,
        locator: null,
        locatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        citizenRequestLayerURL: "http://sampleserver5.arcgisonline.com/ArcGIS/rest/services/LocalGovernment/CitizenRequests/FeatureServer/0",
        center: [-88.147286296, 41.785857478]
    };

    $.mobile.pagecontainer({ defaults: true });

    $.mobile.pagecontainer({
        beforeload: function (event, ui) {
            console.log("beforeload: ", event.type, ui.dataUrl);
        },
        load: function (event, ui) {
            console.log("load: ", event.type, ui.dataUrl);
        },
        loadfailed: function (event, ui) {
            console.log("loadfailed: ", event.type, ui.dataUrl);
        },
        create: function (event, ui) {
            console.log("create: ", event.type, ui.dataUrl);
            // ----------------------------------------------------
            // Invoke function to initialize the code for the
            // ArcGIS API for JavaScript
            // ----------------------------------------------------
            $(".ui-loader").show();
            initializeEsriJS();
        },
        show: function (event, ui) {
            console.log("show: ", event.type, ui.dataUrl);
        },
        hide: function (event, ui) {
            console.log("hide: ", event.type, ui.dataUrl);
        },
        transition: function (event, ui) {
            console.log("transition: ", event.type, ui.dataUrl);
        },
        beforetransition: function (event, ui) {
            console.log("beforetransition: ", event.type, ui.dataUrl);
        },
        changefailed: function (event, ui) {
            console.log("changefailed: ", event.type, ui.dataUrl);
        }
    });

    function initializeEsriJS() {
        require(["dojo/_base/array",
                "dojo/_base/lang",
                "dojo/dom-construct",
                "dojo/on",
                "dojo/parser",
                "dojo/query!css3",
                "esri/Color",
                "esri/config",
                "esri/dijit/AttributeInspector",
                "esri/dijit/Geocoder",
                "esri/dijit/HomeButton",
                "esri/dijit/LocateButton",
                "esri/dijit/PopupMobile",
                "esri/geometry/webMercatorUtils",
                "esri/graphic",
                "esri/InfoTemplate",
                "esri/layers/FeatureLayer",
                "esri/map",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/tasks/locator",
                "esri/tasks/query", "dojo/domReady!"], function (array, lang, domConstruct, on, parser, query, Color,
                                                                 esriConfig, AttributeInspector, Geocoder, HomeButton,
                                                                 LocateButton, PopupMobile, webMercatorUtils, Graphic,
                                                                 InfoTemplate, FeatureLayer, Map, SimpleLineSymbol,
                                                                 SimpleMarkerSymbol, Locator, Query) {

                parser.parse();
                console.log("Invoking Dojo domReady! plugin");
                // ----------------------------------------------------
                // This sample requires a proxy page to handle
                // communications with the ArcGIS Server services. You
                // will need to replace the url below with the location
                // of a proxy on your machine. See the
                // "Using the proxy page" help topic for details on
                // setting up a proxy page.
                // ----------------------------------------------------
                esriConfig.defaults.io.proxyUrl = "/sproxy";

                // ----------------------------------------------------
                // Create the symbology for the selected feature,
                // when a Popup opens
                // ----------------------------------------------------
                var slsHighlightSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([38, 38, 38, 0.7]), 2);
                var sms = new SimpleMarkerSymbol();
                sms.setPath("M21.5,21.5h-18v-18h18V21.5z M12.5,3V0 M12.5,25v-3 M25,12.5h-3M3,12.5H0");
                sms.setSize(45);
                sms.setOutline(slsHighlightSymbol);
                var infoWindowPopup = new PopupMobile({markerSymbol: sms}, domConstruct.create("div"));

                // ----------------------------------------------------
                // Dictionary objects to provide domain value lookup for fields in popups
                // ----------------------------------------------------
                var severityFieldDomainCodedValuesDict = {};
                var requestTypeFieldDomainCodedValuesDict = {};

                // ----------------------------------------------------
                // InfoTemplate for the FeatureLayer
                // ----------------------------------------------------
                var featureLayerInfoTemplate = new InfoTemplate();
                featureLayerInfoTemplate.setTitle("<b>Request ${objectid:formatRequestID}</b>");
                var infoTemplateContent = "<span class=\"infoTemplateContentRowLabel\">Date:</span><span class=\"infoTemplateContentRowItem\">${requestdate:DateFormat}</span><br>" +
                    "<span class=\"infoTemplateContentRowLabel\">Phone:</span><span class=\"infoTemplateContentRowItem\">${phone:formatNumber}</span><br>" +
                    "<span class=\"infoTemplateContentRowLabel\">Name:</span><span class=\"infoTemplateContentRowItem\">${name}</span><br>" +
                    "<span class=\"infoTemplateContentRowLabel\">Severity:</span><span class=\"infoTemplateContentRowItem\">${severity:severityDomainLookup}</span><br>" +
                    "<span class=\"infoTemplateContentRowLabel\">Type:</span><span class=\"infoTemplateContentRowItem\">${requesttype:requestTypeDomainLookup}</span><br>" +
                    "<span class=\"infoTemplateContentRowLabel\">Comments:</span><span class=\"infoTemplateContentRowItem\">${comment}</span>";
                featureLayerInfoTemplate.setContent(infoTemplateContent);

                // ----------------------------------------------------
                // Formatting functions for infoTemplate
                // ----------------------------------------------------
                severityDomainLookup = function (value, key, data) {
                    return severityFieldDomainCodedValuesDict[value];
                };
                requestTypeDomainLookup = function (value, key, data) {
                    return requestTypeFieldDomainCodedValuesDict[value];
                };

                formatRequestID = function (value, key, data) {
                    var searchText = new String(value);
                    var formattedString = searchText.replace(/(\d)(?=(\d\d\d)+(?!\d))/gm, "$1,");
                    return formattedString;
                };

                // ----------------------------------------------------
                // Initialize the main User Interface components
                // ----------------------------------------------------
                appGlobals.map = new Map("ui-map", {
                    sliderOrientation: "horizontal",
                    sliderPosition: "bottom-right",
                    basemap: "topo",
                    center: appGlobals.center,
                    zoom: 13,
                    sliderStyle: "small",
                    infoWindow: infoWindowPopup
                });

                appGlobals.locator = new Locator(appGlobals.locatorURL);

                var geocoder = new Geocoder({
                    arcgisGeocoder: {
                        placeholder: "Search "
                    },
                    map: appGlobals.map
                }, "ui-dijit-geocoder");

                var geoLocate = new LocateButton({
                    map: appGlobals.map
                }, "ui-dijit-locatebutton");

                var homeButton = new HomeButton({
                    map: appGlobals.map
                }, "ui-home-button-hidden");

                // ----------------------------------------------------
                // Initialize the FeatureLayer, LayerInfo, and
                // AttributeInspector
                // ----------------------------------------------------
                appGlobals.citizenRequestLayer = new FeatureLayer(appGlobals.citizenRequestLayerURL,
                    {mode: FeatureLayer.MODE_ONEDEMAND,
                        infoTemplate: featureLayerInfoTemplate,
                        outFields: ["*"]
                    });

                var layerInfoArray = [
                    {
                        "featureLayer": appGlobals.citizenRequestLayer,
                        "showAttachments": false,
                        "showDeleteButton": false,
                        "isEditable": true,
                        "fieldInfos": [
                            {
                                "fieldName": "requesttype",
                                "label": "Type",
                                "isEditable": true
                            },
                            {
                                "fieldName": "name",
                                "label": "Name",
                                "isEditable": true
                            },
                            {//dojo/_base/html: set a property on an html element
                                "fieldName": "phone",
                                "label": "Phone",
                                "isEditable": true
                            },
                            {
                                "fieldName": "email",
                                "label": "Email",
                                "isEditable": true
                            },
                            {
                                "fieldName": "comment",
                                "label": "Comments",
                                "isEditable": true,
                                "stringFieldOption": AttributeInspector.STRING_FIELD_OPTION_TEXTAREA
                            }
                        ]
                    }
                ];

                var attributeInspector = new AttributeInspector({
                    layerInfos: layerInfoArray
                }, "ui-attributes-container");

                // ----------------------------------------------------
                // Returns the Feature Template given the Coded Value
                // ----------------------------------------------------
                function getFeatureTemplateFromCodedValueByName(item) {
                    var returnType = null;
                    $.each(appGlobals.citizenRequestLayer.types, function (index, type) {
                        if (type.name === item) {
                            returnType = type.templates[0];
                        }
                    });
                    console.log("Invoking getFeatureTemplateFromCodedValueByName", item, returnType);
                    return returnType;
                }

                // ----------------------------------------------------
                // Initializes event handler for map and prepares the
                // FeatureTemplate
                // ----------------------------------------------------
                function addCitizenRequestFeature(item) {
                    console.log("Invoking addCitizenRequestFeature: ", item);
                    $("#ui-collection-prompt").popup("open");
                    var citizenRequestFeatureTemplate = getFeatureTemplateFromCodedValueByName(item);

                    var mapClickEventHandler = on(appGlobals.map, "click", function (event) {
                        console.log("Invoking mapClickEventHandler");
                        //only capture one click
                        mapClickEventHandler.remove();
                        // set back to false, since the map has been clicked on.
                        appGlobals.collectMode = false;

                        var currentDate = new Date();
                        console.log("Initializing featureLayerInfoTemplate attributes:", citizenRequestFeatureTemplate.prototype.attributes);
                        var newAttributes = lang.mixin({}, citizenRequestFeatureTemplate.prototype.attributes);
                        newAttributes.requestdate = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds(), 0);
                        var newGraphic = new Graphic(event.mapPoint, null, newAttributes);
                        // ----------------------------------------------------
                        // Creates the new feature in the citizen request
                        // FeatureLayer
                        // ----------------------------------------------------
                        appGlobals.citizenRequestLayer.applyEdits([newGraphic], null, null, function (adds) {
                            console.log("Invoking applyEdits on FeatureLayer: adding a new feature", JSON.stringify(adds));
                            var query = new Query();
                            var res = adds[0];
                            query.objectIds = [res.objectId];
                            // ----------------------------------------------------
                            // Query the citizen request FeatureLayer for the
                            // Graphic that was just added, well use its geometry
                            // to lookup the address at that location
                            // ----------------------------------------------------
                            appGlobals.citizenRequestLayer.queryFeatures(query, function (result) {
                                console.log("Searching the FeatureLayer for the feature that was just collected.");
                                if (result.features.length > 0) {
                                    console.log("Found the feature that was just collected", result.features[0]);
                                    var currentFeature = result.features[0];
                                    var currentFeatureLocation = webMercatorUtils.webMercatorToGeographic(currentFeature.geometry);
                                    // ----------------------------------------------------
                                    // Convert the feature's location to a real world
                                    // address using ArcGIS.com locator service
                                    // ----------------------------------------------------
                                    appGlobals.locator.locationToAddress(currentFeatureLocation, 100, function (candidate) {
                                        console.log("Converting the collected feature's location to its postal address");
                                        var address = [];
                                        var displayAddress;
                                        if (candidate.address) {
                                            if (candidate.address.Address) {
                                                address.push(candidate.address.Address);
                                            }
                                            if (candidate.address.City) {
                                                address.push(candidate.address.City + ",");
                                            }
                                            if (candidate.address.Region) {
                                                address.push(candidate.address.Region);
                                            }
                                            if (candidate.address.Postal) {
                                                address.push(candidate.address.Postal);
                                            }
                                            displayAddress = address.join(" ");
                                        } else {
                                            displayAddress = "No address for this location";
                                        }
                                        // ----------------------------------------------------
                                        // Tell jQuery Mobile to navigate to the page containing
                                        // the AttributeInspector
                                        // ----------------------------------------------------
                                        $.mobile.changePage("#ui-attributes-page", null, true, true);
                                        //display the geocoded address on the attribute dialog.
                                        $("#currentAddress")[0].textContent = displayAddress;
                                    }, function (error) {
                                        console.warn("Unable to find address, maybe there are no streets at this location", error.details[0]);
                                        // ----------------------------------------------------
                                        // Tell jQuery Mobile to navigate to the page containing
                                        // the AttributeInspector
                                        // ----------------------------------------------------
                                        $.mobile.changePage("#ui-attributes-page", null, true, true);
                                        //display the geocode error on the attribute dialog.
                                        $("#currentAddress")[0].textContent = error.details[0];
                                    });
                                }
                                else {
                                    console.warn("Unable to locate the feature that was just collected.");
                                }
                            });
                        }, function (error) {
                            // do some great error catching
                            console.error(JSON.stringify(error));
                        });
                    });

                }

                // ----------------------------------------------------
                //
                // ----------------------------------------------------
                function layersAddResultEventHandler(event) {
                    console.log("Invoking layersAddResultEventHandler");
                    var layersArray = event.layers;

                    $.each(layersArray, function (index, value) {
                        var currentLayer = value.layer;
                        if (currentLayer.hasOwnProperty("renderer")) {
                            var renderer = currentLayer.renderer;
                            console.log(currentLayer.name, " renderer values:", JSON.stringify(renderer.values));
                            if (renderer.hasOwnProperty("infos")) {
                                console.log(currentLayer.name, " has infos property");
                                var infos = renderer.infos;
                                // ----------------------------------------------------
                                // unordered list in parent div ui-features-panel
                                // ----------------------------------------------------
                                $("#ui-feature-list").append("<li data-role=\"list-divider\" class=\"ui-li-divider ui-bar-inherit ui-first-child\">Report an issue</li>");
                                $.each(infos, function (j, info) {
                                    severityFieldDomainCodedValuesDict[info.value] = info.label;
                                    console.log(currentLayer.name, "[" + j + "] info:", JSON.stringify(info));
                                    // ----------------------------------------------------
                                    // Initialize an event handler for the list item click
                                    // ----------------------------------------------------
                                    var listItem = $("<li/>").on("click", function (event) {
                                        console.log("#ui-feature-list, clicked: ", info.label);
                                        appGlobals.map.setMapCursor("pointer");
                                        // ----------------------------------------------------
                                        // wire the click event to call addCitizenRequestFeature
                                        // ----------------------------------------------------
                                        addCitizenRequestFeature(info.label);
                                        appGlobals.collectMode = true;
                                    });
                                    listItem.attr("data-theme", "a");
                                    var listContent = [];
                                    listContent.push("<a href=\"#ui-map-page\" class=\"ui-btn ui-btn-icon-right ui-icon-plus\">" + info.label + "</a>");
                                    listItem.append(listContent.join(""));
                                    // ----------------------------------------------------
                                    // unordered list in parent div ui-features-panel
                                    // ----------------------------------------------------
                                    $("#ui-feature-list").append(listItem);
                                });
                            }
                        }
                    });
                }

                // ----------------------------------------------------
                //
                // ----------------------------------------------------
                function initializeEventHandlers() {
                    console.log("initializeEventHandlers");

                    on(appGlobals.map, "load", function (event) {
                        console.log("map loaded");

                        appGlobals.map.infoWindow.resize(185, 100);

                        /* var selectionSymbol = map.infoWindow.markerSymbol;
                         selectionSymbol.setOutline(new SimpleLineSymbol().setColor(new Color.setColor([83, 83, 83])));
                         map.infoWindow.set("markerSymbol", selectionSymbol); */
                        on(appGlobals.map, "layers-add-result", layersAddResultEventHandler);
                    });

                    on(appGlobals.citizenRequestLayer, "error", function (event) {
                        console.error("citizenRequestLayer failed to load.", JSON.stringify(event.error));
                        $(".ui-loader").hide();
                    });

                    on(appGlobals.citizenRequestLayer, "load", function (event) {
                            console.log("citizenRequestLayer loaded");
                            var featureLayerTemplates = appGlobals.citizenRequestLayer.templates;
                            console.log("citizenRequestLayer templates: ", JSON.stringify(featureLayerTemplates));
                            if (appGlobals.citizenRequestLayer.hasOwnProperty("fields")) {
                                var fieldsArray = appGlobals.citizenRequestLayer.fields;
                                array.forEach(fieldsArray, function (field, i) {
                                    console.log("citizenRequest layer field name: ", field.name, i);
                                    if (field.name === "severity") {
                                        console.log("Populating dictionary object for severity field domain values");
                                        if (field.hasOwnProperty("domain")) {
                                            if (field.domain.hasOwnProperty("codedValues")) {
                                                var codedValuesArray0 = field.domain.codedValues;
                                                array.forEach(codedValuesArray0, function (codedValue) {
                                                    severityFieldDomainCodedValuesDict[codedValue.code] = codedValue.name;

                                                });
                                            }
                                        }
                                    }
                                    if (field.name === "requesttype") {
                                        console.log("Populating dictionary object for requesttype field domain values");
                                        if (field.hasOwnProperty("domain")) {
                                            if (field.domain.hasOwnProperty("codedValues")) {
                                                var codedValuesArray1 = field.domain.codedValues;
                                                array.forEach(codedValuesArray1, function (codedValue) {
                                                    requestTypeFieldDomainCodedValuesDict[codedValue.code] = codedValue.name;

                                                });
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                console.error("Unable to find property fields in: ", JSON.stringify(appGlobals.citizenRequestLayer));
                            }
                            $(".ui-loader").hide();
                        }
                    );

                    on(appGlobals.citizenRequestLayer, "click", function (event) {
                        console.log("citizenRequestLayer clickEventHandler");
                        appGlobals.map.infoWindow.setFeatures([event.graphic]);
                    });

                    on(attributeInspector, "attribute-change", function (event) {
                        console.log("AttributeInspector attributeChangeEventHandler");
                        var feature = event.feature;
                        if (event.fieldName && event.fieldValue) {
                            feature.attributes[event.fieldName] = event.fieldValue;
                            feature.getLayer().applyEdits(null, [feature], null);
                        } else {
                            feature.getLayer().applyEdits(null, [feature], null);
                        }
                    });

                    on(geoLocate, "locate", function (event) {
                        console.log("geoLocate locateEventHandler");
                        var coords = event.position.coords;
                        console.log("altitude: ", coords.altitude, " heading: ", coords.heading, " speed: ", coords.speed);
                    });

                    on(infoWindowPopup, "show", function (event) {
                        console.log("infoWindowPopup showEventHandler");
                        if ($("*.esriMobileNavigationItem.left > img[src]").exists()) {
                            console.log(".esriMobileNavigationItem.left img has a src attribute");
                            $("*.esriMobileNavigationItem.left > img").removeAttr("src");
                        }
                        if ($("*.esriMobileNavigationItem.right > img[src]").exists) {
                            console.log(".esriMobileNavigationItem.right img has a src attribute");
                            $("*.esriMobileNavigationItem.right > img").removeAttr("src");
                        }
                    });

                    geocoder.startup();
                    geoLocate.startup();
                    homeButton.startup();

                    $("#ui-home-button").click(function () {
                        console.log("homeButton clickEventHandler");
                        homeButton.home();
                        $("#ui-settings-panel").panel("close");
                    });

                    positionSettingsUIElement();
                    $(window).resize(positionSettingsUIElement);

                    $(".basemapOption").click(swapBasemap);


                    $("#ui-features-panel").on("popupafteropen", function (event, ui) {
                        console.log("ui-features-panel, infoWindowPopup after open");
                        $("#ui-features-panel").on("popupafterclose", function (event, ui) {
                            if (appGlobals.collectMode) {
                                $("#ui-collection-prompt").show();
                            }
                            else {
                                $("#ui-collection-prompt").hide();
                            }
                            setTimeout(function () {
                                $("#ui-collection-prompt").popup("open");
                            }, 10);
                            console.log("#ui-collection-prompt", "popupafterclose");
                        });
                    });

                    $("#ui-collection-prompt").on("popupafteropen", function (event, ui) {
                        setTimeout(function () {
                            $("#ui-collection-prompt").popup("close");
                        }, 1200);
                    });
                }

                // ----------------------------------------------------
                // Initialize Event Handlers and add the citizen request
                // layer to the map
                // ----------------------------------------------------
                initializeEventHandlers();
                appGlobals.map.addLayers([appGlobals.citizenRequestLayer]);

            }
        ); // end require / function
    }

    function swapBasemap(event) {
        var _basemapName = event.target.dataset.basemapname;
        appGlobals.map.setBasemap(_basemapName);
        console.log("Invoking swapBasemap, switching basemap to: ", _basemapName);
        $("#ui-settings-panel").panel("close");
    }

    function positionSettingsUIElement(event) {
        console.log("Invoking positionSettingsUIElement");
        $("#ui-settings-button").css("top", (window.innerHeight / 2 - (34 / 2)));
    }

}