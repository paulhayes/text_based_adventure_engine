var makeCommonObject = require('./commonobject');
var makeWatchable = require('./watchable');

var Television = function(){
	var intervalId;
	var index = 0;
	var item = this;
	var text = [
			'"You never mentioned anything about seeing Doctor Leeroy"',
			'"I bumped into him yesterday . he said he wanted to see me about the tests"',
			'"Well maybe you got the results through . you should make an appointment and find out what’s going on."',
			'"No, he told me the results .. it’s er .. it’s serious Janine I’ve got an enlarged heart"',
			'"What?"',
			'"That’s what he said . so I was scared it was the same thing as dad so I looked up the causes on the net last night um . hypotrophic cardio some "',
			'"Hang on, hang on. Are you sure because if you can’t exactly remember the name and the doctor never even told you himself."',
			'"Yeah well he’s not gonna tell me is he. That’s that’s why he wants me to go and see the specialist so that he can explain it"'
	];

	this.description = 'an old worn looking television';
	this.name = 'television';

	makeCommonObject( this );
	makeWatchable( this );

	var update = function(){

		item.watchSignal.dispatch( '['+item.name+'] '+text[index] );

		index+=1;
		if( index >= text.length ) index = 0;
	};

	intervalId = setInterval( update, 2000 );
}

module.exports = Television;