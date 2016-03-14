var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var pngquant = require('imagemin-pngquant');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix = new LessPluginAutoPrefix({ browsers: ["> 5%"] });
var dataJson = require('./_src/jade/data.json');

var src = {
    css: '_src/css/style.less',
    js: ['_src/js/modules/*'],
    img: 'src/img/**/*'
};

//Compile Less
gulp.task('less', function () {
    return gulp.src(src.css)
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest('./build/css'));
});

// Clean destination folders
gulp.task('clean', function() {
    return gulp.src(['css', 'js', 'img'], {read: false})
        .pipe(clean());
});

//Concat js
gulp.task('js', function() {
    return gulp.src(src.js)
        .pipe(newer('js/main.js'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'))
});

//Compress images
gulp.task('imagemin', function () {
    return gulp.src('./_src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

//Minify & uglify Js
gulp.task('minJs', function() {
    return gulp.src('build/js/main.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

//Jade task
gulp.task('jade', function() {
    gulp.src('_src/jade/pages/*.jade')
        .pipe(jade({
            locals: dataJson,
            pretty: true
        }))
        .pipe(gulp.dest('./build/tpl'));
    gulp.src('_src/jade/blocks/*.jade')
        .pipe(jade({
            locals: dataJson,
            pretty: true
        }))
        .pipe(gulp.dest('./build/tpl/blocks'));
});

// Действия по умолчанию
gulp.task('default', function(){
    gulp.run('jade', 'js', 'minJs', 'less', 'imagemin');

    // Отслеживаем изменения в файлах
    gulp.watch("./_src/js/**/*", ['js']);
    gulp.watch("./_src/css/**/*", ['less']);
    gulp.watch("./_src/jade/**/*", ['jade']);
    gulp.watch("./_src/img/**/*", ['imagemin']);
});