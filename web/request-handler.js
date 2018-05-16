var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs')
var helpers = require('./http-helpers')

var list = []

var post = function(req) {
  var body = ''
  req.on('data', (chunk) => body += chunk)
  req.on('end', () => list.push(JSON.parse(body)))
}

var external = {
  '/styles.css': function(res) {
    fs.readFile('./public/styles.css', function(err, data) {
      if (err) console.log(err)
      res.end(data)
    })
  },
  '/': function(res) {
    fs.readFile('./public/index.html', function(err, data) {
      if (err) console.log(err);
      res.end(data)
    })
  }
}

var actions = {
  'GET': function(req, res) {
    external[req.url](res)
  },
  'POST': function(req, res) {
    post(req)
  }
}

exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " at url " + req.url)
  var action = actions[req.method]
  action(req, res)
  // res.end(archive.paths.list);
};
