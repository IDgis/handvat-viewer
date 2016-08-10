import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
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
		target: 'map-4',
		view: view
	});
	
	var url = Meteor.settings.public.landschapstypenService.url;
	var layers = Meteor.settings.public.landschapstypenService.layers;
	var version = Meteor.settings.public.landschapstypenService.version;
	
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
		setLandschapstypeId(Session.get('mapCoordinates'));
	}
	
	map.on('singleclick', function(evt) {
		if(typeof iconLayer !== 'undefined') {
			map.removeLayer(iconLayer);
		}
		
		Session.set('mapCoordinates', evt.coordinate);
		iconLayer = getIcon(evt.coordinate);
		map.addLayer(iconLayer);
		
		setLandschapstypeId(evt.coordinate);
	});
	
	function setLandschapstypeId(coordinates) {
		var url = map.getLayers().item(Meteor.settings.public.landschapstypenService.indexLT)
					.getSource().getGetFeatureInfoUrl(coordinates, map.getView().getResolution(), 
					map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getLandschapsType', url, function(err, result) {
			if(result === 'Dalbodem') {
				Session.set('landschapstypeId', Meteor.settings.public.dalId);
				Session.set('mapCoordinates', coordinates);
			} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
				Session.set('landschapstypeId', Meteor.settings.public.hellingId);
				Session.set('mapCoordinates', coordinates);
			} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
					result === 'Geisoleerde heuvel') {
				Session.set('landschapstypeId', Meteor.settings.public.plateauId);
				Session.set('mapCoordinates', coordinates);
			} else {
				Session.set('landschapstypeId', null);
				Session.set('mapCoordinates', null);
			}
		});
	}
	
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