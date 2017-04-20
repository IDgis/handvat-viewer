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
		var code;
		var info;
		
		if(typeof xml.msGMLOutput["def_beheertypenkaart_v_layer"] !== 'undefined') {
			code = xml.msGMLOutput["def_beheertypenkaart_v_layer"][0]["def_beheertypenkaart_v_feature"][0].BEHEERTYPE[0];
			info = xml.msGMLOutput["def_beheertypenkaart_v_layer"][0]["def_beheertypenkaart_v_feature"][0].OMSCHRIJVING[0];
			
			infos.push({'code': code, 'info': info});
		}
		
		return infos;
	},
	getCultuurhistorieData: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var infos = [];
		var info;
		
		if(typeof xml.msGMLOutput["cultuurhistorische_elementen_p_layer"] !== 'undefined') {
			info = xml.msGMLOutput["cultuurhistorische_elementen_p_layer"][0]["cultuurhistorische_elementen_p_feature"][0].BETEKENIS[0];
			infos.push({label: 'Cultuurhistorisch element', value: info});
		}
		
		if(typeof xml.msGMLOutput["rijksmonumenten_p_layer"] !== 'undefined') {
			info = xml.msGMLOutput["rijksmonumenten_p_layer"][0]["rijksmonumenten_p_feature"][0].CBSCATEGOR[0];
			infos.push({label: 'Rijksmonument', value: info});
		}
		
		if(typeof xml.msGMLOutput["geologisch_monument_p_layer"] !== 'undefined') {
			info = xml.msGMLOutput["geologisch_monument_p_layer"][0]["geologisch_monument_p_feature"][0].TYPE[0];
			infos.push({label: 'Geologisch monument', value: info});
		}
		
		if(typeof xml.msGMLOutput["cultuurhistorische_elementen_l_layer"] !== 'undefined') {
			info = xml.msGMLOutput["cultuurhistorische_elementen_l_layer"][0]["cultuurhistorische_elementen_l_feature"][0].BETEKENIS[0];
			infos.push({label: 'Cultuurhistorisch element', value: info});
		}
		
		if(typeof xml.msGMLOutput["cultuurlandschap_zl_v_layer"] !== 'undefined') {
			info = xml.msGMLOutput["cultuurlandschap_zl_v_layer"][0]["cultuurlandschap_zl_v_feature"][0].GRONDGEBRUIK[0];
			infos.push({label: 'Grondgebruik', value: info});
		}
		
		if(typeof xml.msGMLOutput["panden_layer"] !== 'undefined') {
			info = xml.msGMLOutput["panden_layer"][0]["panden_feature"][0].BOUWJAAR[0];
			infos.push({label: 'Bouwjaar pand', value: info});
		}
		
		if(typeof xml.msGMLOutput["prov_archeol_aandachtsgeb_v_layer"] !== 'undefined') {
			info = xml.msGMLOutput["prov_archeol_aandachtsgeb_v_layer"][0]["prov_archeol_aandachtsgeb_v_feature"][0].GEBIED[0];
			infos.push({label: 'Provinciaal aandachtsgebied', value: info});
		}
		
		if(typeof xml.msGMLOutput["historische_buitenplaatsen_v_layer"] !== 'undefined') {
			info = xml.msGMLOutput["historische_buitenplaatsen_v_layer"][0]["historische_buitenplaatsen_v_feature"][0].NAAM[0];
			infos.push({label: 'Historische buitenplaats', value: info});
		}
		
		if(typeof xml.msGMLOutput["archeologische_monumenten_v_layer"] !== 'undefined') {
			info = xml.msGMLOutput["archeologische_monumenten_v_layer"][0]["archeologische_monumenten_v_feature"][0].COMPLEX[0];
			infos.push({label: 'Archeologisch monument', value: info});
		}
		
		return infos;
	}
});