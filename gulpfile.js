var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')(),
    sherpa = require('style-sherpa');

var sassPaths = [
    'bower_components/normalize.scss/sass',
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src'
];

gulp.task('sass', ['generate'], function () {
    return gulp.src('scss/app.scss')
    .pipe($.sass({
        includePaths: sassPaths,
        outputStyle : 'compressed' // if css compressed **file size**
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('assets/css'));
});

// Generate a style guide from the Markdown content and HTML template in styleguide/
function styleGuide(done) {
    sherpa('styleguide/index.md', {
        output  : 'styleguide.html',
        template: 'styleguide/template.html'
    }, done);
}

function generateSass(sources) {
    return gulp.src(sources)
    .pipe($.insert.transform(function (contents, file) {
        var fullPath  = file.path.split('/'),
            filename  = fullPath.pop().replace('_', '').replace('.scss', ''),
            pathname  = fullPath.pop(),
            importStr = ["@import 'components/", pathname, "/", filename, "';"].join('');

        return importStr;
    }))
    .pipe($.concat('_components.scss'))
    .pipe(gulp.dest('scss'));
}

gulp.task('generate', function () {
    return generateSass([
        'scss/components/extends/**/*.scss',
        'scss/components/building-blocks/**/*.scss'
    ]);
});

gulp.task('styleGuide', styleGuide);

gulp.task('default', ['sass', 'styleGuide'], function () {
    gulp.watch(['scss/**/*.scss'], ['sass']);
    gulp.watch(['styleguide/**'], ['styleGuide']);
});
