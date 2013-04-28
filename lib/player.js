var Hashtable = require('jshashtable');

var addInventory = require('./inventory');
var makeCommonObject = require('./commonobject');

var Player = function(client,properties){

	var intervalId;
	var lines = [];
	var currentlyWatching;
	var commandTree = {};
	var _itemsState = new Hashtable();
	var updateInterval = properties.updateInterval || 500; 

	makeCommonObject(this);
	addInventory(this);

	this.maxLoadWeight = 60;

	this.onData = function(buf){
		var input = buf.toString('ascii');
		var output = '';
		output = this.command( input );

		client.write( output );
	};

	this.registerCommand = function( commandString, func ){
		//console.log('registering: ',commandString);
		var branches = ascendCommandTree( commandString, true );
		branches.pop().__function = func;
	};

	this.unregisterCommand = function( commandString, func ){
		//console.log('unregistering: ', commandString);
		var branches = ascendCommandTree( commandString, false );
		if( branches === false ) {
			throw new Error('could not find command '+commandString);
		}
		var lastBranchName = '__function';
		while( branches.length > 0 ){
			var branch = branches.pop();
			var keys = Object.keys( branch ).filter(isKeyMetaAttribute);
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

		console.log('input: '+input);

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

	this.__defineGetter__('itemsState', function(){
    	return _itemsState;
  	});

	this.__defineGetter__('commands', function(){
		var branch = arguments[0] || commandTree;
		var obj = {};
		for( var n in branch ){
			if( !isKeyMetaAttribute( n ) ) obj[n] = arguments.callee( branch[n] );
		} 

		if( Object.keys( obj ).length === 0 ) obj = null;
    	
    	return obj;
  	});


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

	var update = function(){
		if( lines.length == 0 ) return;
		client.write( lines.shift()+'\n' );
	};

	intervalId = setInterval( update, updateInterval );

};


module.exports = Player;