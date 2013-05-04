var Signal = require('signals').Signal;     

var makeWatchable = function(target){

	target.watchSignal = new Signal();
	target.startedWatching = new Signal();
	target.stoppedWatching = new Signal();
	
	target.commandStates.WATCH = 16;
	
	target.watch = function(player){
		target.watchSignal.add( player.see );
		target.setStateFlag( player, target.commandStates.WATCH, true );
		target.becameInvisibleSignal.add( target.stopWatching );
		target.startedWatching.dispatch( player );
		return 'You start watching the '+target.name+'\n';
	};

	target.stopWatching = function(player){
		target.watchSignal.remove( player.see );
		target.setStateFlag( player, target.commandStates.WATCH, false );
		target.stoppedWatching.dispatch( player );
		return 'You stop watching the '+target.name+'\n';
	};

	target.addCommand( 'watch '+target.name, target.watch, target.commandStates.SEEN | target.commandStates.VICINITY, target.commandStates.WATCH );
	target.addCommand( 'stop watching '+target.name, target.stopWatching, target.commandStates.WATCH );

};

module.exports = makeWatchable;