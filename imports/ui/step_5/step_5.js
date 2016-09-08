import './step_5.html';
import './step_5.css';

Template.step_5.onRendered(function() {
	Session.set('stepNumber', '5');
	Session.set('ltActive', true);
	$('#tabs-main-img').attr('src', '../images/step_5.jpg');
	$('#tabs-main').attr('style', 'margin-top:3px;position:relative;top:0;');
	$('#page').attr('style', 'height:75%;');
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getText', result.content, Meteor.settings.public.step5Text, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#intro-text-5').append(result.content);
				}
			});
		});
	} else {
		if((typeof Session.get('area') === 'undefined' || Session.get('area') === null) &&
				(typeof Session.get('sectorId') === 'undefined' || Session.get('sectorId') === null)) {
			$('#intro-text-5').append('U heeft geen valide deelgebied en geen sector geselecteerd.');
		} else if(typeof Session.get('area') === 'undefined' || Session.get('area') === null) {
			$('#intro-text-5').append('U heeft geen valide deelgebied geselecteerd.');
		} else if(typeof Session.get('sectorId') === 'undefined' || Session.get('sectorId') === null) {
			$('#intro-text-5').append('U heeft geen sector geselecteerd.');
		}
	}
	
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
				$('#js-kk-thumbnails-5').append(header);
				
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
				
				$('#js-kk-thumbnails-5').append(image);
			});
			
			var imageKernkwaliteiten = $('.kernkwaliteit-img');
			$.each(imageKernkwaliteiten, function(index, item) {
				var width = $(item).width();
				$(item).css({'height':width + 'px'});
			});
		});
	});
	
	var ltHeader = document.createElement('p');
	$(ltHeader).attr('class', 'header');
	ltHeader.innerHTML = 'Landschapstype';
	$('#js-overig-thumbnails-5').append(ltHeader);
	
	var ltImage = document.createElement('img');
	$(ltImage).attr('id', 'landschapstype-img');
	$(ltImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
			'/' + Meteor.settings.public.domainSuffix + '/images/lt.png');
	$('#js-overig-thumbnails-5').append(ltImage);
	
	var ltImageWidth = $(ltImage).width();
	$(ltImage).css({'height':ltImageWidth + 'px'});
	
	var polHeader = document.createElement('p');
	$(polHeader).attr('class', 'header');
	polHeader.innerHTML = 'POL';
	$('#js-overig-thumbnails-5').append(polHeader);
	
	var polImage = document.createElement('img');
	$(polImage).attr('id', 'pol-img');
	$(polImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
			'/' + Meteor.settings.public.domainSuffix + '/images/pol.png');
	$('#js-overig-thumbnails-5').append(polImage);
	
	var polImageWidth = $(polImage).width();
	$(polImage).css({'height':polImageWidth + 'px'});
	
	setBorderThumbnail($('#landschapstype-img'));
	
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCenter') === 'undefined') {
		var extent = [165027, 306558, 212686, 338329];
		var center = [188856, 322443];
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
		target: 'map-5',
		view: view
	});
	
	var urlLufo = Meteor.settings.public.luchtfotoService.url;
	var layersLufo = Meteor.settings.public.luchtfotoService.layers;
	var versionLufo = Meteor.settings.public.luchtfotoService.version;
	
	layersLufo.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlLufo, 
				params: {'LAYERS': item, 'VERSION': versionLufo} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var urlLt = Meteor.settings.public.landschapstypenService.url;
	var layersLt = Meteor.settings.public.landschapstypenService.layers;
	var versionLt = Meteor.settings.public.landschapstypenService.version;
	
	layersLt.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlLt, 
				params: {'LAYERS': item, 'VERSION': versionLt} 
			})
		});
		
		map.addLayer(layer);
	});
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	Session.set('sliderValue', 100);
	$("#slider-id").slider({
		value: Session.get('sliderValue'),
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
			
			Session.set('sliderValue', ui.value);
		}
	});
	

	$("#op-modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	map.on('singleclick', function(evt) {
		Session.set('mapCoordinates', evt.coordinate);
		
		if(typeof iconLayer !== 'undefined') {
			map.removeLayer(map.getLayers().item(map.getLayers().getLength() - 1));
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
					Session.set('landschapstypeName', 'Dal');
				} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
					Session.set('landschapstypeId', Meteor.settings.public.hellingId);
					Session.set('mapCoordinates', evt.coordinate);
					Session.set('landschapstypeName', 'Helling');
				} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
						result === 'Geisoleerde heuvel') {
					Session.set('landschapstypeId', Meteor.settings.public.plateauId);
					Session.set('mapCoordinates', evt.coordinate);
					Session.set('landschapstypeName', 'Plateau');
				} else {
					Session.set('landschapstypeId', null);
					Session.set('mapCoordinates', null);
					Session.set('landschapstypeName', null);
				}
			});
		}
	});
});

