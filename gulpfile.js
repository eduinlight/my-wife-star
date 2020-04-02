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

const srcPath = 'src'
const publicPath = 'public'
const publicJSPath = path.join(publicPath, 'js')
const bundleName = 'my-wife-star.js'

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
      presets: ['es2015'],
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

function buildDev () {
  watchify(browserify({
    basedir: srcPath,
    debug: true,
    entries: ['index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify))
    .on('update', () => {
      log.info('Rebuild: ')
      buildDev()
    })
    .on('log', log)
    .bundle()
    .on('error', (error) => {
      if (error.stream) {
        delete error.stream
      }
      log(error)
    })
    .pipe(source(bundleName))
    .pipe(gulp.dest(publicJSPath))
}

exports.dev = gulp.parallel(server, liveServerWatch, buildDev)
exports.build = gulp.series(clear, build)
