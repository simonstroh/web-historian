// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var handler = require('../web/request-handler')
var fs = require('fs')
var path = require('path')

var list = handler.list;
var read = handler.read;
var external = handler.external;

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
    })
  }, 5000)
}
