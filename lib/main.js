
var main = {};

require('./coreextension');

main.Player = require('./player');
main.Room = require('./room');
main.Door = require('./door');
main.Dice = require('./dice');
main.Television = require('./television');
main.Clock = require('./clock');

module.exports = main;