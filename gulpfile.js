const gulp = require('gulp')
const connect = require('gulp-connect')
const path = require('path')
const fs = require('fs')
const log = require('fancy-log')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const tsify = require('tsify')
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const watchify = require('watchify')
const gulpTypescript = require('gulp-typescript')

const srcPath = 'src'
const buildPath = 'build'
const publicPath = 'public'
const publicJSPath = path.join(publicPath, 'js')
const bundleName = 'my-wife-star.js'

// PROD ENVIROMENT
function clear (done) {
  if (fs.existsSync(publicJSPath)) {
    gulp.src(publicJSPath, { read: false }).pipe(clean().on('finish', done))
  } else {
    done()
  }
}

function build (done) {
  browserify({
    basedir: srcPath,
    debug: true,
    entries: ['index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['ES2015'],
      extensions: ['.ts', '.js']
    })
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(publicJSPath).on('finish', done))
}

// DEV ENVIROMENT
function server (done) {
  connect.server(
    {
      root: publicPath,
      port: 3000,
      livereload: true
    },
    function () {
      this.server.on('close', done)
    }
  )
}

function liveServerWatch (done) {
  gulp.watch([path.join(publicPath, '/**/*')]).on('change', file => {
    log('Reload: ', file)
    gulp
      .src(file, {
        read: false
      })
      .pipe(connect.reload())
  })
  done()
}

const tsProject = gulpTypescript.createProject('./tsconfig.json')
const tsSrc = path.join(srcPath, '**/*.ts')

function tsDev (done) {
  gulp.src([tsSrc])
    .pipe(tsProject())
    .pipe(gulp.dest(['./build']).on('finish', done))
}

function buildDev (done) {
  browserify({
    basedir: './build',
    debug: true,
    entries: ['index.js'],
    cache: {},
    packageCache: {}
  })
    // .transform('babelify', {
    //   presets: ['ES2015'],
    //   extensions: ['.ts', '.js']
    // })
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(publicJSPath).on('finish', () => {
      connect.reload()
      done()
    }))
}

function watchDev (done) {
  gulp.watch([tsSrc], gulp.series(clear, buildDev))
}

exports.dev = gulp.parallel(server, liveServerWatch,
  gulp.series(clear, tsDev, buildDev, watchDev)
)
exports.build = gulp.series(clear, build)
