var Player = require('./player');

var makeHabitable = function(target){

	if(! target.itemAddedSignal ) throw new Error('habitable target must have inventory added first');

	target.commandStates.INSIDE = 32;

	var lookAround = function(player){
		target.getItems().forEach( function(item){ item.onSeen(player) });

		return 'You are in '+target.description+'. '+target.listItems(player);
	};

	var playerEnters = function(player){
		target.audibleSignal.add( player.see, player );
		target.visualSignal.add( player.see, player );
		target.setStateFlag( player, target.commandStates.INSIDE, true );
		//player.see( lookAround(player) );

		target.getItems().forEach( function(item){ item.onPlayerEnters(player) });
	}

	var playerLeaves = function(player){
		target.getItems().forEach( function(item){ item.onBecameInvisible(player) });
		target.getItems().forEach( function(item){ item.onPlayerLeaves(player) });
	};

	var onItemAdded = function(item){
		if( item instanceof Player ) {
			playerEnters( item );
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