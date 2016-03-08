// Javascript banner
var banner = "/*!\n" +
  "*  <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
  "*  <%= pkg.homepage %>\n" +
  "*  Copyright (c) <%= grunt.template.today(\"yyyy\") %> Company Name\n" +
  "*  Apache 2.0 License \n" +
  "*/\n";

var currentVersion = require("./package.json").version;

module.exports = function (grunt){
  // show elapsed time at the end
  require("time-grunt")(grunt);
  // load all grunt tasks
  require("load-grunt-tasks")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // --------------------------------------------------------------------
    // Delete files and directories
    // --------------------------------------------------------------------
    clean: {
      build: {
        src: ["<%= pkg.heb.destination_directory %>"]
      },
      source: {
        src: [
          "<%= pkg.heb.source_directory %>/assets/css/**/*"
        ]
      }
    },
    // --------------------------------------------------------------------
    // Acetate
    // Running a development server
    // --------------------------------------------------------------------
    acetate: {
      // global options
      options: {
        config: "acetate.conf.js",
        src: "<%= pkg.heb.source_directory %>",
        dest: "<%= pkg.heb.destination_directory %>",
        args: {
          jsapiUrl: "https://js.arcgis.com/4.0beta3/",
          jsapi_version: ""
        }
      },

      // with all default options
      build: {
        options: {
          mode: "build",
          log: "verbose"
        }
      },
      server: {
        options: {
          mode: "server",
          log: "info",
          open: "true",
          port: "3000",
          keepalive: true
        }
      },
      // with custom options
      watch: {
        options: {
          open: "true",
          mode: "server",
          keepalive: true,
          port: "3000",
          host: "heb.esri.com",
          log: "verbose"
        }
      }
    },
    // --------------------------------------------------------------------
    // Watch files
    // --------------------------------------------------------------------
    "watch": {
      scripts: {
        files: ["<%= pkg.heb.source_directory %>/assets/js/**/*"],
        tasks: [
          "copy-js",
          "jshint"
        ]
      },
      images: {
        files: ["<%= pkg.heb.source_directory %>/assets/img/**/"],
        tasks: [
          "copy-img"
        ]
      },
      icons: {
        files: ["lib/img/icons/**/*.svg"],
        tasks: [
          "shell:icons"
        ]
      },
      sass: {
        files: ["<%= pkg.heb.source_directory %>/assets/sass/**/*"],
        tasks: [
          "sass"
        ]
      },
      fonts: {
        files: ["<%= pkg.heb.source_directory %>/assets/fonts/**/*"],
        tasks: [
          "copy-fonts"
        ]
      }
    },
    // Check Javascript for errors
    "jshint": {
      all: ["<%= pkg.heb.source_directory %>/js/index.js"]
    },
    // --------------------------------------------------------------------
    // Build CSS files from SASS
    // node_modules/calcite-bootstrap/dist/sass/
    // calcite-bootstrap.scss
    // calcite-bootstrap-dark.scss
    // calcite-bootstrap-dark-open.scss
    // calcite-bootstrap-open.scss
    // --------------------------------------------------------------------
    "sass": {
      bootstrap: {
        options: {
          includePaths: [
            "node_modules/bootstrap-sass/assets/stylesheets"
          ]
        },
        src: "<%= pkg.heb.source_directory %>/assets/sass/bootstrap/index.scss",
        dest: "<%= pkg.heb.destination_directory %>/assets/css/bootstrap.css"
      },
      calcite_bootstrap: {
        options: {
          includePaths: [
            "node_modules/bootstrap-sass/assets/stylesheets",
            "node_modules/calcite-bootstrap/lib/sass"
          ]
        },
        src: "<%= pkg.heb.source_directory %>/assets/sass/calcite-bootstrap/index.scss",
        dest: "<%= pkg.heb.destination_directory %>/assets/css/calcite-bootstrap.css"
      },
      calcite_web: {
        options: {
          includePaths: [
            "node_modules/calcite-web/dist/sass"
          ]
        },
        src: "<%= pkg.heb.source_directory %>/assets/sass/calcite-web/index.scss",
        dest: "<%= pkg.heb.destination_directory %>/assets/css/calcite-web.css"
      }
    },
    // --------------------------------------------------------------------
    // Uglify
    // --------------------------------------------------------------------
    // Build minified Javascript file to dist
    "uglify": {
      options: {
        mangle: false,
        banner: banner
      },
      dist: {
        files: {
          "dist/js/calcite-web.min.js": ["lib/js/calcite-web.js"]
        }
      }
    },
    // --------------------------------------------------------------------
    // Copy libsass files to dist, doc assets to build
    // --------------------------------------------------------------------
    "copy": {
      jsJQuery: {
        expand: true,
        cwd: "node_modules/jquery/dist",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/jquery"
      },
      jsBootstrap: {
        expand: true,
        cwd: "node_modules/bootstrap-sass/assets/javascripts",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/bootstrap"
      },
      jsDojoBootstrap: {
        expand: true,
        cwd: "node_modules/dojo-bootstrap/",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/dojo-bootstrap"
      },
      jsCalciteWeb: {
        expand: true,
        cwd: "node_modules/calcite-web/dist/js",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/calcite-web"
      },
      fontsBootstrap: {
        expand: true,
        cwd: "node_modules/bootstrap-sass/assets/fonts/bootstrap",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/fonts/bootstrap"
      },
      fontsCalciteWeb: {
        expand: true,
        cwd: "node_modules/calcite-web/dist/fonts",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/fonts/calcite-web"
      },
      fontsCalciteBootstrap: {
        expand: true,
        cwd: "node_modules/calcite-bootstrap/lib/fonts",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/fonts/calcite-bootstrap"
      },
      imgCalciteWeb: {
        expand: true,
        cwd: "node_modules/calcite-web/dist/img",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/img"
      },
      imgCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps/images",
        src: ["map-pin.svg"],
        dest: "<%= pkg.heb.destination_directory %>/assets/img"
      },
      cssCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps/css",
        src: ["**/*"],
        dest: "<%= pkg.heb.source_directory %>/assets/css/calcite-maps"
      },
      demosCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps",
        src: ["demos/**/*.html"],
        dest: "<%= pkg.heb.source_directory %>"
      },
      demosJSCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps/demos/js",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/calcite-maps/demos"
      },
      demosCSSCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps/demos/css",
        src: ["**/*"],
        dest: "<%= pkg.heb.source_directory %>/assets/css/calcite-maps/css"
      },

      jsCalciteMaps: {
        expand: true,
        cwd: "node_modules/calcite-maps/js",
        src: ["**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/calcite-maps"
      },
      assets: {
        expand: true,
        cwd: "<%= pkg.heb.source_directory %>/assets",
        src: ["css/**/*", "js/**/*"],
        dest: "<%= pkg.heb.destination_directory %>/assets"
      }
    },
    // --------------------------------------------------------------------
    // Copy Javascript to dist and doc
    // --------------------------------------------------------------------
    "concat": {
      options: {
        banner: banner,
        separator: "\n"
      },
      jquery_bootstrap: {
        src: [
          "node_modules/jquery/dist/jquery.js",
          "node_modules/bootstrap-sass/assets/javascripts/bootstrap.js"
        ],
        dest: "<%= pkg.heb.destination_directory %>/assets/js/jquery-bootstrap.js"
      }
    }

  });

  // ┌─────────────┐
  // │ Grunt tasks │
  // └─────────────┘

  // Default task
  grunt.registerTask("default", ["copy", "sass", "concat", "acetate:server", "watch"]);
  //grunt.registerTask("copy-calcite-bootstrap", ["copy:fontsCalciteBootstrap", "copy:jsCalciteBootstrap"]);
  //grunt.registerTask("copy-calcite-maps", ["copy:cssCalciteMaps", "copy:demosCalciteMaps", "copy:demosJSCalciteMaps", "copy:demosCSSCalciteMaps", "copy:imgCalciteMaps", "copy:jsCalciteMaps"]);

  //grunt.registerTask("copy-js", ["copy:jsCalciteBootstrap", "copy:jsCalciteMaps"]);
  //grunt.registerTask("copy-img", ["copy:imgCalciteMaps"]);
  //grunt.registerTask("copy-fonts", ["copy:fontsCalciteBootstrap"]);

  // Build sass
  grunt.registerTask("scss", ["sass"]);

  // Run a development environment
  //grunt.registerTask("dev", ["concat:doc", "sass:doc", "copy:doc", "copy:fonts", "acetate", "watch"]);

  // Test
  grunt.registerTask("test", [
    "jshint"
  ]);
};