const gulp = require('gulp')
const connect = require('gulp-connect')
const path = require('path')
const log = require('fancy-log')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const tsify = require('tsify')
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
var watchify = require('watchify')

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

function watch (done) {
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
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(publicJSPath))
  done()
}

function buildDev () {
  const watchedTsBrowserify = watchify(browserify({
    basedir: srcPath,
    debug: true,
    entries: ['index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify))

  function bundle () {
    watchedTsBrowserify
      .bundle()
      .on('error', (error) => {
        if (error.stream) {
          delete error.stream
        }
        log(error)
      })
      .pipe(source(bundleName))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(publicJSPath))
  }

  bundle()
  watchedTsBrowserify.on('update', buildDev)
  // watchedTsBrowserify.on('log', log)
}

exports.dev = gulp.parallel(server, watch, buildDev)
exports.build = build
