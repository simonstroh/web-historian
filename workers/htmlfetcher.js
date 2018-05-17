// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var handler = require('../web/request-handler')
var fs = require('fs')
var path = require('path')
var request = require('request')

var list = handler.list;
var external = handler.external;
var read = handler.read;

var bundler = function(dir) {
  var pathname = path.join(__dirname, '..', 'web', 'archives', 'sites', dir)
  return pathname
}

var write = function(url, body) {
  var dir = url.split('.')
  var file = dir[1] + '.html'
  var bundle = bundler(file)
  var wstream = fs.createWriteStream(bundle);
  wstream.on('finish', function(){
    console.log('Stream written')
  })
  wstream.write(body);
  wstream.end();
}

module.exports = function() {
  setInterval(function() {
    fs.writeFile('../web/archives/sites.txt', JSON.stringify(list), (err) => {
      if (err) throw err
    })
    list.forEach(item => {
      var split = item.split('.')
      if (!fs.existsSync('../web/archives/sites/' + split[1] + '.html')) {
        var file = fs.openSync('../web/archives/sites/' + split[1] + '.html', 'w');
        fs.closeSync(file);
      }
      var chunk = ''
      request('http://' + item, function(err, res, body) {
        if (err) console.log(err)
        chunk += body
      })
      if (!external[`/${item}`]) {
        external[`/${item}`] = function(res) {
          write(item, chunk)
          // console.log(split)
          read(`../web/archives/sites/${split[1]}.html`, res)
        }
      }
    })
  }, 5000)
}
