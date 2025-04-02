import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getDeelgebied: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		if(xml['wfs:FeatureCollection']['gml:featureMember']) {
			return xml['wfs:FeatureCollection']['gml:featureMember'][0]['LANDSCHAP:DEELGEBIEDEN_V'][0]['LANDSCHAP:OMSCHRIJVI'][0].trim();
		}
	},
	getLandschapsType: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		if(xml['wfs:FeatureCollection']['gml:featureMember']) {
			var lt = xml['wfs:FeatureCollection']['gml:featureMember'][0]['LANDSCHAP:LANDSCHAPSTYPEN_V'][0]['LANDSCHAP:TYPE'][0];
			var texts = HTTP.get(Meteor.settings.public.hostname + '/handvat-admin/api/texts');
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
		return xml.WMS_Capabilities.Capability[0].Layer[0].Layer;
	},
	getBeheertypeData: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		
		var infos = [];
		var code;
		var info;

		var layerName = Meteor.settings.public.natuurbeheerplanService.layers[0].name;
		var layerFieldType = Meteor.settings.public.natuurbeheerplanService.layers[0].fields.type;
		var layerFieldTypeDescription = Meteor.settings.public.natuurbeheerplanService.layers[0].fields.typeDescription;
		
		if(xml['wfs:FeatureCollection']['gml:featureMember']) {
			xml['wfs:FeatureCollection']['gml:featureMember'].forEach(function(featureMember) {
				code = featureMember['NATUUR:' + layerName][0]['NATUUR:' + layerFieldType][0];
				info = featureMember['NATUUR:' + layerName][0]['NATUUR:' + layerFieldTypeDescription][0];
				
				infos.push({'code': code, 'info': info});
			});
		}
		
		return infos;
	},
	getCultuurhistorieData: function(url) {
		var res = HTTP.get(url);
		var xml = xml2js.parseStringSync(res.content);
		var infos = [];
		
		var featureInfoItems = [
			{layer: 'LANDSCHAP:CULTUURHISTORISCHE_ELEMENTEN_P_handvat_kernkwaliteiten', field: 'LANDSCHAP:BETEKENIS', label: 'Cultuurhistorisch element'},
			{layer: 'LANDSCHAP:RIJKSMONUMENTEN_P_handvat_kernkwaliteiten', field: 'LANDSCHAP:HOOFDCATEGORIE', label: 'Rijksmonument'},
			{layer: 'LANDSCHAP:GEOLOGISCH_MONUMENT_P', field: 'LANDSCHAP:TYPE', label: 'Geologisch monument'},
			{layer: 'LANDSCHAP:CULTUURHISTORISCHE_ELEMENTEN_L_handvat_kernkwaliteiten', field: 'LANDSCHAP:BETEKENIS', label: 'Cultuurhistorisch element'},
			{layer: 'LANDSCHAP:CULTUURLANDSCHAP_ZL_V_handvat_kernkwaliteiten', field: 'LANDSCHAP:GRONDGEBRUIK', label: 'Grondgebruik'},
			{layer: 'LANDSCHAP:PANDEN_handvat_kernkwaliteiten', field: 'LANDSCHAP:BOUWJAAR', label: 'Bouwjaar pand'},
			{layer: 'LANDSCHAP:PROV_ARCHEOL_AANDACHTSGEB_V_handvat_kernkwaliteiten', field: 'LANDSCHAP:GEBIED', label: 'Provinciaal aandachtsgebied'},
			{layer: 'LANDSCHAP:HISTORISCHE_BUITENPLAATSEN_V_handvat_kernkwaliteiten', field: 'LANDSCHAP:NAAM', label: 'Historische buitenplaats'},
			{layer: 'LANDSCHAP:ARCHEOLOG_MONUMENT_COMPLEX_V_handvat_kernkwaliteiten', field: 'LANDSCHAP:COMPLEX', label: 'Archeologisch monument'}
		];
		
		if(xml['wfs:FeatureCollection']['gml:featureMember']) {
			featureInfoItems.forEach(function(featureInfoItem) {
				xml['wfs:FeatureCollection']['gml:featureMember'].forEach(function(featureMember) {
					if(featureMember[featureInfoItem.layer]) {
						var info = featureMember[featureInfoItem.layer][0][featureInfoItem.field][0];
						infos.push({label: featureInfoItem.label, value: info});
					}
				});
			});
		}
		
		return infos;
	}
});