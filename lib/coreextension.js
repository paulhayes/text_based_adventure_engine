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
		if( this.length === 0 ) return '';
		return 'There is '+this.slice(0,-1).join(', ') + ( this.length > 1 ? ' and ' : '' ) + this[this.length-1] + '.';
	}
});

Object.defineProperty(String.prototype, "wrap", {
	enumerable: false,
	value: function(cols,maxRows){
		var lines = [],
			index,
			s,
			str = this.toString();

		var i = 0;
		while( str.length > cols ){ 
			//console.log(str,cols,lines.length,str.length);
			s = 1;
			index = str.indexOf('\n');
			if( index === -1 || index >= cols ) index = str.lastIndexOf(' ', cols ); 
			//else s = 1;
			if( index < 1 ) index = cols;
			lines.push( str.slice(0,index) );
			str = str.slice(index+s);
			//console.error(lines.length, str.length);
			if( lines.length >= maxRows ) return lines;
			if( ++i > 100 ) return 'ooops'
		}

		if( lines.length < maxRows ) lines.push( str );
			
		return lines;
	}
});

Object.defineProperty(String.prototype, "stylise", {
	enumerable: false,
	value : function(style) {
		str = this.toString();
	    var styles = {
	      //styles
	      'bold'      : ['\033[1m',  '\033[22m'],
	      'italic'    : ['\033[3m',  '\033[23m'],
	      'underline' : ['\033[4m',  '\033[24m'],
	      'inverse'   : ['\033[7m',  '\033[27m'],
	      //grayscale
	      'white'     : ['\033[37m', '\033[39m'],
	      'grey'      : ['\033[90m', '\033[39m'],
	      'black'     : ['\033[30m', '\033[39m'],
	      //colors
	      'blue'      : ['\033[34m', '\033[39m'],
	      'cyan'      : ['\033[36m', '\033[39m'],
	      'green'     : ['\033[32m', '\033[39m'],
	      'magenta'   : ['\033[35m', '\033[39m'],
	      'red'       : ['\033[31m', '\033[39m'],
	      'yellow'    : ['\033[33m', '\033[39m']
	    };
	  	return styles[style][0] + str + styles[style][1];
	}
});