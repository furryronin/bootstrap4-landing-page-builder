//##################################################################
//THIS FILE DESIGNED TO BE IN ROOT OF PROJECT ABOVE SOURCE FOLDER
//##################################################################

const
    dir = {
        //Set the source and build folders
        source: './src/',
        target: './build/',
    },
    //set some paths based on the above    
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	browsersync = require("browser-sync").create(),
	concat = require('gulp-concat'),
	cssnano = require('cssnano'),
	del = require('del'),
	deporder = require('gulp-deporder'),
	directory = require('list-directories'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
	htmlmin = require('gulp-htmlmin'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
    newer = require('gulp-newer'),
	postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sourcemaps = require("gulp-sourcemaps"),
    stripdebug = require('gulp-strip-debug'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify-es').default,
    zip = require('gulp-zip')
;

// ########################
// main tasks
// ########################

//Todays date for file tagging
var today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth() + 1, //January is 0!
    yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
today = '-' + yyyy + '-' + mm + '-' + dd;

//housekeeping, cleans the build folder before the build starts
function cleanbuild() {
    return (
        del([
            dir.target + '/**',
        ]));
}
exports.cleanbuild = cleanbuild;

//housekeeping, cleans the image folder before rerunning the image compression
function cleanimagefolder() {
    return (
        del([
            dir.target + 'images/**',
        ]));
}
exports.cleanimagefolder = cleanimagefolder;

//copy changed html files from the source to the build folder
function htmlfiles() {
    return (
        gulp
            .src([
                '!'+ dir.source +'components/**', 
                dir.source + '**/*.html' 
            ],{
                nodir: true
            })
			.pipe(newer(dir.target))
			.pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest(dir.target))
            .pipe(browsersync.stream())
    );
}
exports.htmlfiles = htmlfiles;

//copy font files to public
function fontscopy() {
    return (
        gulp
            .src(dir.source + 'fonts/**/*.*')
            .pipe(newer(dir.target + 'css/fonts/'))
            .pipe(gulp.dest(dir.target + 'css/fonts/'))
            .pipe(browsersync.stream())
    );
}
exports.fontscopy = fontscopy;

//build styles from sass
function styles() {
    var cssOutput = {
        sassOpts: {
            outputStyle: 'nested',
            imagePath: dir.target + 'images/',
            precision: 3,
            errLogToConsole: true
        },
        processors: [
            require('postcss-assets')({
                loadPaths: ['images/'],
                basePath: dir.target,
                baseUrl: ''
            }),
            require('autoprefixer')(),    
            require('css-mqpacker'),
            require('cssnano')
            /*
            require('postcss-font-magician')({
              variants: {
                           'Open Sans': {
                               '300': ['woff, eot, woff2'],
                               '400 italic': ['woff2']
                           }
                       }
           })
           */
        ]
    };
    return (

        gulp
            .src([
                dir.source + 'sass/styles.scss',
            ])
            .pipe(sass(cssOutput.sassOpts))
            .pipe(sourcemaps.init())
            .pipe(postcss(cssOutput.processors))
            .pipe(sourcemaps.write())
            .on("error", sass.logError)
            .pipe(gulp.dest(dir.target + 'css/'))
            .pipe(browsersync.stream())
    );
}
exports.styles = styles;


//image compresson and move
function images() {
    return (
        gulp
            .src(dir.source + 'images/**/*')
            .pipe(newer(dir.target + 'images/'))
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 6}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ], {
                verbose: true
            }))
            .pipe(gulp.dest(dir.target + 'images/'))
            .pipe(browsersync.stream())
    );
}
exports.images = images;

//pick up scripts, build and watch tasks
function scripts() {
    return (
        gulp
            .src(dir.source + 'js/*.js')
            .pipe(deporder())
            .pipe(concat('scripts.js'))
            //.pipe(stripdebug())
            //.pipe(uglify())
            .pipe(gulp.dest(dir.target + 'js/'))
            .pipe(browsersync.stream())
    );
}
exports.scripts = scripts;

//concat the vendor script files together
function concatvendorscripts() {
    return (
        gulp
            .src(dir.source + 'js/vendors/' + '**/*.js')
            .pipe(concat('vendors.js'))
            .pipe(gulp.dest(dir.target + 'js/vendors/'))
            .pipe(browsersync.stream())
    );
}
exports.concatvendorscripts = concatvendorscripts;

//concat the vendor css files
function concatvendorcss() {
    return (
        gulp
            .src(dir.source + 'sass/vendors/' + '**/*.css')
            .pipe(concat('vendors.css'))
            .pipe(gulp.dest(dir.target + 'css/vendors/'))
            .pipe(browsersync.stream())
    );
}
exports.concatvendorcss = concatvendorcss;


// ########################
// utility functions
// ########################

//reload
function reload() {
    browsersync.reload();
}

//watcher
function watch() {

    browsersync.init({
        server: {
            baseDir: dir.target
        }
    });

    gulp.watch(dir.source + '**/*.scss', styles);
    gulp.watch(dir.source + '**/*.html', htmlfiles);
    gulp.watch(dir.source + 'images/**/*', images);
    gulp.watch(dir.source + 'js/*.js', scripts);
}
exports.watch = watch;

//image compresson
function compressimages() {
    return (
        gulp
            .src(dir.source + 'images/**/*')
            //.pipe(newer(pathto.image_tool_build))
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 6}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ], {
                verbose: true
            }))
            .pipe(gulp.dest(dir.target + 'images/'))
    );
}
exports.compressimages = compressimages;

//create zip
function createzip() {
    return (
        gulp.src(dir.target + '**')
        .pipe(zip('build'+ today +'.zip'))
        .pipe(gulp.dest('./'))
    );
}
exports.createzip = createzip;

// ########################
// task bundles
// ########################

//watchbuild
gulp.task('watchandbuild', gulp.series(watch, reload));

//builder
gulp.task('build', gulp.series(cleanbuild,htmlfiles,styles,images,scripts,concatvendorscripts,concatvendorcss,fontscopy));

//create zip
gulp.task('buildzip', gulp.series(cleanbuild,htmlfiles,styles,images,scripts,concatvendorscripts,concatvendorcss,fontscopy,createzip));