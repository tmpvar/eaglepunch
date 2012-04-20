#!/usr/bin/env node

var
  Hook   = require('hook.io').Hook,
  fs     = require('fs'),
  board  = JSON.parse(fs.readFileSync(__dirname + '/../tmp/from-eagle.json')),
  hook   = new Hook({
    name : 'eagle board emitter',
    debug : true
  });


hook.on("hook::ready", function() {

  hook.emit('board.data', board, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('OK');
    }
    process.exit();
  });

  hook.onAny(function (data) {
    console.log(this.event, data);
  });

});

hook.start();