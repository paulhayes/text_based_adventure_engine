var Hashtable = require('./jshashtable');

var addInventory = require('./inventory');
var makeCommonObject = require('./commonobject');

var Player = function(client,properties){

	var intervalId;
	var lines = [];
	var currentlyWatching;
	var commandTree = {};
	var _itemsState = new Hashtable();

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

		//console.log('listing item states');
		//_itemsState.each( function(k,v){ console.log('item:', k.name, v.stateMask.toString(2)); });

		/*
		if( match = input.match(/^look *(?:at)? *(\w*)?$/i) ){

			console.log(match[1]);
			switch(match[1]){
				case undefined:
				case 'around':
					return 'You are in '+this.getContainer().description+'. '+this.getContainer().listItems(this);
				default:
					console.log(match[1]);
					return this.getContainer().getItem(match[1]).description+'\n';
			}

		}*/

		/*
		if( match = input.match(/^watch *(\w+)$/i) ){
			console.log('watch command called');
			currentlyWatching = this.getContainer().getItem( match[1] );
			if( currentlyWatching ) { 
				currentlyWatching.watchSignal.add(function(e){
					lines.push(e);
				});
				return 'You watch the '+currentlyWatching.name+'\n';
			}
			return '';
		}
		*/

		/*if( currentlyWatching ) {
			var obj = currentlyWatching;
			currentlyWatching = null;
			obj.watchSignal.removeAll();
			return 'You stop watching the '+obj.name+'\n';
		}*/

		return '';
	}

	this.see = function(msg){
		lines.push(msg);
	}

	this.__defineGetter__('itemsState', function(){
    	return _itemsState;
  	});

	this.update = function(){
		if( lines.length == 0 ) return;
		client.write( lines.shift()+'\n' );
	};

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




	intervalId = setInterval( this.update, 500 );

};


module.exports = Player;