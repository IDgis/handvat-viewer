import { Meteor } from 'meteor/meteor';

Meteor.methods({
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