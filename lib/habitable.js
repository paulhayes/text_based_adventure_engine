var Player = require('./player');

var makeHabitable = function(target){

	if(! target.itemAddedSignal ) throw new Error('habitable target must have inventory added first');

	target.commandStates.INSIDE = 32;

	var lookAround = function(player){
		target.getItems().forEach( function(item){ item.onSeen(player) });

		return 'You are in '+target.description+'. '+target.listItems(player);
	};

	var playerLeaves = function(player){
		target.getItems().forEach( function(item){ item.onBecameInvisible(player) });
	};

	var onItemAdded = function(item){
		if( item instanceof Player ) {
			target.setStateFlag( item, target.commandStates.INSIDE, true );
		}
	};

	var onItemRemoved = function(item){
		if( item instanceof Player ) {
			playerLeaves(item)
			target.setStateFlag( item, target.commandStates.INSIDE, false );
		}
	};

	target.itemAddedSignal.add(onItemAdded);
	target.itemRemovedSignal.add(onItemRemoved);

	target.addCommand( 'look around', lookAround, target.commandStates.INSIDE );


};

module.exports = makeHabitable;