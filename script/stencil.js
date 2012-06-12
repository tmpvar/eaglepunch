//run eaglepunch --run=stencil --negate=1 --offsetX=10 --offsetY=25 --safeZ=95 --cutZ=97.5 --bitDiameter=0.2
var
  match = require('JSONSelect').match,
  Hook = require('hook.io').Hook,
  hook = new Hook({
    name : 'eaglepunch-stencil',
    ignoreSTDIN : true,
    debug : true
  }),
  Vec2 = require('vec2');

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
    var cutZ = options.cutZ || 75;
    var safeZ = options.safeZ || 70;
    var feedRate = options.feedRate || 900;
    var negate = options.negate || false;
    var offsetX = options.offsetX || 0;
    var offsetY = options.offsetY || 0;
    var bitDiameter = options.bitDiameter || 0.1;
    var bitRadius = bitDiameter/2;
    var gcode = [
      'G90',
      'G82',
      'M4'
    ];

    // TODO: this belongs in its own lib
    function G(cmd, coords) {
      var parts = [
        'G' + cmd,
      ];

      for (var coord in coords) {
        if (coords.hasOwnProperty(coord)) {
          var lcoord = coord.toLowerCase();
          if (lcoord === 'x') {
            coords[coord] += offsetX;
          } else if (lcoord == 'y') {
            coords[coord] += offsetY;
          }
          parts.push(coord.toUpperCase() + ((negate) ? -coords[coord] : coords[coord]));
        }
      }
      if (!coords.f && !coords.F) {
        parts.push('F' + feedRate);
      }

      gcode.push(parts.join(' '));
    }


    var addRect = function(x, y, w, h, degs) {
      var
        x     = units(x, unit),
        y     = units(y, unit),
        w     = units(w, unit),
        h     = units(h, unit),
        end   = new Vec2(w-bitRadius, h-bitRadius),
        start = new Vec2(x+bitRadius, y+bitRadius);

      end.add(start);

      G(1, { x: x + w/2, y: y + h/2});
      G(1, { z: cutZ });
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
                smd.dy,
                smd.angle
              );
            }
          });
        }
      })

    });

    // just wait there for a second
    gcode.push('G4 P1');

    // turn off the spindle
    gcode.push('M5');

    // go home
    G(1, { z:0 });
    G(1, { x:0, y: 0});

    hook.emit('gcode', {
      name : "board",
      gcode : gcode
    });


    hook.once('grbl::complete', function() {
      process.exit();
    });
  });
};