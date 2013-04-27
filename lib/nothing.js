var Signal = require('signals').Signal;     

var nothing = new (function(){
	this.watchSignal = new Signal();
	this.description = '';
	this.name = 'nothing';
})();

exports.module = nothing;