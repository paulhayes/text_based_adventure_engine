var Player = require('../lib/main').Player;
var World = require('./world');
var Shell = require('../lib/shell');

var world = new World();
var player = new Player();
world.addPlayer(player);


Shell.attachPlayerToShell( player );