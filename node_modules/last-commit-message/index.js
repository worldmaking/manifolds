var spawn = require('child_process').spawn
var concat = require('simple-concat')

module.exports = function lastCommitMessage (opts) {
  if (!opts) opts = {}

  return new Promise(function (resolve, reject) {
    var git = spawn('git', ['log', '-1', '--pretty=%B'], {
      cwd: opts.cwd || process.cwd()
    })

    git.once('error', reject)

    var message
    var errorMessage
    concat(git.stdout, function (err, result) {
      if (err) return reject(err)
      // Chop off \n CLI artifact
      message = result.toString('utf8').replace(/\n$/, '')
    })
    concat(git.stderr, function (err, result) {
      if (err) return
      errorMessage = result.toString('utf8').replace(/\n$/, '')
    })

    git.once('exit', function (code) {
      if (code === 0) {
        resolve(message)
      } else {
        var err = new Error('Empty repository')
        err.stderr = errorMessage
        err.exitCode = code
        reject(err)
      }
    })
  })
}
