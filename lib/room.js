
var addInventory = require('./inventory');
var makeHabitable = require('./habitable');
var makeCommonObject = require('./commonobject');

var Room = function(properties){

	if( typeof properties === 'object' ) for( var n in properties ) this[n] = properties[n];

	makeCommonObject(this);
	addInventory(this);
	makeHabitable(this);
}

module.exports = Room;