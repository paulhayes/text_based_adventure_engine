var Hashtable = require('jshashtable');
var Signal = require('signals').Signal;     
var addInventory = require('./inventory');
var makeCommonObject = require('./commonobject');

var Player = function(out,properties){

	var intervalId;
	var lines = [];
	var currentlyWatching;
	var commandTree = {};
	var _itemsState = new Hashtable();
	var updateInterval = ( properties && properties.updateInterval ) || 500; 

	makeCommonObject(this);
	addInventory(this);

	this.maxLoadWeight = 60;

	this.on = function( type, callback ){
	};

	this.do = function(buf){
		var input = buf.toString('ascii');
		var output = '';
		output = this.command( input );

		out( output );
	};

	this.registerCommand = function( commandString, func ){
		var branches = ascendCommandTree( commandString, true );
		branches.pop().__function = func;
	};

	this.unregisterCommand = function( commandString, func ){
		var branches = ascendCommandTree( commandString, false );
		if( branches === false ) {
			throw new Error('could not find command '+commandString);
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



	var ascendCommandTree = function(commandString, makeMissingBranch){

		var commandWords = commandString.split(/\s+/);
		var currentBranch = commandTree;
		var completeBranch = [ currentBranch ];
		commandWords.forEach(function(word){
			if( ! currentBranch.hasOwnProperty( word ) && makeMissingBranch ){
				currentBranch[word] = { __name : word };
			}

			if( ! currentBranch[word] ) return false;
			
			completeBranch.push( currentBranch = currentBranch[word] );
		});
		return completeBranch;
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
			if( isKeyMetaAttribute( n ) ) continue;
			obj[n] = arguments.callee( branch[n] );
		} 

		if( Object.keys( obj ).length === 0 ) obj = null;
    	
    	return obj;
  	}

	var update = function(){
		if( lines.length == 0 ) return;
		out( lines.shift()+'\n' );
	};

	this.__defineGetter__('itemsState', function(){
    	return _itemsState;
  	});

	this.__defineGetter__('commands', getCommands );

	intervalId = setInterval( update, updateInterval );

};


module.exports = Player;