#! /usr/bin/env node
//var through = require('through');
var split   = require('split');
var request = require('request');
var logfmt  = require('logfmt');

var host = 'http://foo:barbar@localhost:5000';

console.log("listening on stdin");

/*
process.stdin.pipe(split()).on('data', function(data){
  var data = JSON.parse(data);
  if(data.dyno && data.dyno.split('.')[0] == 'web'){
    var req_method = request[data.method.toLowerCase()]
    var url = host + data.path;
    var requests = requests + 1;
    logfmt.log({method: data.method, url: url});
    req_method(host + data.path);
  }
})
*/
