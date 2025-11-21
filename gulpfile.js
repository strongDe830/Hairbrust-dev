const { series, watch } = require('gulp');

const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  webpack = require('webpack-stream'),
  terser = require('gulp-terser'),
  rename = require('gulp-rename'),
  purgecss = require('gulp-purgecss'),
  named = require('vinyl-named'),
  mode = require('gulp-mode')(),
  postcss = require('gulp-postcss');

const input_files = {
  css_theme: './_build/styles/theme.scss',
  css_blocks: './_build/styles/blocks/**/*.scss',
  css_sections: './_build/styles/sections/**/*.scss',
  css_snippets: './_build/styles/snippets/**/*.scss',
  css_apps: './_build/styles/apps/**/*.scss',
  js_theme: './_build/scripts/theme.js',
  js_spark: './_build/scripts/spark/**/*.js',
  js_blocks: './_build/scripts/blocks/**/*.js',
  js_sections: './_build/scripts/sections/**/*.js',
  js_snippets: './_build/scripts/snippets/**/*.js',
  js_components: './_build/scripts/components/**/*.js',
};

const input_file_patterns = {
  css: './_build/styles/**/*.scss',
  js: './_build/scripts/**/*.js',
  svg: './_build/svg/*.svg',
};

const output_folder = {
  css: 'assets',
  js: 'assets',
  svg: 'snippets',
};

const purge_source_files = {
  css: `${output_folder.css}/theme.css`,
};

// CSS

function css_files(css_path, file_prefix) {
  return gulp
    .src(css_path)
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(rename({ prefix: file_prefix }))
    .pipe(postcss())
    .pipe(gulp.dest(output_folder.css));
}

// Theme CSS
async function css_theme(run_css) {
  css_files((css_path = input_files.css_theme), (file_prefix = ''));
  run_css();
}

// Blocks CSS
async function css_blocks(run_css) {
  css_files((css_path = input_files.css_blocks), (file_prefix = 'block-'));
  run_css();
}

// Section CSS
async function css_sections(run_css) {
  css_files((css_path = input_files.css_sections), (file_prefix = 'section-'));
  run_css();
}

// Snippet CSS
async function css_snippets(run_css) {
  css_files((css_path = input_files.css_snippets), (file_prefix = 'snippet-'));
  run_css();
}

// Packages CSS
async function css_apps(run_css) {
  css_files((css_path = input_files.css_apps), (file_prefix = 'app-'));
  run_css();
}

// Javascript
function js_files(js_path, file_prefix) {
  return gulp
    .src(js_path)
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(named())
    .pipe(
      webpack({
        devtool: false,
        mode: mode.development() ? 'development' : 'production',
        output: {
          filename: file_prefix + '[name].js',
        },
      })
    )
    .pipe(
      mode.production(
        terser({
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
        })
      )
    )
    .pipe(gulp.dest(output_folder.js));
}

// Theme JS
async function js_theme(run_js) {
  js_files((js_path = input_files.js_theme), (file_prefix = ''));
  run_js();
}

// Spark JS
async function js_spark(run_js) {
  js_files((js_path = input_files.js_spark), (file_prefix = 'spark-'));
  run_js();
}

// Section JS
async function js_sections(run_js) {
  js_files((js_path = input_files.js_sections), (file_prefix = 'section-'));
  run_js();
}

// Blocks JS
async function js_blocks(run_js) {
  js_files((js_path = input_files.js_blocks), (file_prefix = 'block-'));
  run_js();
}

// Snippet JS
async function js_snippets(run_js) {
  js_files((js_path = input_files.js_snippets), (file_prefix = 'snippet-'));
  run_js();
}

// Component Javascript
function js_components() {
  return gulp
    .src(input_files.js_components)
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(named())
    .pipe(
      webpack({
        mode: mode.development() ? 'development' : 'production',
        output: {
          filename: '[name].js'.replace('component', ''),
        },
      })
    )
    .pipe(
      mode.production(
        terser({
          compress: {
            drop_console: false,
          },
          format: {
            comments: false,
          },
        })
      )
    )
    .pipe(gulp.dest('assets'));
}

// Theme Purge CSS
function css_purge() {
  return gulp
    .src(purge_source_files.css)
    .pipe(
      mode.production(
        purgecss({
          content: ['./**/*.liquid', './_build/scripts/**/*.js'],
          safelist: {
            deep: [/is-active/, /is-visible/, /is-disabled/, /swiper/, /shopify-challenge__container/],
          },
        })
      )
    )
    .pipe(gulp.dest(output_folder.css));
}

// Run the following as individual gulp tasks - e.g. gulp css_global
exports.css_theme = css_theme;
exports.css_blocks = css_blocks;
exports.css_sections = css_sections;
exports.css_snippets = css_snippets;
exports.css_apps = css_apps;
exports.js_theme = js_theme;
exports.js_spark = js_spark;
exports.js_sections = js_sections;
exports.js_blocks = js_blocks;
exports.js_snippets = js_snippets;
exports.js_components = js_components;

// Default gulp task - just run gulp in the terminal
exports.default = series(
  css_theme,
  css_blocks,
  css_sections,
  css_snippets,
  css_apps,
  js_components,
  js_theme,
  js_spark,
  js_sections,
  js_blocks,
  js_snippets
);

// Watch tasks
exports.watch = function () {
  watch(input_file_patterns.css, { ignoreInitial: false }, series(css_theme, css_blocks, css_sections, css_snippets, css_apps));
  watch(
    input_file_patterns.js,
    { ignoreInitial: false },
    series(js_theme, js_sections, js_spark, js_snippets, js_components, js_blocks)
  );
};