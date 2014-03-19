exports.match = function(urlt, url){
  var urltemplate_tokens = urlt.split('/');
  var url_tokens = url.split('/');

  var match = true;
  for(var i=0; i<urltemplate_tokens.length; i++){
    var l = urltemplate_tokens[i];
    var r = url_tokens[i];
    match = (l[0] === ':' || l == r)
  }
  return match;
}
