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
	getAddressSearchResults: function(url) {
		var res = HTTP.get(url);
		var results = res.data.dataSources[0].results;
		
		var array = [];
		results.forEach(function(item) {
			var name = item.name;
			var envelope = item.envelope;
			
			if(typeof name !== 'undefined' && typeof envelope !== 'undefined') {
				var element = {'name' : item.name, 'envelope' : item.envelope};
				array.push(element);
			}
		});
		
		return array;
	},
	getCadastreSearchResults: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['gml:featureMember'];
		
		var array = [];
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				var name = item['ms:kad_perceel_v'][0]['ms:KADSLEUTEL'][0];
				var lowerCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:lowerCorner'][0];
				var upperCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:upperCorner'][0];
				
				var element = {'name' : name, 'lowerCorner' : lowerCorner, 'upperCorner' : upperCorner};
				
				array.push(element);
			});
		}
		
		return array;
	}
});