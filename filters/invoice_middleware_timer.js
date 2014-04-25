#! /usr/bin/env node
//var through = require('through');
var split   = require('split');
var logfmt  = require('logfmt');
var through = require('through');

var redis   = require('redis');
if (process.env.REDIS_PROVIDER) {
  // inside if statement
  var rtg   = require("url").parse(process.env[process.env.REDIS_PROVIDER]);
  var client = require("redis").createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
   var client = redis.createClient();
}

client.on('error', function(e) { logfmt.error(e) });
console.log("listening on stdin");

var key = 'measure#vault-cashier.pricer.process';

var filter = through(function(line){
  if(line === '') return;

  var data = JSON.parse(line)
  if(data[key]){
    //remove ms
    var time = data[key].slice(0,-2)
    var filter = data.filter.split('::')[2]

    logfmt.log({middleware: filter, time: time});

    var filterKey = 'invoice-middleware:' + filter;
    client.zadd(filterKey, time, data.user);
    client.zremrangebyrank(filterKey, 0, -100);
  }
})

process.stdin.pipe(split()).pipe(filter)
