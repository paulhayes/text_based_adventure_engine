/* Array extensions */

Object.defineProperty(Array.prototype, "find", { 
	enumerable: false,
	value: function(lamda){ 
		for(var i=0;i<this.length;i++){
			if( lamda(this[i],i,this) ) return i;
		};

		return null;
	} 
});

Object.defineProperty(Array.prototype, "niceJoin", { 
	enumerable: false,
	value: function() {
		return 'There is '+this.slice(0,-1).join(', ') + ( this.length > 1 ? ' and ' : '' ) + this[this.length-1] + '.';
	}
});

