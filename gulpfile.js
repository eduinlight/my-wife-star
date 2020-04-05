const gulp = require('gulp')
const connect = require('gulp-connect')
const path = require('path')
const fs = require('fs')
const log = require('fancy-log')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const gulpTypescript = require('gulp-typescript')

const srcPath = 'src'
const buildPath = '.buildTMP'
const publicPath = 'public'
const publicJSPath = path.join(publicPath, 'js')
const bundleName = 'my-wife-star.js'

// ts compilation
const tsProject = gulpTypescript.createProject('./tsconfig.json')
const tsSrc = path.join(srcPath, '/**/*.ts')

function ts (done) {
  gulp.src([tsSrc])
    .pipe(tsProject())
    .pipe(gulp.dest([buildPath]).on('finish', done))
}

// SERVER
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
  const watcher = gulp.watch([path.join(publicPath, '/**/*')])

  const handler = file => {
    log('Reload: ', file)
    gulp
      .src(file, {
        read: false
      })
      .pipe(connect.reload())
  }

  watcher.on('change', handler)
  watcher.on('add', handler)
  done()
}

// clear compilations
function clearBuild (done) {
  if (fs.existsSync(buildPath)) {
    gulp.src(buildPath, { read: false }).pipe(clean().on('finish', done))
  } else {
    done()
  }
}

function clearBundle (done) {
  if (fs.existsSync(publicJSPath)) {
    gulp.src(publicJSPath, { read: false }).pipe(clean().on('finish', done))
  } else {
    done()
  }
}

const clear = gulp.series(clearBundle, clearBuild)

// PROD ENVIROMENT

function build (done) {
  browserify({
    basedir: buildPath,
    debug: true,
    entries: ['index.js'],
    cache: {},
    packageCache: {}
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

function buildDev (done) {
  browserify({
    basedir: buildPath,
    debug: true,
    entries: ['index.js'],
    cache: {},
    packageCache: {}
  })
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(publicJSPath).on('finish', () => {
      connect.reload()
      done()
    }))
}

const dev = gulp.series(ts, buildDev)

function watchDev (done) {
  gulp.watch([tsSrc], gulp.series(clear, dev))
}

exports.dev = gulp.parallel(server, liveServerWatch,
  gulp.series(clear, dev, watchDev)
)
exports.build = gulp.series(clear, ts, build)
