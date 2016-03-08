// --------------------------------------------------------------------
// http://acetate.io/documentation/
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// acetate config module
// --------------------------------------------------------------------
module.exports = function (acetate){

  // --------------------------------------------------------------------
  // http://acetate.io/documentation/command-line/
  //
  // set the log level we want
  // levels: debug|verbose|info|success|warn|error|stack|silent
  // --------------------------------------------------------------------
  //acetate.log = "debug";
  //acetate.src = "source";
  //acetate.dest = "build-artifacts";

  // --------------------------------------------------------------------
  // Page metadata: http://acetate.io/documentation/page-metadata/
  //
  // apply metadata in bulk to pages matching **/*
  // --------------------------------------------------------------------
  acetate.metadata("**/*", {
    jsapi_hostname: acetate.args.jsapi_hostname,
    jsapi_version: acetate.args.jsapi_version,
    jsapiUrl: "bar"
  });

  //acetate.global("jsapiUrl","foo");
  // --------------------------------------------------------------------
  // Layouts: http://acetate.io/documentation/layouts/
  //
  // all pages matching **/* will extend the 'content' block inside _layout.html
  // --------------------------------------------------------------------
  acetate.layout("**/*", "layouts/_layout:content");
  acetate.layout("hello/**/*.html", "layouts/_layout:content");

  // --------------------------------------------------------------------
  // Nunjucks filter template to allow redirecting content inside of a
  // template to console.log
  // Usage: {{ my_variable_in_the_page | log }}
  // --------------------------------------------------------------------
  acetate.filter("log", function (value){
    console.log(value);
    return false;
  });

  acetate.helper('stylesheet_url', function (context, css){
    if (css.indexOf('//') >= 0) {
      return css;
    }
    return 'assets/css/' + css;
  });

  acetate.helper('javascript_url', function (context, js){
    if (js.indexOf('//') >= 0) {
      return js;
    }
    return 'assets/js/' + js;
  });

};