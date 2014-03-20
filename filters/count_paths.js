#! /usr/bin/env node
//var through = require('through');
var split   = require('split');
var request = require('request');
var logfmt  = require('logfmt');
var redis   = require('redis');
var fs      = require('fs');

var h = require('../match');

if (process.env.REDIS_PROVIDER) {
  // inside if statement
  var rtg   = require("url").parse(process.env[process.env.REDIS_PROVIDER]);
  var client = require("redis").createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(":")[1]);
} else {
   var client = redis.createClient();
}

client.on('error', function(e) { logfmt.error(e) });

var urlData = fs.readFileSync("./urls.logfmt", {encoding: 'utf8'}).split("\n");
var urls = [];

urlData.forEach(function(line){
  if(!line) return;
  var data = logfmt.parse(line);
  urls.push(data);
})

console.log("listening on stdin");

var d = function(){
  var args = Array.prototype.slice.call(arguments);
  return args.join(':')
}

process.stdin.pipe(split()).on('data', function(data){
  var data = JSON.parse(data);

  if(data.dyno && data.dyno.split('.')[0] == 'web'){
    var now = new Date();
    var timeKey = [now.getUTCFullYear(),
                   now.getUTCMonth() + 1,
                   now.getUTCDate()].join('-');

    var timeHourKey = timeKey + '-' + now.getUTCHours();

    urls.forEach(function(urlData){
      var path = urlData.path
      if(h.match(path, data.path)){
        var key = d(timeKey, urlData.app, data.method)
      console.log(d(key, path))
        client.incr(d('hits', key, path))
        client.incr(d('status', key, data.status, path))

        var key = d(timeHourKey, urlData.app, data.method)
        client.incr(d('hits', key, path))
        client.incr(d('status', key, data.status, path))
      }
    })
  }
})
