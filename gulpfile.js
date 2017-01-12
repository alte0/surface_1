
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var rimraf = require('rimraf');
var pngquant = require('imagemin-pngquant');
var path = require('path');
var $ = require('gulp-load-plugins')();

// var gulpLoadPlugins = require('gulp-load-plugins');
// var plugins = gulpLoadPlugins();
// var pug = require('gulp-pug');
// var sass = require("gulp-sass");
// отдельный watch
// var watch = require('gulp-watch');
// var autoprefixer = require('gulp-autoprefixer');
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
// var plumber = require('gulp-plumber');
// var cssnano = require('gulp-cssnano');
// var imagemin = require('gulp-imagemin');
// костыль чтоб работать только с новыми картинками
// var newer = require('gulp-newer');
// var rigger = require('gulp-rigger');
// var pugInheritance = require('gulp-pug-inheritance');

var path = {
	src: {
		//исходные файлы
		pug: './src/*.pug',
		sass: './src/style/*.scss',
		styl: './src/style/*.styl',
		js: './src/js/*.js',
		image: './src/img/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	build: {
		//готовые файлы
		src: './build/',
		style: './build/css/',
		js: './build/js/',
		image: './build/img/',
		fonts: './build/fonts/'
	},
	watch: {
		//смотрим за изменениями
		pug: './src/**/*.pug',
		templates: './src/templates/**/*.pug',
		sass: './src/style/**/*.scss',
		styl: './src/style/**/*.styl',
		js: './src/js/**/*.js',
		image: './src/img/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	clean: './build'

};

//папка для live server
var server = {
	server: {
		baseDir: './build',
		directory: true
	}
};

// gulp.task('jade-inheritance', function() {
//   gulp.src('/src/*.pug')
//     .pipe(pugInheritance({basedir: '/templates/'}))
//     .pipe(pug());
// });

// удаление папки build. переменная нужна
gulp.task('clean', function(cb){
	rimraf(path.clean, cb)
})

gulp.task("html", function() {
	gulp.src(path.src.pug)
	.pipe($.plumber())
	.pipe($.pug({
		pretty: true
	}))
	.pipe(gulp.dest(path.build.src))
	.on('end', browserSync.reload);
});

//browserSync
gulp.task("webserver", function() {
	browserSync(server);
});

//препроцессор sass build
gulp.task('sass:build', function () {
  return gulp.src( path.src.sass )
  	.pipe($.plumber())
		//чтоб не выкинуло из консли.
    .pipe($.sass().on('error', $.sass.logError))
    //вкл сжатие
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe($.cssnano({
    	//не учитываем zindex
    	zindex: false
    }))
    .pipe(gulp.dest( path.build.style ))
});
//препроцессор sass dev
gulp.task('sass:dev', function () {
  return gulp.src( path.src.sass )
  	.pipe($.plumber())
  	.pipe($.sourcemaps.init())
	//чтоб не выкинуло из консли.
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest( path.build.style ))
    .on('end', browserSync.reload);
});

//препроцессор styl dev
gulp.task('styl:dev', function() {
	gulp.src(path.src.styl)
		.pipe($.plumber())
  	.pipe($.sourcemaps.init())
		.pipe($.stylus({
			'include css': true
		}))
		.on('error', function (error) {
			console.error('' + error);
		})
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(path.build.style))
		.on('end', browserSync.reload);
})
//препроцессор styl build
gulp.task('styl:build', function() {
	gulp.src(path.src.styl)
		.pipe($.plumber())
		.pipe($.stylus({
			'include css': true
		}))
		.on('error', function (error) {
			console.error('' + error);
		})
		.pipe($.stylus({
			 compress: true
		}))
		.pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe($.cssnano({
    	//не учитываем zindex
    	zindex: false
    }))
		.pipe(gulp.dest( path.build.style ))
		.on('end', browserSync.reload);
})



// копируем Fonts
gulp.task('copyFont', function(){
	gulp.src( path.src.fonts )
	.pipe($.plumber())
	.pipe( gulp.dest( path.build.fonts ) )
	.on('end', browserSync.reload);
});
// копируем js файлы dev
gulp.task('copyJs:dev', function(){
	gulp.src( path.src.js )
	.pipe($.plumber())
	.pipe($.rigger())
	.pipe( gulp.dest( path.build.js ) )
	.on('end', browserSync.reload);
});
// копируем js файлы
gulp.task('copyJs:bulid', function(){
	gulp.src( path.src.js )
	.pipe($.plumber())
	.pipe($.rigger())
	.pipe($.uglify())
	.pipe( gulp.dest( path.build.js ) )
});

//Наблюдаем
gulp.task("watch", function() {
	//встроенный watch
	gulp.watch(path.watch.pug, ['html']);
	gulp.watch(path.watch.templates, ['html']);
	gulp.watch(path.watch.sass, ['sass:dev']);
	gulp.watch(path.watch.styl, ['styl:dev']);
	gulp.watch(path.watch.js, ['copyJs:dev']);
	gulp.watch(path.watch.font, ['copyFont']);
	gulp.watch(path.watch.image, ['image']);
	//отдельный gulp-watch
	// watch([path.watch.pug], function(event, cb){
	// 	gulp.start('html')
	// })
});

gulp.task('image', function () {
	gulp.src( path.src.image )
	.pipe($.newer( path.src.image ))
	.pipe($.ignore('**/temp/*.*'))
	.pipe($.imagemin({
	    progressive: true,
	    svgoPlugins: [{removeViewBox: false}],
	    use: [pngquant()],
	    interlaced: true,
	    options: {
	        cache: true
	    }
	}))
	.pipe(gulp.dest(path.build.image));
	// чтоб не после каждого изображения
	// .pipe(reload({stream: true}));
});

// development scss
gulp.task('dev', function(){
	gulp.start('html', 'sass:dev', 'styl:dev', 'copyJs:dev', 'copyFont', 'image')
})

//build
gulp.task('build-project', function(){
	gulp.start('html', 'sass:build', 'styl:build', 'copyJs:bulid', 'copyFont', 'image')
})

// на запуск
// development
gulp.task('default', ['dev', 'watch', 'webserver']);
// build
gulp.task('build', ['build-project', 'watch', 'webserver']);
