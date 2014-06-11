var restify = require('restify');
var through = require('through');
var logfmt  = require('logfmt').namespace({module: 'draino'});
var normalizer = require('logplex-normalizer')
var fs      = require('fs');

var Filter  = require('./filter');
var argv    = require('optimist').argv;

if(argv.f) {
  var filters = [new Filter(argv.f).spawn()]
}
else{
  var filters = fs.readdirSync(argv.d);
  for(var i in filters){
    var name = './filters/' + filters[i];
    filters[i] = new Filter(name).spawn();
  }
}

var server = restify.createServer({
  name: 'draino'
})

server.use(logfmt.requestLogger());

var filterLogs = function(req, res, next){
  var sendDataToFilters = through(function(line){
    var data = JSON.stringify(line) + "\n";
    data.source = req.params.source || 'default'
    for(var i in filters){
      filters[i].write(data);
    }
  })

  var pipeline = req;
  if(argv.heroku) pipeline.pipe(normalizer.stream())
  if(argv.logfmt) pipeline.pipe(logfmt.streamParser())
  pipeline.pipe(sendDataToFilters)

  res.send(201, 'OK');
  return next();
}

if(argv.s){
  server.use(function(req, res, next){
    if(req.params.source != argv.s){
      res.send(403, 'Request unauthorized')
    }else{
      next();
    }
  })
}

server.post('/logs', filterLogs)
server.post('/logs/:source', filterLogs)

var port = process.env.PORT;
server.listen(port);
var instanceData = {port: port};
logfmt.log({
  server: 'listen',
  port: port,
  heroku_mode: !!argv.heroku,
  logfmt_mode: !!argv.logfmt
});

