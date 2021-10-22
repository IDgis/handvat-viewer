import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getCadastreObjects: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['wfs:member'];
		
		var elements = [];
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				var kadobj = item['KADASTER:BRK_ONROERENDE_ZAKEN'][0]['KADASTER:PERCEELNUMMER'][0];
				if(elements.indexOf(kadobj) === -1) {
					elements.push(kadobj);
				}
			});
		}
		
		return elements.sort();
	},
	getCadastreCoordinates: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var features = xml['wfs:FeatureCollection']['wfs:member'];

		var count = 0;
		var element;
		if(typeof features !== 'undefined') {
			features.forEach(function(item) {
				if(count === 0) {
					var lowerCorner = item['KADASTER:BRK_ONROERENDE_ZAKEN'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:lowerCorner'][0];
					var upperCorner = item['KADASTER:BRK_ONROERENDE_ZAKEN'][0]['gml:boundedBy'][0]['gml:Envelope'][0]['gml:upperCorner'][0];
					
					element = {'lowerCorner' : lowerCorner, 'upperCorner' : upperCorner};
				}
				
				count++;
			});
		}
		
		return element;
	}
});