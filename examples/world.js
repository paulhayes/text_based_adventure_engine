var Room = require('./room');
var Door = require('./door');
var Television = require('./television');
var Clock = require('./clock');
var Dice = require('./dice');


var World = function(){

	var oldRoom = new Room({name:'old room', description: 'an old musty room, with dusty shelves around two walls'});
	var newRoom = new Room({name:'new room', description: 'a brightly lit room, with clean bare white walls, and minamilist funishings'});

	oldRoom.addItem( new Clock(), new Dice() );
	newRoom.addItem( new Television() );

	Door.link( oldRoom, newRoom, { name : 'door', description : 'an old looking door' } );

	this.addPlayer = function(player){
		newRoom.addItem(player);
	}
}

module.exports = World;
