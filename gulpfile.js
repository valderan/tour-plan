// импорты
const fs = require('fs');
const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  // ПЛАГИН: Просмотр в браузере
  browsersync = require('browser-sync').create(),
  // ПЛАГИН: Шаблонизация HTML - сборка из partials @@include('<_filename.html>')
  fileinclude = require('gulp-file-include'),
  // ПЛАГИН: Удаление файлов и директорий
  del = require('del'),
  // ПЛАГИН: Препроцессор SASS
  sass = require('gulp-sass'),
  // ПЛАГИН: Добавление вендорных префиксов для работы CSS в более ранних версиях
  autoprefixer = require('gulp-autoprefixer'),
  // ПЛАГИН: Группировка всех медиазапросов в конце css-файла 
  group_media = require('gulp-group-css-media-queries'),
  // ПЛАГИН: Минимизация файла css 
  cleanCSS = require('gulp-clean-css'),
  // ПЛАГИН: Переименовывание файла или директории 
  rename = require('gulp-rename'),
  // ПЛАГИН: Создание source-map для min.файлов
  sourcemaps = require('gulp-sourcemaps'),
  // ПЛАГИН: Минификация изображений 
  imagemin = require('gulp-imagemin'),
  // ПЛАГИН: Конвертация изображений в WebP
  webp = require('gulp-webp'),
  // ПЛАГИН: Замена в html-файлах изображений на webp при наличии
  webpHTML = require('gulp-webp-html'),
  // ПЛАГИН: создание SVG-спрайтов
  svgSprite = require('gulp-svg-sprite'),
  // ПЛАГИН: конвертеры шрифтов в woff и woff2
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter');

// JavaScript -------
// https://habr.com/ru/post/484714/
// подключаем необходимые модули:
// npm i gulp-babel @babel/core @babel/preset-env --save-dev
// установим зависимости для eslint
// npm install eslint eslint-config-htmlacademy eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node --save-dev
// npm install gulp-eslint -D
// npm install gulp-terser --save-dev
// npm i gulp-sourcemaps -D

// ПЛАГИН: Сборщик файлов + объединение в 1
const concat = require('gulp-concat');
// ПЛАГИН:  Линтер для JavaScript
const eslint = require('gulp-eslint');
// ПЛАГИН: Babel - оптимизация кода для более старых версий браузера
const babel = require('gulp-babel');
// ПЛАГИН: минификация и оптимизация javascript.
const terser = require('gulp-terser');

// -- /JavaScript -- 

// настройка базовых путей проекта
let project_folder = 'dist', 
  source_folder = '#src';

// настройка рабочих путей проекта
let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/src/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
    public: project_folder + '/public/'
  },
  src: {
    html: [ 
      source_folder + '/*.html',
      '!' + source_folder + '/_*.html'    // исключаем файлы шаблонов _<filename>.html (ПЛАГИН: gulp-file-include)
    ],
    css: source_folder + '/sass/style.sass',
    js: source_folder + '/src/**/*.js', 
    img: source_folder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/**/*.*',
    public: source_folder + '/public/**/*.*',
    fontsFolder: source_folder + '/fonts/', 
    autoFontsFileName: source_folder + '/sass/' + 'fonts.scss'
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/sass/**/*.{sass,scss}',
    js: source_folder + '/src/**/*.js', 
    img: source_folder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
    public: source_folder + '/public/**/*.*'
   },
  clean: './' + project_folder + '/',
  svgSpriteSourceFolder: source_folder + '/iconsprite/*.svg' ,
  svgDestinationFolder: '../icons/',
  indexFileNames: {
    js: 'main.js', 
    iconSprite: 'icon.svg'
  },
  autoFontsInclude: false,  // true - автоматическое добавление шрифтов в css -> смотри fontsStyle()
}

// Конфигурация для eslint
const eslintConfig = {
  "extends": [
    "standart",
    "webstart/es6"
  ],
  "rules": {
    "indent": [
      "error",
      4
    ],
    "semi": [
      "error",
      "never"
    ], 
    "quotes": [
      "error",
      "backtick"
    ]
  }
}

// НАСТРОЙКА GULP --
// настройка отображения для браузера
function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: true
  })
} 

// Таски для Gulp

// Создание svg спрайта. 
// Сборка всех svg из директории path.svgSpriteSourceFolder 
// Спрайт складывается в  path.svgDestinationFolder + path.indexFileNames.iconSprite (dist/img/icons)
gulp.task('svgSprite', () => {
  return gulp.src(path.svgSpriteSourceFolder)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: path.svgDestinationFolder + path.indexFileNames.iconSprite,
          example: false  // true - создание примера подключения в <destination folder>/stack/sprite.stack.html
        }
      }
    }))
    .pipe(dest(path.build.img))
}) 

// Конвертация .otf шрифтов в ttf и выгрузка в проект #src/fonts
gulp.task('otf2ttf', () => {
  return gulp.src([path.src.fontsFolder + '*.otf'])
    .pipe(fonter({
        format:['ttf']
      })
    )
    .pipe(dest(path.src.fontsFolder))
})

// ОБРАБОТЧИКИ --

// Копирование файлов из директории public
function public() {
  return src(path.src.public)
    .pipe(dest(path.build.public))      // копирование файлов в каталог сборки
    .pipe(browsersync.stream())       // вывод в браузер
}

