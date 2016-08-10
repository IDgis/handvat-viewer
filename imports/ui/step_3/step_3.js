import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
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
		target: 'map-3',
		view: view
	});
	
	var url = Meteor.settings.public.landschapStructuurService.url;
	var layers = Meteor.settings.public.landschapStructuurService.layers;
	var version = Meteor.settings.public.landschapStructuurService.version;
	
	layers.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
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