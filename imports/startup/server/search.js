var Future = Npm.require('fibers/future'); 

import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getAddressSuggestions(url) {
		var future = new Future();
		
		HTTP.get(url, {
		}, function(err, result) {
			future.return(result.data.suggestions);
		});
		
		return future.wait();
	},
	getCadastreSuggestions(url) {
		var future = new Future();
		var array = [];
		
		HTTP.get(url, {
		}, function(err, result) {
			xml2js.parseString(result.content, function (err, result) {
				var features = result['wfs:FeatureCollection']['gml:featureMember']
				
				if(typeof features !== 'undefined') {
					features.forEach(function(item) {
						array.push(item['ms:kad_perceel_v'][0]['ms:KADSLEUTEL'][0]);
					});
				}
				
				future.return(array);
			});
		});
		
		return future.wait();
	},
	getAddressSearchResults(url) {
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
	},
	getCadastreSearchResults(url) {
		var future = new Future();
		
		var array = [];
		
		HTTP.get(url, {
		}, function(err, result) {
			xml2js.parseString(result.content, function (err, result) {
				var features = result['wfs:FeatureCollection']['gml:featureMember'];
				
				if(typeof features !== 'undefined') {
					features.forEach(function(item) {
						var name = item['ms:kad_perceel_v'][0]['ms:KADSLEUTEL'][0];
						var lowerCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:lowerCorner'][0];
						var upperCorner = item['ms:kad_perceel_v'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:upperCorner'][0];
						
						var element = {'name' : name, 'lowerCorner' : lowerCorner, 'upperCorner' : upperCorner};
						
						array.push(element);
					});
				}
			});
			
			future.return(array);
		});
		
		return future.wait();
	}
});