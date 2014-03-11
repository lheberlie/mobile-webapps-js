define([
    "dojo/ready", 
    "dojo/dom",
    "dojo/date/locale",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "esri/IdentityManager",
    "esri/dijit/LocateButton",
    "esri/dijit/PopupTemplate",
    "esri/graphic",
    "esri/geometry/Point",
    "dojo/on",
    "dojo/has",
    "dojo/Deferred",
    "application/Drawer"
],
function(
    ready, 
    dom,
    locale,
    declare,  
    array,
    lang,
    arcgisUtils,
    IdentityManager,
    LocateButton,
    PopupTemplate,
    Graphic,
    Point,
    on,
    has,
    Deferred,
    Drawer
) {
    return declare("", null, {
        config: {},
        constructor: function(config) {
            //config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information. 
            this.config = config;
            // responsive drawer
            this._drawer = new Drawer({
                showDrawerSize: 850, // Pixel size when the drawer is automatically opened
                borderContainer: "border_container", // border container node id
                contentPaneCenter: "cp_center", // center content pane node id
                contentPaneSide: "cp_left", // side content pane id
                toggleButton: "toggle_button", // button node to toggle drawer id
                direction: this.config.i18n.direction // i18n direction "ltr" or "rtl"
            });
            // startup drawer
            this._drawer.startup();

            //Setup the click listener for the submit button 
            on(dom.byId("report_button"), "click", lang.hitch(this, this._createReport));

            //Set today as the default date value 
            var dateField = dom.byId("report_date");
  
            if(dateField.hasOwnProperty("valueAsDate")){
                dateField.valueAsDate = new Date();
            }


            // map ready
            ready(lang.hitch(this, function() {
                this._createWebMap();
            }));
        },

        //create a map based on the input web map id
        _createWebMap: function() {
            var itemInfo = this.config.itemInfo || this.config.webmap;
            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: {
                    slider:false
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function(response) {

                this.map = response.map;

                this.graffitiLayer = response.itemInfo.itemData.operationalLayers[0].layerObject;
                on(this.graffitiLayer, "click", lang.hitch(this, this._setPopupContent));
               
                this.locateButton = new LocateButton({
                    map:this.map,
                    highlightLocation:false
                },"locator");
                this.locateButton.startup();

                on(this.locateButton, "locate", lang.hitch(this, function(result){
                    //update the map with the current location 
                   if(result && result.graphic && result.graphic.geometry){
                        this.currentGraphic = new Graphic(result.graphic.geometry);
                   }
                }));                
           


            }), lang.hitch(this, function(error) {
                //an error occurred - notify the user. In this example we pull the string from the 
                //resource.js file located in the nls folder because we've set the application up 
                //for localization. If you don't need to support mulitple languages you can hardcode the 
                //strings here and comment out the call in index.html to get the localization strings. 
                if (this.config && this.config.i18n) {
                    alert(this.config.i18n.map.error + ": " + error.message);
                } else {
                    alert("Unable to create map: " + error.message);
                }
            }));
        },
        _createReport: function(){
            //do we have a location? If not get one? 
            if(this.currentGraphic){
                console.log("Current location available")
                this._addReport(this.currentGraphic);
            }else{
                console.log("No location available - prompt for location");
                this.locateButton.locate().then(lang.hitch(this, function(result){

                        //update the map with the current location 
                       if(result && result.graphic && result.graphic.geometry){
                            this.currentGraphic = new Graphic(result.graphic.geometry);
                            this._addReport(this.currentGraphic);
                       }
                }));

            }
        },
        _clearForm: function(){
            //leave the date and email but clear the rest 
            this.currentGraphic = null;
            dom.byId("status").innerHTML = "See graffiti? Take a picture and submit a report. Note we'll use your current location as the graffiti location.";
            dom.byId("report_desc").value = null;
            
            //close the drawer
            this._drawer.toggle();

        },
        _addReport: function(graphic){
                //add the report 
                var attr = {
                    "email": dom.byId("report_email").value || null,
                    "description": dom.byId("report_desc").value || null,
                    "date": dom.byId("report_date").value || null
                };

                graphic.setAttributes(attr);
                //create the feature 
                this.graffitiLayer.applyEdits([graphic],null, null, lang.hitch(this, function(result){
                    dom.byId("status").innerHTML = "Report submitted.";
                    var id = null;
                    array.some(result, lang.hitch(this,function(r){
                        id = r.objectId;
                        return true; //get just the first feature 
                    }));
                    if(id){
                        this.graffitiLayer.addAttachment(id, dom.byId("uploadForm"),lang.hitch(this, function(response){
                            console.log("Photo added as attachment");
                            this._clearForm();
                        }));
                    }else{
                        this._clearForm();
                    }

   
                }));
        },
        _setPopupContent: function(result){

            var graphic = null, mapPoint = null;
            var mapPoint = result.mapPoint;
            if(result.graphic){
               graphic = result.graphic; 
               this.graffitiLayer.queryAttachmentInfos(graphic.attributes.FID).then(lang.hitch(this, function(results){
                    //Get the attachements 
                    var media = [];

                    dojo.forEach(results, lang.hitch(this, function(attachment){
          
                        media.push({
                            "title":attachment.name,
                            "type": "image",
                            "value":{
                                "sourceURL": attachment.url
                            }
                        });    
                    }));
           
                    var template = new PopupTemplate({
                        title: graphic.attributes.description,
                        mediaInfos:media
                    });
                    graphic.setInfoTemplate(template);


                    if(has("touch")){
                        this.map.infoWindow.maximize();
                        this.map.infoWindow.show(mapPoint);
                    }else{
                        this.map.infoWindow.show(mapPoint);
                    }

               }));


            }  

        }
    });
});