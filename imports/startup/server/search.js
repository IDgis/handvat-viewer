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
	}
});