import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getTexts: function(content, texttype) {
		var array = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === texttype) {
				var element = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
				array.push(element);
			}
		});
		
		return array;
	},
	getOntwerpen: function(content, landschapstype, sector, kernkwaliteit) {
		var array = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.landschapstype === landschapstype && item.sector === sector && item.kernkwaliteit === kernkwaliteit) {
				var element = {'id': item._id, 'ontwerpprincipes' : item.ontwerpprincipe};
				array.push(element);
			}
		});
		
		return array;
	},
	getBeginselen: function(content, landschapstype) {
		var array = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.landschapstype === landschapstype) {
				var element = {'id': item._id, 'leidende_beginselen' : item.leidend_beginsel};
				array.push(element);
			}
		});
		
		return array;
	},
	getText: function(content, id) {
		var object;
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.id === id) {
				object = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
			}
		});
		
		return object;
	}
});