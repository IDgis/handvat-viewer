import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getLandschapsTypen: function(content) {
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
	},
	getLeidendeBeginselen: function(content) {
		var lbs = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === 'leidend_beginsel') {
				var element = {'id': item.id, 'name' : item.name, 'content' : item.html};
				lbs.push(element);
			}
		});
		
		return lbs;
	},
	getOntwerpPrincipes: function(content) {
		var ops = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === 'ontwerpprincipe') {
				var element = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
				ops.push(element);
			}
		});
		
		return ops;
	}
});