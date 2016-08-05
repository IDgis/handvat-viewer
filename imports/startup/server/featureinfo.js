var Future = Npm.require('fibers/future'); 

import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getLandschapsType: function(url) {
		var future = new Future();
		
		var lt;
		
		HTTP.get(url, {
		}, function(err, result) {
			xml2js.parseString(result.content, function (err, result) {
				if(typeof result.msGMLOutput.landschapstypen_v_layer !== 'undefined') {
					lt = result.msGMLOutput.landschapstypen_v_layer[0].landschapstypen_v_feature[0].LANDSCHAPSTYPE[0];
				} else {
					lt = "undefined";
				}
				
				future.return(lt);
			});
		});
		
		return future.wait();
	}
});