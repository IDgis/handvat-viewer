import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getAddressSuggestions: function(url) {
		var res = HTTP.get(url);
		
		return res.data.suggestions;
	},
	getCadastreSuggestions: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		var features = xml['wfs:FeatureCollection']['gml:featureMember']
		
		var array = [];
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				array.push(item['ms:kad_perceel_v'][0]['ms:KADSLEUTEL'][0]);
			});
		}
		
		return array;
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
	},
	getCadastreSearchResult: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['gml:featureMember'];
		
		var element;
		var count = 0;
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				if(count === 0) {
					var name = item['ms:kad_perceel_v'][0]['ms:KADSLEUTEL'][0];
					var lowerCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:lowerCorner'][0];
					var upperCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:upperCorner'][0];
					
					element = {'name' : name, 'lowerCorner' : lowerCorner, 'upperCorner' : upperCorner};
				}
				
				count++;
			});
		}
		
		return element;
	}
});