import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCenter') === 'undefined') {
		var extent = [167658.241026781, 307862.821900462, 208090.624144334, 339455.907872023];
		var center = [187000, 323000];
	} else {
		var extent = Session.get('mapExtent');
		var center = Session.get('mapCenter');
	}
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: extent
	});
	
	var view = new ol.View({
		projection: projection,
		center: center,
		zoom: 2
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		control: zoomControl,
		target: 'map-3',
		view: view
	});
	
	var url = Meteor.settings.public.landschapStructuurService.url;
	var layers = Meteor.settings.public.landschapStructuurService.layers;
	var version = Meteor.settings.public.landschapStructuurService.version;
	
	var areaLayer;
	var layerId;
	
	if(Session.get('area') === 'Baneheide' || Session.get('area') === 'Bekken van Heerlen' || 
			Session.get('area') === 'Doenrade' || Session.get('area') === 'Eperheide' || 
			Session.get('area') === 'Geleenbeek' || Session.get('area') === 'Geuldal' || 
			Session.get('area') === 'Maasdal' || Session.get('area') === 'Maasterras Gronsveld' || 
			Session.get('area') === 'Margraten' || Session.get('area') === 'Roode Beek' || 
			Session.get('area') === 'Schimmert' || Session.get('area') === 'Ubachsberg' || 
			Session.get('area') === 'Vijlenerbos') {
		
		if(Session.get('area') === 'Baneheide') {
			layerId = Meteor.settings.public.landschapStructuurService.indexBH;
		} else if(Session.get('area') === 'Bekken van Heerlen') {
			layerId = Meteor.settings.public.landschapStructuurService.indexH;
		} else if(Session.get('area') === 'Doenrade') {
			layerId = Meteor.settings.public.landschapStructuurService.indexDR;
		} else if(Session.get('area') === 'Eperheide') {
			layerId = Meteor.settings.public.landschapStructuurService.indexEH;
		} else if(Session.get('area') === 'Geleenbeek') {
			layerId = Meteor.settings.public.landschapStructuurService.indexGB;
		} else if(Session.get('area') === 'Geuldal') {
			layerId = Meteor.settings.public.landschapStructuurService.indexGD;
		} else if(Session.get('area') === 'Maasdal') {
			layerId = Meteor.settings.public.landschapStructuurService.indexMD;
		} else if(Session.get('area') === 'Maasterras Gronsveld') {
			layerId = Meteor.settings.public.landschapStructuurService.indexMG;
		} else if(Session.get('area') === 'Margraten') {
			layerId = Meteor.settings.public.landschapStructuurService.indexM;
		} else if(Session.get('area') === 'Roode Beek') {
			layerId = Meteor.settings.public.landschapStructuurService.indexRB;
		} else if(Session.get('area') === 'Schimmert') {
			layerId = Meteor.settings.public.landschapStructuurService.indexS;
		} else if(Session.get('area') === 'Ubachsberg') {
			layerId = Meteor.settings.public.landschapStructuurService.indexUB;
		} else if(Session.get('area') === 'Vijlenerbos') {
			layerId = Meteor.settings.public.landschapStructuurService.indexVB;
		}
		
		areaLayer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
				params: {'LAYERS': Meteor.settings.public.landschapStructuurService.layers[layerId], 
					'VERSION': version} 
			})
		});
		
		map.addLayer(areaLayer);
	}
	
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