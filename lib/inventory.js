var Signal = require('signals').Signal;     

var nothing = require('./nothing');

var addInventory = function(target){

	var inventory = [];

	target.itemAddedSignal = new Signal();
	target.itemRemovedSignal = new Signal();

	target.getItem = function(name){
		var index = inventory.find(function(item){
			return item.name === name;
		});

		if( index >= 0 ) return inventory[index];
		else return nothing;
	}

	target.addItem = function(){
		Array.prototype.forEach.call( arguments, function(item){
			if( inventory.indexOf(item) === -1 ) {
				inventory.push( item ); 
				if( item.getContainer() ) item.getContainer().removeItem( item );
				item.setContainer(target);
				target.itemAddedSignal.dispatch(item);
			}


		} );

	};

	target.removeItem = function(){
		Array.prototype.forEach.call( arguments, function(item){
			var index = inventory.indexOf(item);
			if( index !== -1 ) {
				inventory.splice( index, 1 ); 
				item.setContainer(null);
				target.itemRemovedSignal.dispatch(item);
			}
			
		} );
	};

	target.canCarry = function(targetWeight){
		return inventory.reduce(
			function(weighttotal, item){ 
				return weighttotal + ( ( item.weight ) ? item.weight : 0 ) 
			}, targetWeight ) < this.maxLoadWeight;
	}

	target.listItems = function(player){
		return inventory.filter(function(item){ return item !== player }).map(function(item){ 
			return item.description ;
		}).niceJoin(',\n')+'\n';
	};

	target.getItems = function(player){
		return inventory.filter(function(item){ return item !== player });
	}

}

module.exports = addInventory;