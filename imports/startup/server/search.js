var Future = Npm.require('fibers/future'); 

import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getSuggestions(url) {
		var future = new Future();
		
		HTTP.get(url, {
		}, function(err, result) {
			future.return(result.data.suggestions);
		});
		
		return future.wait();
	},
	getSearchResults(url) {
		var future = new Future();
		
		var array = [];
		
		HTTP.get(url, {
		}, function(err, result) {
			var results = result.data.dataSources[0].results;
			results.forEach(function(item) {
				var name = item.name;
				var envelope = item.envelope;
				
				if(typeof name !== 'undefined' && typeof envelope !== 'undefined') {
					var element = {'name' : item.name, 'envelope' : item.envelope};
					array.push(element);
				}
			});
			
			future.return(array);
		});
		
		return future.wait();
	}
});