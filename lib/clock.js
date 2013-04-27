var Signal = require('signals').Signal;    
var makeCommonObject = require('./commonobject');
var makeWatchable = require('./watchable'); 

var Clock = function(){
	var clock = this;
	this.watchSignal = new Signal();
	this.description = 'an antique clock on a mantle piece';
	this.name = 'clock';

	var lastTime;

	makeCommonObject( this );
	makeWatchable( this );

	this.update = function(){
		var date = new Date();
		var time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

		if( time != lastTime ) this.watchSignal.dispatch( time );

		lastTime = time;
	}

	setInterval(function(){ clock.update() },500);
}

module.exports = Clock;