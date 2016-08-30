import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [167658.241026781, 307862.821900462, 208090.624144334, 339455.907872023]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [187000, 323000],
		zoom: 2
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		control: zoomControl,
		target: 'map-2',
		view: view
	});
	
	var urlDG = Meteor.settings.public.deelgebiedenService.urlDG;
	var layersDG = Meteor.settings.public.deelgebiedenService.layersDG;
	var version = Meteor.settings.public.deelgebiedenService.version;
	
	layersDG.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlDG, 
				params: {'LAYERS': item, 'VERSION': version} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var urlSK = Meteor.settings.public.deelgebiedenService.urlSK;
	var layersSK = Meteor.settings.public.deelgebiedenService.layersSK;
	var version = Meteor.settings.public.deelgebiedenService.version;
	
	layersSK.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlSK, 
				params: {'LAYERS': item, 'VERSION': version} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
			anchor: [0.5, 32],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/' +  Meteor.settings.public.domainSuffix + '/images/location.svg'
		}))
	});
	
	var iconLayer;
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	map.on('singleclick', function(evt) {
		if(typeof iconLayer !== 'undefined') {
			map.removeLayer(iconLayer);
		}
		
		Session.set('mapCoordinates', evt.coordinate);
		iconLayer = getIcon(evt.coordinate);
		map.addLayer(iconLayer);
		
		var url = map.getLayers().item(Meteor.settings.public.deelgebiedenService.indexDG)
				.getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getDeelgebied', url, function(err, result) {
			if(result === 'Doenrade') {
				var extent = [186871, 325595, 195806, 334149];
				var center = [191338, 329872];
			} else if(result === 'Schimmert') {
				var extent = [179746, 319052, 190223,328561];
				var center = [184984, 323806];
			} else if(result === 'Margraten') {
				var extent = [179143, 307181, 190422, 321341];
				var center = [184782, 314261];
			} else if(result === 'Maasterras Gronsveld') {
				var extent = [178000, 312344, 182095, 321937];
				var center = [180227, 317040];
			} else if(result === 'Ubachsberg') {
				var extent = [189833, 314940, 198236, 321304];
				var center = [194034, 318122];
			} else if(result === 'Eperheide') {
				var extent = [188254, 306598, 193192, 316372];
				var center = [191119, 310435];
			} else if(result === 'Vijlenerbos') {
				var extent = [192945, 306833, 200189, 313472];
				var center = [196567, 310152];
			} else if(result === 'Baneheide') {
				var extent = [192636, 312343, 198545, 316508];
				var center = [195590, 314425];
			}
			
			if(result === 'Doenrade' || result === 'Schimmert' || result === 'Margraten' || 
					result === 'Maasterras Gronsveld' || result === 'Ubachsberg' || result === 'Eperheide' ||
					result === 'Vijlenerbos' || result === 'Baneheide') {
				Session.set('mapExtent', extent);
				Session.set('mapCenter', center);
				Session.set('area', result);
				
				if(typeof Session.get('sectorId') === 'undefined') {
					var sectorElement = $('#sector-dropdown-label');
					$.each(sectorElement, function(index, item) {
						$(item).css({'color':'#BF3F3F'});
						$(item).css({'border':'1px solid black'});
						$(item).css({'font-weight':'bold'});
					});
				}
			}
		});
	});
	
	function getIcon(coordinates) {
		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(coordinates)
		});
		
		var vectorLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [iconFeature]
			})
		});
		
		iconFeature.setStyle(iconStyle);
		
		return vectorLayer;
	}
});