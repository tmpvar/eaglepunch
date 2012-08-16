var
  fs = require('fs');

module.exports = function(board, options) {
  var csv = "", parts = {};

  var bomQuery = [];
  board.board.elements.forEach(function(element) {
    var key = element.value + element.package.name;
    if (!parts[key]) {
      parts[key] = element;
      parts[key].quantity = 1;
    } else {
      parts[key].quantity+=1;
    }
  });

  var csv = '';
  Object.keys(parts).forEach(function(partName) {
    var line = [parts[partName].package.name, parts[partName].value, parts[partName].quantity].join('\t');
    console.log(line);
    csv += line + '\n';
  });

  fs.writeFileSync(options.filename.replace('.json', '') + '-bom.csv', csv);
};