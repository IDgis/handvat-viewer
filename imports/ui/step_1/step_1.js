import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'landschapstype', function(err, result) {
			var select = $('select[id=js-temp-landschapstypen]');
			$.each(select, function(index, item) {
				item.add(document.createElement('option'));
				$.each(result, function(idx, el) {
					var option = document.createElement('option');
					option.value = el.id;
					option.innerHTML = el.name;
					item.add(option);
				});
			});
		});
	});
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:3857',
		extent: [627711.40229, 6577222.42737, 665723.28171, 6594426.06664]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [652711, 6607222],
		zoom: 1
	});
	
	var source = new ol.source.ImageWMS({
		url: 'http://editor.giscloud.com/wms/036ba84367d91f4165512da8e044f502',
		params: {'LAYERS': '1551591:Deelgebieden', 'VERSION': '1.1.1'}
	})
	
	var laag = new ol.layer.Image({
		source: source
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		layers: [
		         laag
		],
		control: zoomControl,
		target: 'map',
		view: view
	});
	
	map.on('singleclick', function(evt) {
		var url = source.getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'text/plain'});
		
		console.log(url);
	});
});

Template.step_1.events ({
	'change #js-temp-landschapstypen': function(e) {
		Session.set('landschapstypeId', e.target.value);
		Router.go('step_3');
	}
});