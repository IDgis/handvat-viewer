import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getAddressSuggestions: function(url) {
		var res = HTTP.get(url);
		
		return res.data.suggestions;
	},
	getAddressSearchResult: function(url) {
		var res = HTTP.get(url);
		var results = res.data.dataSources[0].results;
		
		var element;
		var count = 0;
		results.forEach(function(item) {
			if(count === 0) {
				var name = item.name;
				var envelope = item.envelope;
				
				if(typeof name !== 'undefined' && typeof envelope !== 'undefined') {
					element = {'name' : item.name, 'envelope' : item.envelope};
				}
				
				count++;
			}
		});
		
		return element;
	}
});