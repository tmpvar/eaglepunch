var fs = require('fs');
var argv = require('optimist').argv;

var brd = fs.readFileSync(__dirname + '/../tmp/from-eagle', "utf-8");
var brdParts = brd.split('\n');

var out = {};

function addValue(path, value) {
  var where = out, last = out,segment;
  value = value || "";

  for (var i = 0, l = path.length; i<l-1; i++) {
    segment = path[i];
    var placeholder = !isNaN(parseFloat(path[i+1])) ? [] : {};
    where = where[segment] = (typeof where[segment] === 'undefined') ? placeholder : where[segment];
  }


  if (value === "true") {
    where[path[path.length-1]] = true;
  } else if (value === "false") {
    where[path[path.length-1]] = false;
  } else if (/^[\-0-9]+$/.test(value)) {
    where[path[path.length-1]] = parseInt(value);
  } else if (/^[\-0-9\.]+$/.test(value)) {
    where[path[path.length-1]] = parseFloat(value);
  } else {
    where[path[path.length-1]] = value;
  }

}

brdParts.forEach(function(value) {
  if (value === "") { return; }
  var lineParts = value.split(':');
  var value = lineParts[1];
  addValue(lineParts[0].split('.'), value);
});

var json = JSON.stringify(out, null, '  ')

if (argv.out) {
  fs.writeFileSync(argv.out, json);
} else {
  console.log(json);
}