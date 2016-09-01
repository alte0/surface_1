module.exports = function(grunt) {
  //загрузка всех tasks
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    less: {
      dev: {
        files: {
          // компилируем less - куда:откуда
          "build/css/style.css": "less/style.less"
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer") ({
            browsesrs:
            [
            "last 1 versions",
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Opera versions",
            "last 2 Edge versions"
            ]
          }),
          require("css-mqpacker") ({
            sort: true
          })
        ]
      },
      //какой файл
      style: {src: "build/css/*.css"}
    },

    //минифицируем css
    csso: {
      stylecompress: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css" : ["build/css/style.css"]
        }
      }
    },

    //минифицируем изображения
    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png, jpg, gif}"]
        }]
      }
    },

    //собираем svg срайт
    svgstore: {
      options: {
        svg: {
          //прячем инлайн svg из html
          style: "display: none"
        }
      },
      //название конфига
      symbols: {
        files: {
          "build/img/symbols.svg" : ["img/icons/*.svg"]
        },
        options: {
        prefix : 'icon-', // This will prefix each ID
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        }
      }
      }
    },

    //минифицируем svg
    svgmin: {
      symbols: {
        files: [{
          expand: true,
          src: ["build/img/icons/*.svg"]
        }]
      }
    },

    // следим за изменениями
    watch: {
      style: {
        // изменились less файлы запускаем tasks
        files: ["less/**/*.less"],
        tasks: ["less", "postcss", "csso"]
      },
      html: {
        files: ["*.html"],
        tasks: ["copy:html"]
      },
      img: {
        files: ["img/**/*.*"],
        tasks: ["build"]
      }
    },

    // копирование
    copy: {
      build: {
        files: [{
          expand: true,
          src: [
          "fonts/**/*.{woff,woff2}",
          "img/**",
          "js/**",
          "*.html"
          ],
          //куда копировать
          dest: "build"
        }]
      },
      html: {
        files: [{
          expand: true,
          src: ["*.html"],
          dest: "build"
        }]
      }
    },

    //удаляем папку перед копированием
    clean: {
      build: ["build"]
    },

    // no job !?!?!?!?!?!
    browserSync: {
      bsFiles: {
        src : ["build/*.html", "build/css/*.css"]
      },
      options: {
        server: {
          baseDir: "build/."
        }
      }
    }


  });

    grunt.registerTask("serve", ["watch"]);
    grunt.registerTask("symbols", ["svgmin", "svgstore"]);
    grunt.registerTask("build", [
      "clean",
      "copy",
      "less",
      "postcss",
      "csso",
      "symbols",
      "imagemin"
      ]);

};
