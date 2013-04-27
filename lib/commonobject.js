
var makeCommonObject = function(target, properties ){

	/*
		basic command state flags
	*/
	var states = target.commandStates = {
		SEEN : 1,
		OBSERVERED : 2,
		EXAMINED : 3,
		ALL : 0xffffff
	};

	var commands = [];
	var container = null;

	if( typeof properties === 'object' ) for( var n in properties ) target[n] = properties[n];

	var getState = function(player){
		if( ! player.itemsState.containsKey(target) ) player.itemsState.put( target, { stateMask : 0 } );
		return player.itemsState.get(target);
	}

	target.addCommand = function( commandString, func, mask, negMask ){
		if( ! mask ) throw new Error('state mask was 0');
		if( ! negMask ) negMask = 0;
		var commandCall = function(){ 
			return func.apply( target, Array.prototype.slice.apply(arguments) ); 
		};

		commands.push( [ commandString, commandCall, mask, negMask ] );
	};

	target.onSeen = function(player){
		getState(player).stateMask |= states.SEEN;
		updateCommands(player);
	};

	target.onObserved = function(player){
		getState(player).stateMask |= states.OBSERVERED;
		updateCommands(player);
	};

	target.onExamined = function(player){
		getState(player).stateMask |= states.EXAMINED;
		updateCommands(player);
	};

	target.onBecameInvisible = function(player){
		getState(player).stateMask &= ~(states.SEEN|states.OBSERVERED|states.EXAMINED);
		updateCommands(player);
	};

	target.setStateFlag = function(player,flag,on){
		if( on ) getState(player).stateMask |= flag;
		else getState(player).stateMask &= states.ALL ^ flag;
		updateCommands(player);
	}

	target.setContainer = function(newContainer){
		container = newContainer;
	}

	target.getContainer = function(){
		return container;
	}

	var updateCommands = function(player){
		commands.forEach(unregisterCommand(player), this);
		commands.filter(filterCommands(getState(player).stateMask)).forEach(registerCommand(player), this);
	}

	var filterCommands = function(mask){
		return function(command){
			isInMask = ( maskSafe( mask ) & command[2] ) !== 0;
			isNotInNegMask = ( maskSafe( mask ) & command[3] ) === 0;
			return isInMask && isNotInNegMask;
		};
	}

	var maskSafe = function(mask){
		return mask & 0xffffff;
	}

	var registerCommand = function(player){
		return function(command){
			player.registerCommand.apply( player, command );
		}
	}

	var unregisterCommand = function(player){
		return function(command){
			player.unregisterCommand.apply( player, command );
		}
	}

};


module.exports = makeCommonObject;