Template.step_5.helpers({
	getKernKwaliteit: function() {
		$('#kk-text-5').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('kernkwaliteitId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#kk-text-5').append(div);
					}
				});
			});
		}
	},
	getOntwerpPrincipes: function() {
		$('#op-text-5').empty();
		
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
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#op-text-5').append(outerDiv);
							
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
										
										cleanImages('op-text-5');
										
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
										
										cleanImages('op-text-5');
										
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
	hideOpsButton: function() {
		if(typeof Session.get('landschapstypeId') === 'undefined' || 
				Session.get('landschapstypeId') === null ||
				typeof Session.get('sectorId') === 'undefined' || 
				Session.get('sectorId') === null ||
				typeof Session.get('kernkwaliteitId') === 'undefined' || 
				Session.get('kernkwaliteitId') === null) {
			return 'hide-element';
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
		
		setBorderThumbnail(e.target);
		
		var urlKk;
		var layersKk;
		var versionKk;
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.openBeslotenId) {
			map.getLayers().clear();
			
			urlKk = Meteor.settings.public.openBeslotenService.url;
			layersKk = Meteor.settings.public.openBeslotenService.layers;
			versionKk = Meteor.settings.public.openBeslotenService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.cultuurhistorieId) {
			map.getLayers().clear();
			
			urlKk = Meteor.settings.public.cultuurhistorieService.url;
			layersKk = Meteor.settings.public.cultuurhistorieService.layers;
			versionKk = Meteor.settings.public.cultuurhistorieService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.reliefId) {
			map.getLayers().clear();
			
			urlKk = Meteor.settings.public.reliefService.url;
			layersKk = Meteor.settings.public.reliefService.layers;
			versionKk = Meteor.settings.public.reliefService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.groenKarakterId) {
			map.getLayers().clear();
			
			urlKk = Meteor.settings.public.groenKarakterService.url;
			layersKk = Meteor.settings.public.groenKarakterService.layers;
			versionKk = Meteor.settings.public.groenKarakterService.version;
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.openBeslotenId ||
				Session.get('kernkwaliteitId') === Meteor.settings.public.cultuurhistorieId ||
				Session.get('kernkwaliteitId') === Meteor.settings.public.reliefId ||
				Session.get('kernkwaliteitId') === Meteor.settings.public.groenKarakterId) {
			var urlLufo = Meteor.settings.public.luchtfotoService.url;
			var layersLufo = Meteor.settings.public.luchtfotoService.layers;
			var versionLufo = Meteor.settings.public.luchtfotoService.version;
			
			layersLufo.forEach(function(item) {
				var layer = new ol.layer.Image({
					source: new ol.source.ImageWMS({
						url: urlLufo, 
						params: {'LAYERS': item, 'VERSION': versionLufo} 
					})
				});
				
				map.addLayer(layer);
			});
			
			layersKk.forEach(function(item) {
				var layer = new ol.layer.Image({
					source: new ol.source.ImageWMS({
						url: urlKk, 
						params: {'LAYERS': item, 'VERSION': versionKk} 
					})
				});
				
				map.addLayer(layer);
			});
		}
		
		if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
			iconLayer = getIcon(Session.get('mapCoordinates'));
			map.addLayer(iconLayer);
		}
		
		setOpacity();
	},
	'click #landschapstype-img': function(e) {
		Session.set('kernkwaliteitId', null);
		Session.set('ltActive', true);
		map.getLayers().clear();
		
		setBorderThumbnail(e.target);
		
		var urlLufo = Meteor.settings.public.luchtfotoService.url;
		var layersLufo = Meteor.settings.public.luchtfotoService.layers;
		var versionLufo = Meteor.settings.public.luchtfotoService.version;
		
		layersLufo.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: urlLufo, 
					params: {'LAYERS': item, 'VERSION': versionLufo} 
				})
			});
			
			map.addLayer(layer);
		});
		
		var urlLt = Meteor.settings.public.landschapstypenService.url;
		var layersLt = Meteor.settings.public.landschapstypenService.layers;
		var versionLt = Meteor.settings.public.landschapstypenService.version;
		
		layersLt.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: urlLt, 
					params: {'LAYERS': item, 'VERSION': versionLt} 
				})
			});
			
			map.addLayer(layer);
		});
		
		if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
			iconLayer = getIcon(Session.get('mapCoordinates'));
			map.addLayer(iconLayer);
		}
		
		setOpacity();
	},
	'click #pol-img': function(e) {
		Session.set('kernkwaliteitId', null);
		Session.set('ltActive', false);
		map.getLayers().clear();
		
		setBorderThumbnail(e.target);
		
		var urlLufo = Meteor.settings.public.luchtfotoService.url;
		var layersLufo = Meteor.settings.public.luchtfotoService.layers;
		var versionLufo = Meteor.settings.public.luchtfotoService.version;
		
		layersLufo.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: urlLufo, 
					params: {'LAYERS': item, 'VERSION': versionLufo} 
				})
			});
			
			map.addLayer(layer);
		});
		
		var urlPol = Meteor.settings.public.polService.url;
		var layersPol = Meteor.settings.public.polService.layers;
		var versionPol = Meteor.settings.public.polService.version;
		
		layersPol.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: urlPol, 
					params: {'LAYERS': item, 'VERSION': versionPol} 
				})
			});
			
			map.addLayer(layer);
		});
		
		if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
			iconLayer = getIcon(Session.get('mapCoordinates'));
			map.addLayer(iconLayer);
		}
		
		setOpacity();
	},
	'click #js-previous-5': function() {
		Router.go('step_4');
	},
	'click #js-next-5': function() {
		Router.go('step_6');
	}
});

function getIcon(coordinates) {
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

function setBorderThumbnail(target) {
	var context = $('#kk-container-5')[0];
	var images = $('img', context);
	$.each(images, function(index, item) {
		$(item).removeAttr('style');
	});
	
	$(target).attr('style', 'border:1px solid black;');
}

function setOpacity() {
	$.each(map.getLayers().getArray(), function(index, item) {
		if(index !== 0) {
			if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
				if(index !== map.getLayers().getLength() - 1) {
					map.getLayers().item(index).setOpacity(Session.get('sliderValue') / 100);
				}
			} else {
				map.getLayers().item(index).setOpacity(Session.get('sliderValue') / 100);
			}
		}
	});
}