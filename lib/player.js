var Hashtable = require('jshashtable');
var Signal = require('signals').Signal;     
var addInventory = require('./inventory');
var makeCommonObject = require('./commonobject');

var Player = function(properties){

	var intervalId,
		lines = [],
		currentlyWatching,
		commandTree = {},
		_itemsState = new Hashtable(),
		updateInterval = ( properties && properties.updateInterval ) || 500,
		outputSignal = new Signal();

	makeCommonObject(this);
	addInventory(this);

	this.maxLoadWeight = 60;
	
	this.outputSignal = outputSignal;

	this.on = function( type, callback ){
	};

	this.do = function(buf){
		var input = buf.toString('ascii');
		var output = '';
		output = this.command( input );

		outputSignal.dispatch( output );
	};

	this.registerCommand = function( commandString, func ){
		//console.error('RESISTERING COMMAND', commandString);
		var branches = ascendCommandTree( commandString, true );
		branches.pop().__function = func;
	};

	this.unregisterCommand = function( commandString, func ){
		//console.error('UNRESISTERING COMMAND', commandString);
		var branches = ascendCommandTree( commandString, false );
		if( branches === false ) {
			//throw new Error('could not find command '+commandString);
			return;
		}
		var lastBranchName = '__function';
		while( branches.length > 0 ){
			var branch = branches.pop();
			var keys = Object.keys( branch ).filter(isNotKeyMetaAttribute);
			if( keys.length > 1 || branches.length == 0 ){
				delete branch[lastBranchName];
				break;
			}
			lastBranchName = branch.__name;
		}

		
	}

	this.command = function( input ){

		var match;

		input = input.trim();

		var commandFunction = getCommandFromTree(input);

		if( commandFunction ){
			return commandFunction(this);
		}
				
		if( match = input.match(/^list commands$/i) ){
			return listCommands(commandTree);
		}

		return '';
	}

	this.see = function(msg){
		lines.push(msg);
	}

	this.hear = function(msg){
		lines.push(msg);
	}

	var ascendCommandTree = function(commandString, makeMissingBranch){

		var commandWords = commandString.split(/\s+/);
		var currentBranch = commandTree;
		var completeBranch = [ currentBranch ];
		var success = commandWords.every(function(word){
			if( ! currentBranch.hasOwnProperty( word ) && makeMissingBranch ){
				console.error('make missing branch '+word);
				currentBranch[word] = { __name : word };
			}

			if( ! currentBranch[word] ) {
				console.error( 'could not find branch :' + word );
				return false;
			}
			completeBranch.push( currentBranch = currentBranch[word] );
			return true;
		});
		return success && completeBranch;
	}

	var getCommandFromTree = function(commandString){
		return ascendCommandTree(commandString).pop().__function;
	}

	var isKeyMetaAttribute = function(key){
		return key.indexOf('__') === 0;
	}

	var isNotKeyMetaAttribute = function(key){
		return !isKeyMetaAttribute(key);
	}

	var listCommands = function(branch,tab){
		var out = '';
		if(!tab) tab='';
		for( var n in branch ){
			if( isKeyMetaAttribute( n ) ) continue;
			out += tab+n+':\n';
			out += listCommands(branch[n],tab+' ');
		}
		return out;
	};

	var getCommands = function(){
		var branch = arguments[0] || commandTree;
		var obj = {};
		for( var n in branch ){
			var key = n;
			var currentBranch = branch;
			if( isKeyMetaAttribute( n ) ) continue;
			var nextKeys;
			var tmpKey = n;
			while( currentBranch[tmpKey] ){
				var nextKeys = Object.keys( currentBranch[tmpKey] ).filter(function(v){ return isNotKeyMetaAttribute( v ) });
				if( nextKeys.length !== 1 ) break;
				currentBranch = currentBranch[tmpKey];
				tmpKey = nextKeys.pop();
				key += ' ' + tmpKey;
			}

			obj[key] = arguments.callee( currentBranch[tmpKey] );
		} 

		if( Object.keys( obj ).length === 0 ) obj = null;
    	
    	return obj;
  	}

	var update = function(){
		if( lines.length == 0 ) return;
		outputSignal.dispatch( lines.shift()+'\n' );
	};

	Object.defineProperty( this, 'itemsState', {
		get : function(){
    		return _itemsState;
  		}
	});

	Object.defineProperty( this, 'commands', {
		get : getCommands
	});


	intervalId = setInterval( update, updateInterval );

};


module.exports = Player;