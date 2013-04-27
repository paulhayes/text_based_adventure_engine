var Signal = require('signals').Signal;    
var Room = require('./room');
var makeCommonObject = require('./commonobject');

var Door = function( properties ){

	var siblingDoor;

	this.name = 'door';

	makeCommonObject( this, properties );

	this.goThrough = function(player){
		var fromRoom = this.getContainer(),
			toRoom = siblingDoor.getContainer();

		toRoom.addItem( player );

		return 'You go through the ' + this.name + ' and step into '+toRoom.description+'\n';
	}

	this.linkRooms = function( door ){

		if( ! ( door instanceof Door ) ) throw new Error('Door.linkRooms requires first argument to be instance of Door');

		siblingDoor = door;

	}

	this.addCommand( 'go through '+this.name, this.goThrough, this.commandStates.SEEN );

}

Door.link = function(roomA, roomB, props){
	var doorA = new Door(props);
	var doorB = new Door(props);
	roomA.addItem(doorA);
	roomB.addItem(doorB);
	doorA.linkRooms(doorB);
	doorB.linkRooms(doorA);
};

module.exports = Door;
