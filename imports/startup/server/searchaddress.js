import { Meteor } from 'meteor/meteor';

Meteor.methods({
	executeLocatieServerSuggest: function(url) {
		var res = HTTP.get(url);
		var content = res.data.response;
		var docs = content.docs;
		
		var addresses = [];
		docs.forEach(function(doc) {
			addresses.push({id: doc.id, name: doc.weergavenaam});
		});
		
		return addresses;
	},
	executeLocatieServerLookup: function(url) {
		var res = HTTP.get(url);
		var content = res.data.response;
		var docs = content.docs;
		
		if(docs.length !== 0) {
			var doc = docs[0];
			var centroideRd = doc.centroide_rd;
			
			var centroideRdTrimmed = centroideRd.substring(centroideRd.indexOf('(') + 1);
			var coordinateX = centroideRdTrimmed.substring(0, centroideRdTrimmed.indexOf(' '));
			var coordinateY = centroideRdTrimmed.substring(centroideRdTrimmed.indexOf(' ') + 1, centroideRdTrimmed.indexOf(')'));
			
			return {x: parseFloat(coordinateX), y: parseFloat(coordinateY)};
		}
		
		return null;
	}
});