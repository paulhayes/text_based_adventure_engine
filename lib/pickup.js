var makePickupObject = function(target){

	/* command state */
	target.commandStates.PICKUP = 64;

	target.pickup = function(player){
		var playerCanCarry = !target.weight || player.canCarry(target.weight);
		if( playerCanCarry ){

			player.addItem(target);
			target.setStateFlag( player, target.commandStates.PICKUP, true );
			return 'you picked up '+target.description+'.\n';

		}
		else {
			return target.description+' is too heavy to pick up.\n';
		}
	}

	target.drop = function(player){
		player.getContainer().addItem(target);
		target.setStateFlag( player, target.commandStates.PICKUP, false );
		return 'you dropped '+target.description+'\n';
	}

	target.addCommand( 'pickup '+target.name, target.pickup, target.commandStates.SEEN | target.commandStates.VICINITY, target.commandStates.PICKUP );
	target.addCommand( 'drop '+target.name, target.drop, target.commandStates.PICKUP );


}


module.exports = makePickupObject;