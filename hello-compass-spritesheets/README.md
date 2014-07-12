# Configuration options during setup

* ```--sass-dir cool``` Use the ```cool``` directory for Sass
* ```--css-dir style``` Use the ```style``` directory for CSS


## Sass config file options

```
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "stylesheets"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "javascripts"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
```

# Compass help

```
compass help
```

# Comments

```
// -------------
// Won't appear in the generated CSS
// -------------

/* *************
 * Will appear in uncompressed CSS
 * *************
 */
 
 /*! *************
 * Will appear in uncompressed CSS
 * *************
 */
 
 
```