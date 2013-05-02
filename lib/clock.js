var Signal = require('signals').Signal;    
var makeCommonObject = require('./commonobject');
var makeWatchable = require('./watchable'); 

var Clock = function(){
	var clock = this;
	var intervalId;
	this.description = 'an antique clock on a mantle piece';
	this.name = 'clock';

	var lastTime;
	var intervalTimeout = 60 * 1000;

	makeCommonObject( this );
	makeWatchable( this );

	var update = function(){
		var date = new Date();
		var time = date.getHours()+":"+date.getMinutes();

		if( time != lastTime ){ 
			clock.watchSignal.dispatch( '['+clock.name+'] '+time );
			lastTime = time;
		}
	}

	this.startedWatching.add(function(){
		setTimeout(update,100);
		clearInterval( intervalId );
		intervalId = setInterval(update,intervalTimeout);
	});

	intervalId = setInterval(update,intervalTimeout);

}

module.exports = Clock;