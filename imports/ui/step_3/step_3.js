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
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(({
				anchor: [0.5, 32],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.75,
				src: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
					'/images/location.svg'
			}))
		});
		
		var iconGeometry = new ol.geom.Point(Session.get('mapCoordinates'));
		var iconFeature = new ol.Feature({
			geometry: iconGeometry
		});
		
		var vectorSource = new ol.source.Vector({
			features: [iconFeature]
		});
		
		var vectorLayer = new ol.layer.Vector({
			source: vectorSource
		});
		
		iconFeature.setStyle(iconStyle);
		map.addLayer(vectorLayer);
	}
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'kernkwaliteit', function(err, result) {
			var select = $('select[id=js-temp-kernkwaliteiten]');
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
});

Template.step_3.helpers({
	getLandschapsType: function() {
		$('#lt-text').empty();
		
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
						$('#lt-text').append(header);
						
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#lt-text').append(div);
					}
				});
			});
		}
	},
	getKernKwaliteit: function() {
		$('#kk-text').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('kernkwaliteitId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var header = document.createElement('p');
						$(header).attr('class', 'header');
						header.innerHTML = 'Kernkwaliteit';
						$('#kk-text').append(header);
						
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#kk-text').append(div);
					}
				});
			});
		}
	},
	getLeidendeBeginselen: function() {
		$('#lb-text').empty();
		
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
						if(index === 0) {
							var header = document.createElement('p');
							$(header).attr('class', 'header');
							header.innerHTML = 'Leidende beginselen';
							$('#lb-text').append(header);
						}
						
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'leidendbeginsel-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#lb-text').append(outerDiv);
							
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
										
										cleanImages('lb-text');
										
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
										
										cleanImages('lb-text');
										
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
	getOntwerpPrincipes: function() {
		$('#op-text').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null &&
				typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null &&
				typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/coupling/ontwerp/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getOntwerpen', result.content, 
						Session.get('landschapstypeId'), 
						Session.get('sectorId'),
						Session.get('kernkwaliteitId'),
						function(err, result) {
					
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						if(index === 0) {
							var header = document.createElement('p');
							$(header).attr('class', 'header');
							header.innerHTML = 'Ontwerpprincipes';
							$('#op-text').append(header);
						}
						
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#op-text').append(outerDiv);
							
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
										
										cleanImages('op-text');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							$(outerDiv).append(innerDiv);
							
							divCount++;
						
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#ontwerpprincipe-' + itemCount).append(innerDiv);
							
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
										
										cleanImages('op-text');
										
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

Template.step_3.events ({
	'change #js-temp-kernkwaliteiten': function(e) {
		Session.set('kernkwaliteitId', e.target.value);
	}
});