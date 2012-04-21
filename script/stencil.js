var match = require('JSONSelect').match;
var Hook = require('hook.io').Hook;
var hook = new Hook({
  name : 'eaglepunch-stencil',
  ignoreSTDIN : true,
  debug : true
});


var units = function(val, to) {
  console.log('VAL', val)
  if (val > 0) {
    switch (to) {
      case 'mm':
        val = val / 320000;
      break;
      case 'in':
        val = (val / 320000) / 25.4;
      break;
    }
  }
  return val;
};


module.exports = function(board, options) {
  hook.start();
  hook.on('hook::ready', function() {
    var unit = options.units || "mm";
    var cutZ = options.cutZ || -90;
    var safeZ = options.safeZ || -85;
    var gcode = [];

    // TODO: this belongs in its own lib
    function G(cmd, coords) {
      var parts = [
        'G' + cmd,
      ];

      for (var coord in coords) {
        if (coords.hasOwnProperty(coord)) {
          parts.push(coord.toUpperCase() + coords[coord]);
        }
      }

      gcode.push(parts.join(' '));
    }


    var addRect = function(x, y, w, h) {
      console.log(arguments);
      x = units(x, unit);
      y = units(y, unit);
      w = units(w, unit);
      h = units(h, unit);

      // Add points in clockwise fashion
      G(1, { x: x, y: y});
      G(1, { z: cutZ });
      G(1, { x: x+w, y: y});
      G(1, { x: x+w, y: y+h});
      G(1, { x: x, y: y+h});
      G(1, { x: x, y: y});
      G(1, { z: safeZ });

    };

    var smdContacts = match('.contacts < .smd', board);
    smdContacts.forEach(function(contact) {

      contact.forEach(function(connection) {
        console.log(connection);
        // TODO: pads
        if (connection.smd) {
          var smds = connection.smd;
          if (!smds.length) {
            var tmp = [];
            for (var key in smds) {
              if (smds.hasOwnProperty(key)) {
                tmp.push(smds[key]);
              }
            }
            smds = tmp;
          }

          smds.forEach(function(smd) {
            if (smd) {
              // Handle SMDs
              addRect(
                connection.x,
                connection.y,
                smd.dx,
                smd.dy
              );
            }
          });
        }
      })

    });
    hook.emit('gcode', {
      name : "board",
      gcode : gcode
    });

    hook.once('grbl::complete', function() {
      process.exit();
    });
  });
};