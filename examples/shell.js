var Player = require('../lib/main').Player;
var World = require('./world');

var world = new World();
var player = new Player(function(msg){ outputBuffer=msg+stylize(outputBuffer,'white'); print(); });
world.addPlayer(player);

process.stdin.setEncoding('utf8');
process.stdin.setRawMode( true );

var outputBuffer = '';
var textBuffer = '';
var availibleCommands = '';
var words = [];

function stylize(str, style) {

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
};


var print = function(){

	commandWord = words.reduce(function(b,a){ return (b[a]) ? b[a] : b }, player.commands);
	availibleCommands = Object.keys( commandWord ).map(function(key,i){ return '['+(i+1)+': '+key+'... ]'; }).join(', ');

	var width = process.stdout.getWindowSize()[0];
	var b = '';
	while( b.length < width ) b+='\u2588'; 
	//var b = new Buffer(width,'utf8');
	//while( b.write('\u2588') < b.length );
	process.stdout.write('\u001B[2J\u001B[0;0f:'+textBuffer+'\n'+availibleCommands+'\n'+b.toString()+outputBuffer+'\033[0;'+(textBuffer.length+2)+'f');
};

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

print('');
