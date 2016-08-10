import './step_5.html';
import './step_5.css';

Template.step_5.onRendered(function() {
	Session.set('stepNumber', '5');
	Session.set('ltActive', true);
	
	var ltHeader = document.createElement('p');
	$(ltHeader).attr('class', 'header');
	ltHeader.innerHTML = 'Landschapstype';
	$('#kk-container').append(ltHeader);
	
	var ltImage = document.createElement('img');
	$(ltImage).attr('id', 'landschapstype-img');
	$(ltImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
			'/' + Meteor.settings.public.domainSuffix + '/images/lt.png');
	$('#kk-container').append(ltImage);
	
	var ltImageWidth = $(ltImage).width();
	$(ltImage).css({'height':ltImageWidth + 'px'});
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'kernkwaliteit', function(err, result) {
			$.each(result, function(index, item) {
				var header = document.createElement('p');
				$(header).attr('class', 'header');
				header.innerHTML = item.name;
				$('#kk-container').append(header);
				
				var image = document.createElement('img');
				$(image).attr('class', 'kernkwaliteit-img');
				$(image).attr('id', item.id);
				
				if(item.id === Meteor.settings.public.cultuurhistorieId) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/ch.png');
				} else if(item.id === Meteor.settings.public.openBeslotenId) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/ob.png');
				} else if(item.id === Meteor.settings.public.reliefId) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/r.png');
				} else if(item.id === Meteor.settings.public.groenKarakterId) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/gk.png');
				}
				
				$('#kk-container').append(image);
				
				var width = $('#kk-container').width();
			});
			
			var imageKernkwaliteiten = $('.kernkwaliteit-img');
			$.each(imageKernkwaliteiten, function(index, item) {
				var width = $(item).width();
				$(item).css({'height':width + 'px'});
			});
		});
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
		target: 'map',
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
	}
	
	map.on('singleclick', function(evt) {
		if(typeof iconLayer !== 'undefined') {
			map.removeLayer(iconLayer);
		}
		
		iconLayer = getIcon(evt.coordinate);
		map.addLayer(iconLayer);
		
		if(Session.get('ltActive') === true) {
			var url = map.getLayers().item(Meteor.settings.public.landschapstypenService.indexLT)
				.getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
			
			Meteor.call('getLandschapsType', url, function(err, result) {
				if(result === 'Dalbodem') {
					Session.set('landschapstypeId', Meteor.settings.public.dalId);
					Session.set('mapCoordinates', evt.coordinate);
				} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
					Session.set('landschapstypeId', Meteor.settings.public.hellingId);
					Session.set('mapCoordinates', evt.coordinate);
				} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
						result === 'Geisoleerde heuvel') {
					Session.set('landschapstypeId', Meteor.settings.public.plateauId);
					Session.set('mapCoordinates', evt.coordinate);
				} else {
					Session.set('landschapstypeId', null);
					Session.set('mapCoordinates', null);
				}
			});
		}
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

Template.step_5.helpers({
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

Template.step_5.events ({
	'click .kernkwaliteit-img': function(e) {
		Session.set('kernkwaliteitId', e.target.id);
		Session.set('ltActive', false);
		
		var url;
		var layers;
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.openBeslotenId) {
			map.getLayers().clear();
			
			url = Meteor.settings.public.openBeslotenService.url;
			layers = Meteor.settings.public.openBeslotenService.layers;
			version = Meteor.settings.public.openBeslotenService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.cultuurhistorieId) {
			map.getLayers().clear();
			
			url = Meteor.settings.public.cultuurhistorieService.url;
			layers = Meteor.settings.public.cultuurhistorieService.layers;
			version = Meteor.settings.public.cultuurhistorieService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.reliefId) {
			map.getLayers().clear();
			
			url = Meteor.settings.public.reliefService.url;
			layers = Meteor.settings.public.reliefService.layers;
			version = Meteor.settings.public.reliefService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.groenKarakterId) {
			map.getLayers().clear();
			
			url = Meteor.settings.public.groenKarakterService.url;
			layers = Meteor.settings.public.groenKarakterService.layers;
			version = Meteor.settings.public.groenKarakterService.version;
		}
		
		layers.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: url, 
					params: {'LAYERS': item, 'VERSION': version} 
				})
			});
			
			map.addLayer(layer);
		});
	},
	'click #landschapstype-img': function(e) {
		Session.set('ltActive', true);
		map.getLayers().clear();
		
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
	}
});