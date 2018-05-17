var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs')
var helpers = require('./http-helpers')

exports.list = []

var head = function(res, statusCode = 200, data) {
  res.writeHead(statusCode, helpers.headers)
  res.write(data)
  res.end()
}

var post = function(req) {
  var body = ''
  req.on('data', (chunk) => body += chunk)
  req.on('end', () => {
    if (!exports.list.includes(JSON.parse(body))) exports.list.push(JSON.parse(body))
  })
}

exports.read = function(url, res) {
  var dirs = url.split('/')
  dirs.shift()
  var pathname = path.join(__dirname, ...dirs)
  fs.readFile(pathname, function(err, data) {
    if (err) console.log(err)
    res.writeHead(200)
    res.end(data)
  })
}

exports.external = {
  '/styles.css': function(res) {
    exports.read('./public/styles.css', res)
  },
  '/': function(res) {
    exports.read('./public/index.html', res)
  },
  '/favicon.ico': function(res) {
    exports.read('./public/favicon.png', res)
  },
  '/archives/urls': function(res) {
    head(res, 200, JSON.stringify(exports.list))
  }
}

var actions = {
  'GET': function(req, res) {
    exports.external[req.url](res)
  },
  'POST': function(req, res) {
    post(req)
    head(res, 201, JSON.stringify(exports.list))
  }
}

exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " at url " + req.url)
  var link = exports.external[req.url]
  if (!link) {
    head(res, 404, JSON.stringify("Sorry, we couldn't find that address."))
    return
  }
  var action = actions[req.method]
  action(req, res)
  // res.end(archive.paths.list);
};
