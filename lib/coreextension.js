Array.prototype.find = function(lamda){ 
	for(var i=0;i<this.length;i++){
		if( lamda(this[i],i,this) ) return i;
	};

	return null;
};

Array.prototype.niceJoin = function(){
	return 'There is '+this.slice(0,-1).join(', ') + ( this.length > 1 ? ' and ' : '' ) + this[this.length-1] + '.';
};

String.prototype.trip = function(){
	return this.replace(/$\s+/,'').replace(/\s+^/);
};

