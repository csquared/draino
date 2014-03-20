var restify = require('restify');
var through = require('through');
var logfmt  = require('logfmt').namespace({module: 'draino'});
var fs      = require('fs');
var Filter  = require('./filter');
var argv    = require('optimist').argv;

if(argv.f) {
  var filters = [new Filter(argv.f).spawn()]
}
else{
  var filters = fs.readdirSync('./filters');
  for(var i in filters){
    var name = './filters/' + filters[i];
    filters[i] = new Filter(name).spawn();
  }
}

var server = restify.createServer({
  name: 'draino'
})

server.use(logfmt.requestLogger());

server.post('/logs', function(req, res, next){
  req.pipe(logfmt.streamParser()).pipe(through(function(line){
    var data = JSON.stringify(line) + "\n";
    for(var i in filters){
      filters[i].write(data);
    }
  }))
  res.send(201, 'OK');
  return next();
})

var port = process.env.PORT;
server.listen(port);
logfmt.log({server: 'listen', port: port});
