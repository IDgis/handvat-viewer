import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
	$(function () {
		$('[data-toggle="popover"]').popover()
	});
	
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
	
	$("#slider-id").slider({
		value: 100,
		slide: function(e, ui) {
			$.each(map.getLayers().getArray(), function(index, item) {
				if(index !== 0) {
					if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
						if(index !== map.getLayers().getLength() - 1) {
							map.getLayers().item(index).setOpacity(ui.value / 100);
						}
					} else {
						map.getLayers().item(index).setOpacity(ui.value / 100);
					}
				}
			});
		}
	});
	
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

Template.step_4.helpers({
	getLandschapsType: function() {
		$('#lt-text-4').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('landschapstypeId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var header = document.createElement('p');
						$(header).attr('class', 'header');
						header.innerHTML = 'Landschapstype';
						$('#lt-text-4').append(header);
						
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#lt-text-4').append(div);
					}
				});
			});
		}
	},
	getLeidendeBeginselen: function() {
		$('#lb-text-4').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/coupling/leidend/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getBeginselen', result.content, Session.get('landschapstypeId'), function(err, result) {
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'leidendbeginsel-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#lb-text-4').append(outerDiv);
							
							HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getText', result.content, item, function(err, result) {
									if(typeof result !== 'undefined') {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										cleanImages('lb-text-4');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							$(outerDiv).append(innerDiv);
							
							divCount++;
						
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#leidendbeginsel-' + itemCount).append(innerDiv);
							
							HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getText', result.content, item, function(err, result) {
									if(typeof result !== 'undefined') {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										cleanImages('lb-text-4');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							itemCount++;
							divCount = 0;
						}
					});
				});
			});
		}
	},
	disableLbBtn: function() {
		if(typeof Session.get('landschapstypeId') === 'undefined' || Session.get('landschapstypeId') === null) {
			return 'disabled';
		}
	}
});

function cleanImages(div) {
	$.each($('#' + div + ' img'), function(index, item) {
		var src = $(item).attr('src');
		
		if(typeof src === 'undefined') {
			$(item).remove();
		} else {
			$(item).removeAttr('style');
			$(item).attr('class', 'text-div-img');
		}
	});
}