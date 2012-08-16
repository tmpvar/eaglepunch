var
  fs = require('fs'),
  argv = require('optimist').argv;

if (!argv.run) {
  process.exit(1);
}

try {
  var
    fn    = require(__dirname + '/../script/' + argv.run),
    json  = fs.readFileSync(argv.filename, 'ascii'),
    board = JSON.parse(json);

    fn(board, argv);
} catch (e) {
  fs.writeFileSync(__dirname + '/../tmp/run.error.txt', e);
  throw e;
  process.exit(1);
}