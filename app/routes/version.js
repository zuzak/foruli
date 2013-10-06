var exec = require('child_process').exec
var rf = require('fs').readFileSync

module.exports = function (app) {

  app.get('/version', function (req, res) {
    exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
      var commit = stdout
      console.log("foo")
      exec('git shortlog -s < /dev/tty', function(err, stdout, stderr) {
        var contribs = []
        stdout = stdout.split('\n')
        stdout.forEach(function (contrib) {
          contrib = contrib.trim()
          contrib = contrib.split('\t')
          contribs.push(contrib)
        })
        contribs.pop()
        var license = ""
        try {
          license = rf('../../LICENSE', {encoding: 'utf-8'})
        } catch (e) {
          //
        }
        res.render('version', {
          user: req.user,
          pretty: true,
          title: 'foruli version · version',
          commit: commit,
          contribs: contribs,
        })
      })
    })
  })
}
