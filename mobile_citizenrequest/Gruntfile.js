/* ---------------------------------------------------------------------
 * http://gruntjs.com/getting-started
 * http://gruntjs.com/sample-gruntfile
 *
 * https://www.npmjs.org/package/grunt
 * https://www.npmjs.org/package/grunt-contrib-clean
 * https://www.npmjs.org/package/grunt-contrib-compass
 * https://www.npmjs.org/package/grunt-contrib-concat
 * https://www.npmjs.org/package/grunt-contrib-copy
 * https://www.npmjs.org/package/grunt-contrib-cssmin
 * https://www.npmjs.org/package/grunt-contrib-htmlmin
 * https://www.npmjs.org/package/grunt-contrib-uglify
 * https://www.npmjs.org/package/grunt-contrib-watch
 * https://www.npmjs.org/package/grunt-targethtml
 * https://www.npmjs.org/package/load-grunt-tasks
 * https://www.npmjs.org/package/time-grunt
 * https://github.com/lheberlie/grunt-esrijso-modulelist
 * https://github.com/lheberlie/grunt-manifest
 *
 * ---------------------------------------------------------------------
 */

(function () {
    "use strict";
}());

module.exports = function (grunt) {

    // ---------------------------------------------------------------------
    // show elapsed time at the end
    // ---------------------------------------------------------------------
    require("time-grunt")(grunt);

    // ---------------------------------------------------------------------
    // load all grunt tasks
    // ---------------------------------------------------------------------
    require("load-grunt-tasks")(grunt);

    grunt.initConfig(
        {

            pkg: grunt.file.readJSON("package.json"),
            // ---------------------------------------------------------------------
            // banner
            // ---------------------------------------------------------------------
            banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
                "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" +
                "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" +
                " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n",
            // ---------------------------------------------------------------------
            // grunt-contrib-clean
            // ---------------------------------------------------------------------
            clean: {
                all: {
                    src: ["build", "dist"]
                },
                build: {
                    src: ["build"]
                },
                dist: {
                    src: ["dist"]
                },
                post_source_to_build: {
                    src: [
                        "build/js/application-merge-library.js",
                        "build/styles/application-merge-styles.css"
                    ]
                },
                post_source_to_dist: {
                    src: [
                        "dist/js/application-merge-library.js", "dist/styles/application-merge-styles.css",
                        "dist/js/app.js", "dist/styles/app.css",
                        "dist/index-generated.html", "dist/offline-generated.html"
                    ]
                },
                esri_jso_modules: {
                    src: [
                        "jso_modules/esrijso-modulebyfilelist.txt",
                        "jso_modules/esrijso-modulelist.txt"
                    ]
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-copy
            // ---------------------------------------------------------------------
            copy: {
                source_to_build: {
                    files: [
                        { expand: true,
                            cwd: "bower_components/jquery-mobile-bower/css",
                            src: ["images/**"], dest: "build/styles/"
                        },
                        { expand: true,
                            cwd: "src/styles",
                            src: ["images/**"], dest: "build/styles"
                        },
                        { expand: true,
                            cwd: "src/js",
                            src: ["app.js"], dest: "build/js"
                        }
                    ]
                },
                source_to_dist: {
                    files: [
                        { expand: true,
                            cwd: "src/js",
                            src: ["app.js"], dest: "dist/js"
                        },
                        { expand: true,
                            cwd: "bower_components/jquery-mobile-bower/css",
                            src: ["images/**"], dest: "dist/styles/"
                        },
                        { expand: true,
                            cwd: "src/styles/css",
                            src: ["images/**"], dest: "dist/styles"
                        }
                    ]
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-concat
            // ---------------------------------------------------------------------
            concat: {
                options: {
                    separator: "\n"
                },
                source_to_build: {
                    files: [
                        { src: [
                            "!src/**/app.js",
                            /*
                             * bower install jquery-mobile-bower
                             * https://github.com/jobrapido/jquery-mobile-bower
                             */
                            "bower_components/jquery/jquery.js",
                            "bower_components/jquery-mobile-bower/js/jquery.mobile-1.4.5.js"
                        ],
                            dest: "build/js/application-merge-library.js"
                        },
                        { src: [
                            "bower_components/jquery-mobile-bower/css/jquery.mobile-1.4.5.css",
                            "!build/**/app.css"
                        ], dest: "build/styles/application-merge-styles.css"}
                    ]
                },
                source_to_dist: {
                    files: [
                        //                    { src: ["src/**/*.js", "!src/**/app.js"], dest: "dist/js/application-merge-library.js"},
                        { src: [
                            "!src/**/app.js",
                            /*
                             * bower install jquery-mobile-bower
                             * https://github.com/jobrapido/jquery-mobile-bower
                             */
                            "bower_components/jquery/jquery.js",
                            "bower_components/jquery-mobile-bower/js/jquery.mobile-1.4.5.js"
                        ],
                            dest: "dist/js/application-merge-library.js"
                        },
                        { src: [
                            "dist/js/application-merge-library.js", "src/**/app.js"
                        ], dest: "dist/js/application-library.js"},
                        { src: [
                            "!dist/**/app.css",
                            "bower_components/jquery-mobile-bower/css/jquery.mobile-1.4.5.css"
                        ],
                            dest: "dist/styles/application-merge-styles.css"
                        },
                        { src: [
                            "dist/styles/application-merge-styles.css", "dist/**/app.css"
                        ], dest: "dist/styles/application-styles.css"}
                    ]
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-compass
            // ---------------------------------------------------------------------
            compass: {
                clean: {
                    options: {
                        clean: true
                    }
                },
                build: {
                    options: {
                        sassDir: "src/sass",
                        cssDir: "build/styles",
                        environment: "development",
                        outputStyle: "expanded",
                        config: "config-build.rb"
                    }
                },
                dist: {
                    options: {
                        sassDir: "src/sass",
                        cssDir: "dist/styles",
                        environment: "development",
                        outputStyle: "expanded",
                        config: "config-build.rb"
                    }
                }
                /* dist: {
                 options: {
                 sassDir: "src/sass",
                 cssDir: "dist/styles",
                 environment: "production",
                 outputStyle: "compressed",
                 config: "config-dist.rb"
                 }
                 } */

            },
            // ---------------------------------------------------------------------
            // grunt-contrib-cssmin
            // ---------------------------------------------------------------------
            cssmin: {
                options: {
                    banner: "<%= banner%>"
                },
                compress_source_to_dist: {
                    expand: true,
                    cwd: "dist/styles/",
                    src: ["application-styles.css", "!*.min.css"],
                    dest: "dist/styles/",
                    ext: ".min.css"
                }
            },
            // grunt-contrib-uglify
            uglify: {
                options: {
                    banner: "<%= banner %>"
                },
                compress_source_to_dist: {
                    options: {
                        compress: {
                            drop_console: true
                        },
                        mangle: false
                    },
                    src: "dist/js/application-library.js",
                    dest: "dist/js/application-library.min.js"
                },
                remove_log: {
                    options: {
                        compress: {
                            drop_console: false
                        },
                        mangle: false,
                        beautify: true
                    },
                    src: "dist/js/app.js",
                    dest: "dist/js/app-sample.js"
                }
            },
            // ---------------------------------------------------------------------
            // grunt-targethtml
            // ---------------------------------------------------------------------
            targethtml: {
                source_to_build: {
                    options: {
                        curlyTags: {
                            esrijs_version: "<%= pkg.esrijsVersion %>",
                            webserver_name: "<%= pkg.webserverName %>"
                        }
                    },
                    files: {
                        "build/index.html": "src/index.html",
                        "build/offline.html": "src/offline.html"
                    }
                },
                source_to_dist: {
                    options: {
                        curlyTags: {
                            esrijs_version: "<%= pkg.esrijsVersion %>",
                            webserver_name: "<%= pkg.webserverName %>"
                        }
                    },
                    files: {
                        "dist/index-generated.html": "src/index.html",
                        "dist/offline-generated.html": "src/offline.html"
                    }
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-htmlmin
            // ---------------------------------------------------------------------
            htmlmin: {
                compress_source_to_dist: {                                      // Target
                    options: {                                 // Target options
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: {                                   // Dictionary of files
                        "dist/index.html": "dist/index-generated.html",     // "destination": "source"
                        "dist/offline.html": "dist/offline-generated.html"     // "destination": "source"
                    }
                }
            },
            // ---------------------------------------------------------------------
            // grunt-manifest
            // ---------------------------------------------------------------------
            manifest: {
                build: {
                    options: {
                        banner: "# <%= pkg.name %> - v<%= pkg.version %> - " +
                            "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
                            "# Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>" +
                            " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> \n",
                        basePath: "./build",
                        cache: ["# Explicit files to include.\n"],
                        network: ["*"],
                        fallback: ["/ offline.html"],
                        // exclude: ["js/jquery.min.js", "libs/**.sass", "libs/**/src"],
                        /*preferOnline: true,*/
                        verbose: true,
                        networkHTTPArchive: "<%= pkg.networkArchiveDirectory %>/build.har",
                        timestamp: true
                    },
                    src: [
                        "*.html"
                        //                    ,
                        //                    "css/**/*.css",
                        //                    "css/**/*.png",
                        //                    "css/**/*.jpg",
                        //                    "css/**/*.gif",
                        //                    "css/**/*.svg",
                        //                    "images/**/*.*",
                        //                    "js/**/*.js"
                    ],
                    dest: "build/manifest.appcache"
                },
                dist: {
                    options: {
                        banner: "# <%= pkg.name %> - v<%= pkg.version %> - " +
                            "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
                            "# Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>" +
                            " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> \n",
                        basePath: "./dist",
                        cache: [
                            "# <%= pkg.name %>, version: <%= pkg.version %>",
                            "# ArcGIS API for JavaScript files"
                        ],
                        network: ["*"],
                        fallback: ["/ offline.html"],
                        //exclude: ["js/jquery.min.js", "libs/**.sass", "libs/**/src"],
                        /*preferOnline: true,*/
                        verbose: true,
                        networkHTTPArchive: "<%= pkg.networkArchiveDirectory %>/dist.har",
                        timestamp: true
                    },
                    src: [
                        "*.html",
                        //                    "css/**/*.min.css",
                        //                    "css/**/*.png",
                        //                    "css/**/*.jpg",
                        //                    "css/**/*.gif",
                        //                    "css/**/*.svg",
                        //                    "js/**/*.min.js"
                    ],
                    dest: "dist/manifest.appcache"
                }
            },
            // ---------------------------------------------------------------------
            //
            // ---------------------------------------------------------------------
            esrijso_modulelist: {
                generate: {
                    options: {
                        basePath: "src/",
                        matchPatterns: ["!*.css", "*.js", "*.html"]
                    },
                    src: [
                        "**/*.*"
                    ],
                    dest: {
                        moduleList: "jso_modules/esrijso-modulelist.txt",
                        moduleByFileList: "jso_modules/esrijso-modulebyfilelist.txt"
                    }
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-watch
            // ---------------------------------------------------------------------
            watch: {
                livereload: {
                    options: {
                        livereload: true
                    },
                    files: ["build/**/*"]
                },
                sass: {
                    files: "src/sass/**/*.scss",
                    tasks: ["compass:build"]
                }
            }
        });

    // ---------------------------------------------------------------------
    // Grunt registered tasks
    // ---------------------------------------------------------------------

    grunt.registerTask("build",
                       [
                           "compass:build",
                           "copy:source_to_build",
                           "concat:source_to_build",
                           "targethtml:source_to_build",
                           "esrijso_modulelist",
                           "manifest:build"
                       ]);

    grunt.registerTask("dist-noclean",
                       [
                           "compass:dist",
                           "copy:source_to_dist",
                           "concat:source_to_dist",
                           "targethtml:source_to_dist",
                           "uglify:compress_source_to_dist",
                           "cssmin:compress_source_to_dist",
                           "htmlmin:compress_source_to_dist",
                           "manifest:dist"
                       ]);

    grunt.registerTask("dist",
                       [
                           "compass:dist",
                           "copy:source_to_dist",
                           "concat:source_to_dist",
                           "targethtml:source_to_dist",
                           "uglify:compress_source_to_dist",
                           "cssmin:compress_source_to_dist",
                           "htmlmin:compress_source_to_dist",
                           "clean:post_source_to_dist",
                           "manifest:dist"
                       ]);

    grunt.registerTask("default", ["build", "dist-noclean"]);

};