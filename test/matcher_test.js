var m = require('../match');
var assert = require('assert');

suite('url matching', function() {

  test('path / doesnt match everything', function(){

    var actual_path = '/foo';
    var route = '/';

    console.log(m.match(route, actual_path));

  })

})
