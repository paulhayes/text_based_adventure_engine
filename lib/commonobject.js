
var Signal = require('signals').Signal;    

var makeCommonObject = function(target, properties ){

	/*
		basic command state flags
	*/
	var states = target.commandStates = {
		VICINITY : 1,
		SEEN : 2,
		OBSERVED : 4,
		EXAMINED : 8,
		ALL : 0xffffff
	};

	var commands = [];
	var container = null;

	target.seenSignal = new Signal();
	target.becameInvisibleSignal = new Signal();

	target.audibleSignal = new Signal();
	target.visualSignal = new Signal();

	/* Currently not needed anywhere
	target.observedSignal = new Signal();
	target.examinedSignal = new Signal();
	*/
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

	target.onPlayerEnters = function(player){
		target.setStateFlag( player, states.VICINITY, true );
		updateCommands(player);
	}

	target.onPlayerLeaves = function(player){
		target.setStateFlag( player, states.VICINITY, false );	
		updateCommands(player);	
	}

	target.onSeen = function(player){
		target.setStateFlag( player, states.SEEN, true );
		target.seenSignal.dispatch( player );
		updateCommands(player);
	};

	target.onObserved = function(player){
		target.setStateFlag( player, states.OBSERVED, true );
		updateCommands(player);
	};

	target.onExamined = function(player){
		target.setStateFlag( player, states.EXAMINED, true );
		updateCommands(player);
	};

	target.onBecameInvisible = function(player){
		//getState(player).stateMask &= ~(states.SEEN|states.OBSERVED|states.EXAMINED);
		target.becameInvisibleSignal.dispatch( player );
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
			isInMask = ( maskSafe( mask ) & command[2] ) === command[2];
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
