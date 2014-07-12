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

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean:
        {
          build: {
              src: ["build"]
          },
          dist: {
              src: ["dist"]
          }
        },
        compass: {
            clean: {
                options: {
                    clean: true
                }
            },
            build: {
                options: {
                    sassDir: "sass",
                    cssDir: "build/styles",
                    environment: "development",
                    outputStyle: "expanded",
                    config: "config-build.rb"
                }
            },
            dist: {
                options: {
                    sassDir: "sass",
                    cssDir: "dist/styles",
                    environment: "production",
                    outputStyle: "compressed",
                    config: "config-dist.rb"
                }
            }

        },
        watch: {
            css: {
                files: "**/*.scss",
                tasks: ["compass"]
            }
        }
    });

    grunt.registerTask("default", ["clean", "compass"]);
};