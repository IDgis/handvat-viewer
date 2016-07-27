import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getLandschapstypen: function(content) {
		var landschapstypen = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === 'landschapstype') {
				var element = {'id': item.id, 'name' : item.name};
				landschapstypen.push(element);
			}
		});
		
		return landschapstypen;
	},
	getSectors: function(content) {
		var sectors = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === 'sector') {
				var element = {'id': item.id, 'name' : item.name};
				sectors.push(element);
			}
		});
		
		return sectors;
	}
});