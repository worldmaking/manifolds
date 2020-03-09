var test = require('tape')
var spawn = require('child_process').spawnSync
var tempdir = require('unique-temp-dir')
var rimraf = require('rimraf')
var lastCommit = require('.')

test('error in empty repository', function (t) {
  t.plan(2)

  var cwd = tempdir({ create: true })
  t.once('end', function () {
    rimraf.sync(cwd)
  })

  spawn('git', ['init'], { cwd: cwd })

  lastCommit({ cwd: cwd })
    .then(function () {
      t.fail('should not succeed in empty repo')
    }).catch(function (err) {
      t.strictEqual(err.message, 'Empty repository')
      t.strictEqual(err.exitCode, 128)
    })
})

test('gets last commit message (single line)', function (t) {
  t.plan(1)

  var cwd = tempdir({ create: true })
  t.once('end', function () {
    rimraf.sync(cwd)
  })

  spawn('git', ['init'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'Not this one'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'Not this one either'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'That\'s A Message'], { cwd: cwd })

  lastCommit({ cwd: cwd })
    .then(function (message) {
      t.strictEqual(message, 'That\'s A Message\n')
    })
    .catch(t.end)
})

test('gets last commit message (multi-line)', function (t) {
  t.plan(1)

  var cwd = tempdir({ create: true })
  t.once('end', function () {
    rimraf.sync(cwd)
  })

  spawn('git', ['init'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'Not this one'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'Not this one either'], { cwd: cwd })
  spawn('git', ['commit', '--no-gpg-sign', '--allow-empty', '-m', 'That\'s A Message\n\nwith some content'], { cwd: cwd })

  lastCommit({ cwd: cwd })
    .then(function (message) {
      // Message header + contents
      t.strictEqual(message, 'That\'s A Message\n\nwith some content\n')
    })
    .catch(t.end)
})
