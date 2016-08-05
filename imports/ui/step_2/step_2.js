import './step_2.html';
import './step_2.css';

Template.step_2.onRendered(function() {
	Session.set('stepNumber', '2');
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [167658.241026781, 307862.821900462, 208090.624144334, 339455.907872023]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [187000, 323000],
		zoom: 2
	});
	
	var source = new ol.source.ImageWMS({
		url: 'http://portal.prvlimburg.nl/geoservices/landschapstypen?', 
		params: {'LAYERS': 'landschapstypen_v', 'VERSION': '1.1.1'} 
	})
	
	var achtergrond = new ol.layer.Image({
		source: source
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		layers: [
	      achtergrond
		],
		control: zoomControl,
		target: 'map',
		view: view
	});
	
	map.on('singleclick', function(evt) {
		var url = source.getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getLandschapsType', url, function(err, result) {
			if(result === 'Dalbodem') {
				Session.set('landschapstypeId', Meteor.settings.public.dalId);
				Session.set('mapCoordinates', evt.coordinate);
				Router.go('step_3');
			} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
				Session.set('landschapstypeId', Meteor.settings.public.hellingId);
				Session.set('mapCoordinates', evt.coordinate);
				Router.go('step_3');
			} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
					result === 'Geisoleerde heuvel') {
				Session.set('landschapstypeId', Meteor.settings.public.plateauId);
				Session.set('mapCoordinates', evt.coordinate);
				Router.go('step_3');
			} else {
				Session.set('landschapstypeId', null);
				Session.set('mapCoordinates', null);
			}
		});
	});
});