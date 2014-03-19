#! /usr/bin/env node

var through = require('through');
var split   = require('split');

process.stdin
  .pipe(split())
  .pipe(through(function(line){
    this.queue(line.split(']:')[1] + "\n");
  }))
  .pipe(process.stdout);
