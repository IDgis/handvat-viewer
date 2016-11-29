import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getAddressStreets: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['gml:featureMember'];
		
		var elements = [];
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				var id = item['bag:Openbareruimte'][0]['bag:openbareruimte'][0];
				var straat = item['bag:Openbareruimte'][0]['bag:naam'][0];
				var object = {'id': id, 'straat': straat};
				
				elements.push(object);
			});
		}
		
		return elements.sort(function(a, b) {
			if (a.straat > b.straat) {
				return 1;
			}
			
			if (a.straat < b.straat) {
				return -1;
			}
			
			return 0;
		});
	},
	getAddressNumbers: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['gml:featureMember'];
		
		var elements = [];
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				var id = item['bag:AdresseerbaarObject'][0]['bag:identificatie'][0];
				var nummer = item['bag:AdresseerbaarObject'][0]['bag:huisnummer'][0];
				var object = {'id': id, 'nummer': nummer};
				
				elements.push(object);
			});
		}
		
		return elements.sort(function(a, b) {
			if (a.nummer > b.nummer) {
				return 1;
			}
			
			if (a.nummer < b.nummer) {
				return -1;
			}
			
			return 0;
		});
	},
	getAddressCoordinates: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['gml:featureMember'];

		var count = 0;
		var element;
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				if(count === 0) {
					var lowerCorner = item['bag:AdresseerbaarObject'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:lowerCorner'][0];
					var upperCorner = item['bag:AdresseerbaarObject'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:upperCorner'][0];
					
					element = {'lowerCorner' : lowerCorner, 'upperCorner' : upperCorner};
				}
				
				count++;
			});
		}
		
		return element;
	}
});