// обработчик HTML
function html() {
  return src(path.src.html)
  .pipe(fileinclude())              // подключение шаблонизатора
  .pipe(webpHTML())                 // замена обычных изображений на webp при наличии !! Можно отключить
  .pipe(dest(path.build.html))      // копирование файлов в каталог сборки
  .pipe(browsersync.stream())       // вывод в браузер
}

// обработчик CSS 
function css() {
  return src(path.src.css)
  .pipe(                            // подкючаем SASS препроцессор 
    sass({
      outputStyle: 'expanded'
    })
  )
  .pipe(group_media())              // подключаем группировку @media 
  .pipe(                            // подключаем автопрефиксер
    autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    })
  ) 
  .pipe(dest(path.build.css))       // копирование файлов в каталог сборки
  .pipe(cleanCSS())                 // подключаем минимизацию CSS 
  .pipe(
    rename({
      extname: '.min.css'           // меняем имя файлa 
    })
  )      
  .pipe(dest(path.build.css))       // копирование файлов в каталог сборки
  .pipe(browsersync.stream())       // вывод в браузер
}

// Обработчик JavaScript
function js () {
  return src(path.src.js)
    .pipe(concat(path.indexFileNames.js))          // объеденим все файлы в один       
    // .pipe(eslint(eslintConfig))                 // подключаем линтер 
    // .pipe(eslint.format())                      // при желании - расскоментировать
    .pipe(sourcemaps.init())                       // подключаем sourcemap
    .pipe(babel({                                  // подключаем babel
        presets: ['@babel/env']
      }))
    .pipe(dest(path.build.js))                      // копирование файлов в каталог сборки !!! Для проверки  
    .pipe(terser())                     
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix:'.min' }))
    .pipe(dest(path.build.js))                      // копирование файлов в каталог сборки
    .pipe(browsersync.stream())                     // вывод в браузер      
}

// Работа с изображениями
function images() {
  return src(path.src.img)  
    .pipe(  
      webp({                         // подключаем конвертер изображений в webp
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))         // переключаемся обратно в папку изображениями сборки 
    .pipe(imagemin({                 // подключаем оптимизацию изображений
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 - 7
      })
    )
    .pipe(dest(path.build.img))      // копирование файлов в каталог сборки
    .pipe(browsersync.stream())      // вывод в браузер
}

// Работа со конвертацией шрифтов
function fonts() {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))

  return src(path.src.fonts)
  .pipe(ttf2woff2())
  .pipe(dest(path.build.fonts))       // вывод в браузер
}

// Автоматическое подключение шрифтов из папки #src/fonts по имени файла
// необходимо наличие файла fonts.scss в папке шрифтов и его импорт в главный файл 
// так же миксин для подключения (формат SASS) в главном файле
// 
// @mixin font($font_name, $file_name, $weight, $style)
//   @font-face
//     font-family: $font_name
//     font-display: swap
//     src: url('../fonts/#{$file_name}.woff') format('woff'), url('../fonts/#{$file_name}.woff2') format('woff2')
//     font-weight: #{$weight}
//     font-style: #{style}
// 
// 
function fontsStyle(params) {
  if(path.autoFontsInclude) {
    const workFile = path.src.autoFontsFileName;
    let file_content = fs.readFileSync(workFile);
    if (file_content == '') {
        fs.writeFile(workFile, '', cb);
        return fs.readdir(path.build.fonts, (err, items) => {
          if (!!items) { 
            let c_fontname;
            for (let i = 0; i < items.length; i++) {
              let fontname = items[i].split('.');
              fontname = fontname[0];
              if (c_fontname != fontname) {
                console.log(`Add fontname: ${fontname} into ${workFile}`);
                fs.appendFile(workFile, `@include font("${fontname}", "${fontname}", "400", "normal");\n`, cb);
            }
            c_fontname = fontname
            }     
          } else {
            console.log('Dir empty - ', path.build.fonts);
          }
        })
    }
  }
}
function cb() {}
// -------------------------------------------------

// Обновление страницы браузера при изменении файлов
function watchFiles(params) {
  gulp.watch([path.watch.html], html)        // изменение html файлов
  gulp.watch([path.watch.css], css)          // изменение css файлов
  gulp.watch([path.watch.public], public)    // изменение public файлов
  gulp.watch([path.watch.js], js)            // изменение js файлов
  gulp.watch([path.watch.img], images)       // изменение файлов изображений
}

// Чистка BUILD-каталога перед сборкой (/dist)
function clean(params) {
  return del(path.clean);
}

// СБОРКА ---
// подключаем в сборку: 
//  1. clean - Чистка каталога  
//  2. sass - препроцессор SASS
//  3. html - HTML обработчитк
//  4. js - JavaScript обработчик
//  5. images - работа с изображениями
//  6. fonts - работа со шрифтами
//  7. public - добавление файлов из директории public в сборку
// * gulp.parallel - параллельное выполенние процессов
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, public), fontsStyle);

// мониторинг 
const watch = gulp.parallel(build, watchFiles, browserSync);

// экспорт 
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.public = public;
exports.css = css;
exports.html = html;
exports.build = build; 
exports.watch = watch;
exports.default = watch;