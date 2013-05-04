
var makeCommonObject = require('./commonobject');
var makePickupObject = require('./pickup');

var Dice = function(){

	this.name = 'die';
	this.description = 'a die made of polished bone';
	this.weight = 0.05;
	this.value;

	makeCommonObject( this );
	makePickupObject( this );
	
	this.roll = function(player){
		this.value = Math.floor( 6 * Math.random() + 1 );
		return 'You roll a '+this.value+'\n';
	}

	this.addCommand( 'roll '+this.name, this.roll, this.commandStates.SEEN | this.commandStates.VICINITY );


};


module.exports = Dice;
