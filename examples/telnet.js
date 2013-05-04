
var telnet = require('wez-telnet');
var Signal = require('signals').Signal;     
var Player = require('../lib/main').Player;
var World = require('./world');

var world = new World();

var s = new telnet.Server(function (client) {
	// I am the connection callback
	var player = new Player();
	player.outputSignal.add(function(msg){ client.write(msg) });
	world.addPlayer(player);

	console.log("connected term=%s %dx%d", client.term, client.windowSize[0], client.windowSize[1]);

	client.on('data', function (buf) { player.do(buf) });
	client.on('resize', function (width, height) {
	  console.log("resized to %dx%d", width, height);
	});
	client.on('interrupt', function () {
	  console.log("INTR!");
	  // disconnect on CTRL-C!
	  client.end();
	});
	client.on('close', function () {
	  console.log("END!");
	});
});

s.listen(1337);