# Resources from Strategies for Building Mobile Apps Using ArcGIS API for JavaScript

Smartphones and tablets are now outselling PCs, so it's the perfect time to think about designing applications for mobile devices. In this workshop, you will learn design techniques, best practices, and tips and tricks for building a mobile site that is optimized for usability and performance using ArcGIS API for JavaScript.

## Mobile resources in the API

* [Get the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/jshelp/intro_accessapi.html)
* [ArcGIS API for JavaScript compact build](https://developers.arcgis.com/javascript/jshelp/inside_compactbuild.html)
* [ArcGIS API for JavaScript Web Optimizer](http://jso.arcgis.com)
* [JavaScript frameworks](https://developers.arcgis.com/javascript/jshelp/mobile_frameworks.html)
	* [The Dojo Toolkit - Demos Index](http://demos.dojotoolkit.org/demos/)
	* [jQuery Mobile Demos](http://demos.jquerymobile.com/1.4.3/)
* [Viewport Settings](https://developers.arcgis.com/javascript/jshelp/mobile_viewport.html)
* [Feature detection and browser sniffing](https://developers.arcgis.com/javascript/jshelp/mobile_hardware.html)
* [HTML5 and Mobile](https://developers.arcgis.com/javascript/jshelp/mobile_geolocation.html)
* [Device Orientation](https://developers.arcgis.com/javascript/jshelp/mobile_orientation.html)
* [Mobile References](https://developers.arcgis.com/javascript/jshelp/mobile_references.html)
* [Tutorial: getting started with mobile](https://developers.arcgis.com/javascript/jstutorials/mobile_dev.html)
* [Mobile Samples](https://developers.arcgis.com/javascript/jssamples/#mobile)

## Designing for mobile

* [Making forms fabulous with HTML5](http://www.html5rocks.com/en/tutorials/forms/html5forms/)

* [Geocoder](https://developers.arcgis.com/javascript/jsapi/geocoder-amd.html)
	* [Samples](https://developers.arcgis.com/javascript/jssamples/#search/Geocoder)
* [HomeButton](https://developers.arcgis.com/javascript/jsapi/homebutton-amd.html)
	* [Sample](https://developers.arcgis.com/javascript/jssamples/widget_home.html)
	* [View it Live](http://developers.arcgis.com/javascript/samples/widget_home/)
* [PopupMobile](https://developers.arcgis.com/javascript/jsapi/popupmobile-amd.html)
	* [Sample](https://developers.arcgis.com/javascript/jssamples/widget_mobilepopup.html)
	* [View it Live](https://developers.arcgis.com/javascript/samples/widget_mobilepopup/)
* [BasemapGallery](https://developers.arcgis.com/javascript/jsapi/basemapgallery-amd.html)
	* [Sample](https://developers.arcgis.com/javascript/jssamples/map_agol.html)
	* [View it Live](http://developers.arcgis.com/javascript/samples/map_agol/)
* [BasemapToggle](https://developers.arcgis.com/javascript/jsapi/basemaptoggle-amd.html)
	* [Sample](https://developers.arcgis.com/javascript/jssamples/widget_toggle.html)
	* [View it Live](http://developers.arcgis.com/javascript/samples/widget_toggle/)

## Productivity for your workflows

* [Node.js](http://nodejs.org)

* JavaScript Task Runners
	* [Gulp](http://gulpjs.com)
	* [Grunt](http://gruntjs.com), [Grunt project scaffolding](http://gruntjs.com/project-scaffolding)
		* [grunt](https://www.npmjs.org/package/grunt)
		* [grunt-contrib-clean](https://www.npmjs.org/package/grunt-contrib-clean)
		* [grunt-contrib-compass](https://www.npmjs.org/package/grunt-contrib-compass)
		* [grunt-contrib-concat](https://www.npmjs.org/package/grunt-contrib-concat)
		* [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy)
		* [grunt-contrib-cssmin](https://www.npmjs.org/package/grunt-contrib-cssmin)
		* [grunt-contrib-htmlmin](https://www.npmjs.org/package/grunt-contrib-htmlmin)
		* [grunt-contrib-uglify](https://www.npmjs.org/package/grunt-contrib-uglify)
		* [grunt-contrib-watch](https://www.npmjs.org/package/grunt-contrib-watch)
		* [grunt-targethtml](https://www.npmjs.org/package/grunt-targethtml)
		* [load-grunt-tasks](https://www.npmjs.org/package/load-grunt-tasks)
		* [time-grunt](https://www.npmjs.org/package/time-grunt)
		* [grunt-esrijso-modulelist](https://github.com/lheberlie/grunt-esrijso-modulelist)
		* [grunt-manifest](https://github.com/lheberlie/grunt-manifest)
		* [Automate all things](http://www.jorisooms.be/gruntjs-automate-all-the-things/)
* CSS Preproccessors
	* [Sass](http://sass-lang.com)
		* [Compass](http://compass-style.org)
	* [Stylus](http://learnboost.github.io/stylus/)
	* [Less](http://lesscss.org)
* [ JSHint (Esri jsapi resources)](https://github.com/Esri/jsapi-resources)

## Debugging and Testing

* [Open Device Lab](http://opendevicelab.com)
* [LabUp](http://labup.org)
* [Safari Web Inspector Remote](https://developer.apple.com/safari/tools/)
* [Google Chrome remote debugging](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)
* [Google Chrome, Mobile Emulation](https://developer.chrome.com/devtools/docs/mobile-emulation)
* [Adobe Edge Inspect](http://html.adobe.com/edge/inspect/)

## Optimizing for mobile

* [A Beginner's Guide to Using the Application Cache](http://www.html5rocks.com/en/tutorials/appcache/beginner/)
* [IcoMoon, Icon Fonts](http://icomoon.io)
* [CSS Tricks, Icon Fonts are Awesome](http://css-tricks.com/examples/IconFont/)
* File compressions and caching headers

	```apache
	<IfModule mod_deflate.c>
        	AddOutputFilterByType DEFLATE text/plain
        	AddOutputFilterByType DEFLATE text/html
        	AddOutputFilterByType DEFLATE text/xml
        	AddOutputFilterByType DEFLATE text/css
        	AddOutputFilterByType DEFLATE application/xml
        	AddOutputFilterByType DEFLATE application/xhtml+xml
        	AddOutputFilterByType DEFLATE application/rss+xml
        	AddOutputFilterByType DEFLATE application/javascript
        	AddOutputFilterByType DEFLATE application/x-javascript
        	AddOutputFilterByType DEFLATE application/json
        	AddOutputFilterByType DEFLATE image/svg+xml
    	</IfModule>
	```
	
	```apache
	<IfModule mod_expires.c>
		ExpiresActive on
		ExpiresByType text/html "access plus 5 minutes" 
		ExpiresByType image/jpg "access plus 6 months" 
		ExpiresByType image/jpeg "access plus 6 months" 
		ExpiresByType image/gif "access plus 6 months" 
		ExpiresByType image/png "access plus 6 months"
		ExpiresByType text/css "access plus 6 months" 
		ExpiresByType text/javascript "access plus 6 months" 
		ExpiresByType application/javascript "access plus 6 months"
		ExpiresByType application/x-javascript "access plus 6 months"
		ExpiresByType application/x-icon "access plus 1 year" 
	</IfModule>
	```
* [Android: Using the Emulator, Network Delay Emulation](http://developer.android.com/tools/devices/emulator.html#netdelay)

## Other resources

* [SmashingMagazine: The Mobile Book](https://shop.smashingmagazine.com/the-mobile-book-digital-edition.html)
* [Esri jsapi resources](https://github.com/Esri/jsapi-resources)
	* JSHint
	* OAuth
	* TypeScript
* [Esri resource proxy](https://github.com/esri/resource-proxy)
* [Android Device Art Generator](http://developer.android.com/distribute/tools/promote/device-art.html)
* [JetBrains WebStorm Blog](http://blog.jetbrains.com/webstorm/)
* [Emmet](http://emmet.io)


