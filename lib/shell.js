var attachPlayerToShell = function(player){

	process.stdin.setEncoding('utf8');
	process.stdin.setRawMode( true );

	var lastLine = '';
	var outputBuffer = '';
	var textBuffer = '';
	var availibleCommands = '';
	var words = [];

	

	

	var trim = function(){

	}

	var output = function(msg){ 
		outputBuffer += lastLine;
		lastLine = msg;
		print(); 
	}


	var print = function(){

		commandWord = words.reduce(function(b,a){ return (b[a]) ? b[a] : b }, player.commands);
		availibleCommands = commandWord ? Object.keys( commandWord ).map(function(key,i){ return '['+(i+1)+': '+key+( commandWord[key] ? '...' : '')+' ]'; }).join(', ') : '';

		var dim = process.stdout.getWindowSize();
			width = dim[0],
			height = dim[1];

		var b = '';
		while( b.length < width ) b+='\u2588'; 
		//var b = new Buffer(width,'utf8');
		//while( b.write('\u2588') < b.length );
		var totalLines = 0;
		var textBufferWrapped = textBuffer.wrap(width, height-totalLines );
		totalLines += textBufferWrapped.length;
		var availibleCommandsWrapped = availibleCommands.wrap(width, height-totalLines );
		totalLines += availibleCommandsWrapped.length + 1;
		var lastLineWrapped = lastLine.wrap( width, height-totalLines );
		totalLines += lastLineWrapped.length;
		var outputBufferWrapped = outputBuffer.wrap(width, height-totalLines );
		//console.error( lastLineWrapped.length, outputBufferWrapped.length, width, height);
		process.stdout.write('\u001B[2J\u001B[0;0f:'+[].concat( textBufferWrapped, availibleCommandsWrapped, [b.toString()],lastLineWrapped ).join('\n')+outputBufferWrapped.join('\n').stylise('white')+'\033[0;'+(textBuffer.length+2)+'f');
	};

	//process.stdout.on('resize', print);

	process.stdin.on('data',function(data){

		var chars = data.split('').map(function(k){ return k.charCodeAt(0) });

		if( data === '\u0003' ) process.exit();
		if( data === '\u001b' ){
			textBuffer = '';
			words = [];
		}
		else if( parseInt(data) > 0 ) {
			//var commandWord = player.commands;
			var keyIndex = parseInt(data) - 1;
			var commandWord = words.reduce(function(b,a){ return (b[a]) ? b[a] : b }, player.commands);
			var keys = Object.keys( commandWord );
			if( keyIndex < keys.length ) words.push( keys[keyIndex] );
			else return;

			textBuffer = words.join(' ');
			if( !commandWord[words[words.length-1]] ){ 
				player.do( textBuffer );
				textBuffer = '';
				words = [];
			}
			print();
		}
		else if( chars[0] === 127 && chars.length === 1 ){
			textBuffer = textBuffer.slice(0,-1);
			print();
		}
		else if( data === '\r' ) {
			player.do( textBuffer );
			textBuffer = '';
			words = [];
			print();
		}
		else if( data.match(/[a-z0-9 ]/i) ){
			textBuffer += data.toString();
			print();
		}
		else console.log( chars, data );
		
	});

	player.outputSignal.add( output );

	print('');
};

module.exports.attachPlayerToShell = attachPlayerToShell;