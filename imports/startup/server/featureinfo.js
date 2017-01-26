import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getDeelgebied: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		if(typeof xml.msGMLOutput.Deelgebieden_layer !== 'undefined') {
			return xml.msGMLOutput.Deelgebieden_layer[0].Deelgebieden_feature[0].OMSCHRIJVI[0].trim();
		}
	},
	getLandschapsType: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		if(typeof xml.msGMLOutput.landschapstypen_v_layer !== 'undefined') {
			var lt = xml.msGMLOutput.landschapstypen_v_layer[0].landschapstypen_v_feature[0].TYPE[0];
			var texts = HTTP.get(Meteor.settings.public.hostname + '/handvat-admin/text/json');
			var json = JSON.parse(texts.content);
			
			var id;
			json.forEach(function(item) {
				if(item.name === lt) {
					id = item.id;
				}
			});
			return id;
		}
	},
	getLayer: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		return xml.WMT_MS_Capabilities.Capability[0].Layer[0].Layer;
	},
	getBeheertypeData: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var infos = [];
		var info;
		
		if(typeof xml.msGMLOutput["beheertypenkaart_n_layer"] !== 'undefined') {
			info = xml.msGMLOutput["beheertypenkaart_n_layer"][0]["beheertypenkaart_n_feature"][0].BEHEERTYPE[0];
			infos.push(info);
		}
		
		if(typeof xml.msGMLOutput["beheertypenkaart_nn_layer"] !== 'undefined') {
			info = xml.msGMLOutput["beheertypenkaart_nn_layer"][0]["beheertypenkaart_nn_feature"][0].BEHEERTYPE[0];
			infos.push(info);
		}
		
		if(typeof xml.msGMLOutput["beheertypenkaart_l_layer"] !== 'undefined') {
			info = xml.msGMLOutput["beheertypenkaart_l_layer"][0]["beheertypenkaart_l_feature"][0].BEHEERTYPE[0];
			infos.push(info);
		}
		
		return infos;
	}
});