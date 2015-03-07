/* --------------------------------------------------------
 * http://gruntjs.com/getting-started
 * http://gruntjs.com/sample-gruntfile
 *
 * https://www.npmjs.org/package/time-grunt
 * https://www.npmjs.org/package/load-grunt-tasks
 * https://www.npmjs.org/package/grunt-contrib-compass
 *
 * --------------------------------------------------------
 */

(function () {
    "use strict";
}());

module.exports = function (grunt) {
    // show elapsed time at the end
    require("time-grunt")(grunt);
    // load all grunt tasks
    require("load-grunt-tasks")(grunt);

    grunt.initConfig(
        {
            pkg: grunt.file.readJSON("package.json"),
            // ---------------------------------------------------------------------
            // grunt-contrib-clean
            // ---------------------------------------------------------------------
            clean: {
                build: {
                    src: ["build"]
                },
                dist: {
                    src: ["dist"]
                }
            },
            // ---------------------------------------------------------------------
            // grunt-contrib-copy
            // ---------------------------------------------------------------------
            copy: {
                spritesheets: {
                    files: [
                        { expand: true,
                            src: ["images/*.png"], dest: "build/stylesheets/"
                        },
                        { expand: true,
                            src: ["images/*.png"], dest: "dist/stylesheets/"
                        }
                    ]
                },
                html_file: {
                    files: [
                        {expand: true,
                            cwd: "src",
                            src: ["*.html"], dest: "build/"
                        },
                        {expand: true,
                            cwd: "src",
                            src: ["*.html"], dest: "dist/"
                        }
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
                        cssDir: "build/stylesheets",
                        environment: "development",
                        outputStyle: "expanded",
                        config: "config.rb"
                    }
                },
                dist: {
                    options: {
                        sassDir: "src/sass",
                        cssDir: "dist/stylesheets",
                        environment: "production",
                        outputStyle: "compressed",
                        config: "config.rb"
                    }
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
                        "build/index.html": "src/index.html"
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
                        "dist/index.html": "src/index.html"
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

    grunt.registerTask("default", ["clean", "compass", "copy", "targethtml"]);
};