var logfmt  = require('logfmt').namespace({module: 'filter'});
var spawn   = require('child_process').spawn;

function Filter(name, stdout){
  logfmt.log({at: 'new-filter', name: name});
  this.name = name;
  this.stdout = stdout || process.stdout;

  this.spawn = function(){
    logfmt.log({at: 'spawn', name: this.name});
    this.child = spawn(this.name);
    this.child.stderr.pipe(process.stderr);
    this.child.stdout.pipe(this.stdout);
    var self = this;
    this.child.on('close', function(code){
      logfmt.log({close: name, exit_code: code})
      var respawn = function(){
        self.spawn(self.name, self.stdout)
      }
      setTimeout(respawn, 500);
    })
    return this;
  }
};

module.exports = Filter;
