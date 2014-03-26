#! /usr/bin/env node
//var through = require('through');
var split   = require('split');
var logfmt  = require('logfmt');
var through = require('through');

var Heroku  = require('heroku-client');
var heroku  = new Heroku({token: process.env.HEROKU_API_KEY});

console.log("listening on stdin");

process.stdin
  .pipe(split())
  .pipe(through(function(line){
    if(line === '') return;

    var data = JSON.parse(line)
    if(data.R14){
      logfmt.log({r14: 'detected'});

      for(var key in data){
        if(/^heroku\[/.test(key)){
          var proc = key.replace(/^heroku\[/,'').replace(/]:$/,'')
          var timer = logfmt.time().namespace({restart: proc});
          timer.log({r14: 'request-restart'});
          heroku.apps('vault-cashier').dynos(proc).restart(function(err){
            if(err) timer.error(err);
            else timer.log({r14: 'restarted'});
          });
        }
      }
    }
  }))
