var
  fs = require('fs'),
  argv = require('optimist').argv;

if (!argv.run) {
  process.exit(1);
}

try {
  var
    fn    = require(__dirname + '/../script/' + argv.run),
    json  = fs.readFileSync(__dirname + '/../tmp/from-eagle.json', 'ascii'),
    board = JSON.parse(json);

    fn(board, argv);
} catch (e) {
  process.exit(1);
}