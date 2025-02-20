import './step_5.html';
import './step_5.css';

Template.step_5.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', '5');
	Session.set('ltActive', true);
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	$(".modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
				+ Meteor.settings.public.stap5Links, {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#intro-text-5').append(result.data.html);
			}
			
			setCursorDone();
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
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/texttype/kernkwaliteit", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		$.each(result.data, function(index, item) {
			var image = document.createElement('img');
			$(image).attr('class', 'kernkwaliteit-img');
			$(image).attr('id', item.id);
			$(image).attr('data-coupling', item.appCoupling);
			
			if(item.appCoupling === Meteor.settings.public.cultuurhistorie) {
				$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
						window.location.port + '/' + Meteor.settings.public.domainSuffix + 
						'/images/ch.jpg');
				
				$('#js-kk-thumbnails-5').append(image);
			} else if(item.appCoupling === Meteor.settings.public.openbesloten) {
				$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
						window.location.port + '/' + Meteor.settings.public.domainSuffix + 
						'/images/ob.jpg');
				
				$('#js-kk-thumbnails-5').append(image);
			} else if(item.appCoupling === Meteor.settings.public.relief) {
				$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
						window.location.port + '/' + Meteor.settings.public.domainSuffix + 
						'/images/r.jpg');
				
				$('#js-kk-thumbnails-5').append(image);
			} else if(item.appCoupling === Meteor.settings.public.groenkarakter) {
				$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
						window.location.port + '/' + Meteor.settings.public.domainSuffix + 
						'/images/gk.jpg');
				
				$('#js-kk-thumbnails-5').append(image);
			}
		});
		
		var ltImage = document.createElement('img');
		$(ltImage).attr('id', 'landschapstype-img');
		$(ltImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/' + Meteor.settings.public.domainSuffix + '/images/lt.jpg');
		$('#js-overig-thumbnails-5').append(ltImage);
		
		var polImage = document.createElement('img');
		$(polImage).attr('id', 'pol-img');
		$(polImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/' + Meteor.settings.public.domainSuffix + '/images/pol.jpg');
		$('#js-overig-thumbnails-5').append(polImage);
		
		var nbImage = document.createElement('img');
		$(nbImage).attr('id', 'nb-img');
		$(nbImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/' + Meteor.settings.public.domainSuffix + '/images/nb.jpg');
		$('#js-overig-thumbnails-5').append(nbImage);
		
		setBorderThumbnail($('#landschapstype-img'));
		
		setCursorDone();
	});
	
	var extent;
	var center;
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapExtentCenter') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('mapExtentCenter');
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
	
	setLufoLayers();
	
	var urlLt = Meteor.settings.public.landschapstypenService.url;
	var layersLt = Meteor.settings.public.landschapstypenService.layers;
	var versionLt = Meteor.settings.public.landschapstypenService.version;
	
	layersLt.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlLt, 
				params: {'LAYERS': item.name, 'VERSION': versionLt, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
	
	if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('locationCoordinates'));
		map.addLayer(iconLayer);
	}
	
	Session.set('sliderValue-2', 100);
	$("#slider-id-5").slider({
		value: Session.get('sliderValue-2'),
		slide: function(e, ui) {
			$.each(map.getLayers().getArray(), function(index, item) {
				if(index !== 0) {
					if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
						if(index !== map.getLayers().getLength() - 1) {
							item.setOpacity(ui.value / 100);
						}
					} else {
						item.setOpacity(ui.value / 100);
					}
				}
			});
			
			Session.set('sliderValue-2', ui.value);
		}
	});
	
	$('#kk-container-5').resize(setThumbnailSize);
	
	map.on('singleclick', function(evt) {
		if(Session.get('cultuurActive') || Session.get('natuurbeheerActive')) {
			setCursorInProgress();
			$('#layer-popup-5').empty();
			$('#layer-popup-5').append('<div class="layer-popup-content">Gegevens opvragen...</div>');
		}
		
		if(Session.get('cultuurActive')) {
			var chLayerString = Meteor.settings.public.cultuurhistorieHoverableService.layers.map(function(item) {
				return item.name;
			}).join(',');
			var chLayer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: Meteor.settings.public.cultuurhistorieHoverableService.url, 
					params: {
						'LAYERS': chLayerString,  
						'VERSION': Meteor.settings.public.cultuurhistorieHoverableService.version,
						'FEATURE_COUNT': '20'
					}
				})
			});
			
			var chUrl = chLayer.getSource()
				.getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
						map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
			
			Meteor.call('getCultuurhistorieData', chUrl, function(err, result) {
				if(result.length !== 0) {
					$('#layer-popup-5').empty();
					
					result.forEach(function(item) {
						$('#layer-popup-5').append('<div class="layer-popup-content">'
							+ '<p class="negate-margin"><strong>' + item.label + ':</strong></p>'
							+ '<p class="negate-margin">'
							+ item.value +'</p></div>');
						$('#layer-popup-5').css({'display': 'block'});
					});
				} else {
					$('#layer-popup-5').css({'display': 'none'});
				}
				
				setCursorDone();
			});
		}
		
		if(Session.get('natuurbeheerActive')) {
			var nbLayerString = Meteor.settings.public.natuurbeheerplanService.layers.map(function(item) {
				return item.name;
			}).join(',');
			var nbLayer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: Meteor.settings.public.natuurbeheerplanService.url, 
					params: {
						'LAYERS': nbLayerString,  
						'VERSION': Meteor.settings.public.natuurbeheerplanService.version,
						'FEATURE_COUNT': '20'
					}
				})
			});
			
			var nbUrl = nbLayer.getSource()
				.getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
						map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
			
			Meteor.call('getBeheertypeData', nbUrl, function(err, result) {
				if(result.length !== 0) {
					$('#layer-popup-5').empty();
					
					result.forEach(function(item) {
						$('#layer-popup-5').append('<div class="layer-popup-content">'
							+ '<p class="negate-margin"><strong>Beheertype:</strong></p>'
							+ '<p class="negate-margin">' + item.code + '</p>'
							+ '<p class="negate-margin">' + item.info + '</p></div>');
						$('#layer-popup-5').css({'display': 'block'});
					});
				} else {
					$('#layer-popup-5').css({'display': 'none'});
				}
				
				setCursorDone();
			});
		}
	});
});

Template.step_5.helpers({
	getImageLink: function(filename) {
		return window.location.protocol + '//' + window.location.hostname + ':' + 
			window.location.port + '/' +  Meteor.settings.public.domainSuffix + '/images/' + filename;
	},
	getContentText: function() {
		setCursorInProgress();
		$('#content-text-5').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/"
					+ Session.get('kernkwaliteitId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				if(result.data !== null) {
					var div = document.createElement('div');
					$(div).attr('class', 'col-xs-12 text-div');
					$(div).append(result.data.html);
					$('#content-text-5').append(div);
				}
				
				setCursorDone();
			});
		} else if(typeof Session.get('overigKaartActive') !== 'undefined' &&
			Session.get('overigKaartActive') !== null) {
			
				HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
						+ Session.get('overigKaartActive'), {
					headers: {
						'Content-Type' : 'application/json; charset=UTF-8'
					}
				}, function(err, result) {
					if(result.data !== null) {
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.data.html);
						$('#content-text-5').append(div);
					}
					
					setCursorDone();
				});
		}
	},
	getOntwerpPrincipes: function() {
		$('#op-text-5').empty();
		
		var ltBln = typeof Session.get('landschapstypeId') !== 'undefined' && 
						Session.get('landschapstypeId') !== null;
		var sBln = typeof Session.get('sectorId') !== 'undefined' && 
						Session.get('sectorId') !== null;
		var kkBln = typeof Session.get('kernkwaliteitId') !== 'undefined' && 
						Session.get('kernkwaliteitId') !== null;
		
		if(ltBln && sBln && kkBln) {
			setCursorInProgress();
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/coupling/ontwerp/"
					+ Session.get('landschapstypeId')
					+ "/"
					+ Session.get('sectorId')
					+ "/"
					+ Session.get('kernkwaliteitId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				var itemCount = 1;
				var divCount = 0;
				
				$.each(result.data, function(index, item) {
					if(divCount === 0) {
						var outerDiv = document.createElement('div');
						$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
						$(outerDiv).attr('class', 'col-xs-12 text-div');
						
						var innerDivLeft = document.createElement('div');
						$(innerDivLeft).attr('class', 'col-xs-6 text-div');
						$('#op-text-5').append(outerDiv);
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/"
								+ item, {
							headers: {
								'Content-Type' : 'application/json; charset=UTF-8'
							}
						}, function(err, result) {
							if(result.data !== null) {
								$.each(result.data.images, function(ix, elt) {
									$(innerDivLeft).append(elt);
								});
								
								cleanImages('op-text-5');
								
								$(innerDivLeft).append(result.data.html);
							}
						});
						
						$(outerDiv).append(innerDivLeft);
						
						divCount++;
					} else {
						var innerDivRight = document.createElement('div');
						$(innerDivRight).attr('class', 'col-xs-6 text-div');
						$('#ontwerpprincipe-' + itemCount).append(innerDivRight);
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/"
								+ item, {
							headers: {
								'Content-Type' : 'application/json; charset=UTF-8'
							}
						}, function(err, result) {
							if(result.data !== null) {
								$.each(result.data.images, function(ix, elt) {
									$(innerDivRight).append(elt);
								});
								
								cleanImages('op-text-5');
								
								$(innerDivRight).append(result.data.html);
							}
						});
						
						itemCount++;
						divCount = 0;
					}
				});
				
				setCursorDone();
			});
		}
	},
	hideOpsButton: function() {
		var ltBln = typeof Session.get('landschapstypeId') === 'undefined' ||
					Session.get('landschapstypeId') === null;
		var sBln = typeof Session.get('sectorId') === 'undefined' || 
					Session.get('sectorId') === null;
		var kkBln = typeof Session.get('kernkwaliteitId') === 'undefined' || 
					Session.get('kernkwaliteitId') === null;
		
		if(ltBln || sBln || kkBln) {
			return 'hide-element';
		}
	},
	cultuurBaseLayerOptions: function() {
		if(!Session.get('cultuurActive')) {
			return 'hide-element';
		}
	},
	disableElement: function() {
		if(typeof Session.get('locationCoordinates') === 'undefined' || Session.get('locationCoordinates') === null) {
			return 'disabled';
		}
	}
});

Template.step_5.events ({
	'click .kernkwaliteit-img': function(e) {
		var coupling = $(e.target).attr('data-coupling');
		Session.set('overigKaartActive', null);
		Session.set('cultuurActive', false);
		Session.set('natuurbeheerActive', false);
		
		$('#ch-base-select-5')[0].options[0].selected = 'selected';
		
		if(coupling === Meteor.settings.public.openbesloten) {
			var openbesloten = {url: Meteor.settings.public.openBeslotenService.url,
					layers: Meteor.settings.public.openBeslotenService.layers, 
					version: Meteor.settings.public.openBeslotenService.version};
			
			addServiceLayers(e.target.id, false, e.target, [openbesloten]);
		} else if(coupling === Meteor.settings.public.cultuurhistorie) {
			var cultuur = {url: Meteor.settings.public.cultuurhistorieService.url,
					layers: Meteor.settings.public.cultuurhistorieService.layers, 
					version: Meteor.settings.public.cultuurhistorieService.version};
			
			addServiceLayers(e.target.id, false, e.target, [cultuur]);
			
			Session.set('cultuurActive', true);
		} else if(coupling === Meteor.settings.public.relief) {
			var relief = {url: Meteor.settings.public.reliefService.url,
					layers: Meteor.settings.public.reliefService.layers, 
					version: Meteor.settings.public.reliefService.version};
			
			addServiceLayers(e.target.id, false, e.target, [relief]);
		} else if(coupling === Meteor.settings.public.groenkarakter) {
			var groen = {url: Meteor.settings.public.groenKarakterService.url,
					layers: Meteor.settings.public.groenKarakterService.layers, 
					version: Meteor.settings.public.groenKarakterService.version};
			
			addServiceLayers(e.target.id, false, e.target, [groen]);
		}
		
		var toponiemenUrl = Meteor.settings.public.toponiemenService.url;
		var toponiemenLayers = Meteor.settings.public.toponiemenService.layers;
		var toponiemenVersion = Meteor.settings.public.toponiemenService.version;
		
		toponiemenLayers.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: toponiemenUrl, 
					params: {'LAYERS': item.name, 'VERSION': toponiemenVersion, 'STYLES': item.style} 
				})
			});
			
			map.addLayer(layer);
		});
	},
	'click #landschapstype-img': function(e) {
		var landschapstype = {url: Meteor.settings.public.landschapstypenService.url,
				layers: Meteor.settings.public.landschapstypenService.layers, 
				version: Meteor.settings.public.landschapstypenService.version};
		
		addServiceLayers(null, true, e.target, [landschapstype]);
		
		Session.set('overigKaartActive', Meteor.settings.public.landschapstypen);
		Session.set('cultuurActive', false);
		Session.set('natuurbeheerActive', false);
	},
	'click #pol-img': function(e) {
		var pol = {url: Meteor.settings.public.polService.url,
				layers: Meteor.settings.public.polService.layers, 
				version: Meteor.settings.public.polService.version};
		
		var natura2000 = {url: Meteor.settings.public.natura2000Service.url,
				layers: Meteor.settings.public.natura2000Service.layers, 
				version: Meteor.settings.public.natura2000Service.version};
		
		var masker = {url: Meteor.settings.public.maskerZuidLimburgService.url,
				layers: Meteor.settings.public.maskerZuidLimburgService.layers, 
				version: Meteor.settings.public.maskerZuidLimburgService.version};
		
		addServiceLayers(null, false, e.target, [pol, natura2000, masker]);
		
		Session.set('overigKaartActive', Meteor.settings.public.pol);
		Session.set('cultuurActive', false);
		Session.set('natuurbeheerActive', false);
	},
	'click #nb-img': function(e) {
		var beheerplan = {url: Meteor.settings.public.natuurbeheerplanService.url,
				layers: Meteor.settings.public.natuurbeheerplanService.layers, 
				version: Meteor.settings.public.natuurbeheerplanService.version};
		
		var natura2000 = {url: Meteor.settings.public.natura2000Service.url,
				layers: Meteor.settings.public.natura2000Service.layers, 
				version: Meteor.settings.public.natura2000Service.version};
		
		addServiceLayers(null, false, e.target, [beheerplan, natura2000]);
		
		Session.set('overigKaartActive', Meteor.settings.public.natuurbeheerplan);
		Session.set('cultuurActive', false);
		Session.set('natuurbeheerActive', true);
	},
	'change #ch-base-select-5': function(e) {
		map.getLayers().clear();
		
		if(e.target.value === 'Luchtfoto') {
			setLufoLayers();
		} else if(e.target.value === 'Tranchot') {
			setTranchotLayers();
		}
		
		var chUrl = Meteor.settings.public.cultuurhistorieService.url;
		var chVersion = Meteor.settings.public.cultuurhistorieService.version;
		var chLayers = Meteor.settings.public.cultuurhistorieService.layers;
		
		chLayers.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: chUrl, 
					params: {'LAYERS': item.name, 'VERSION': chVersion, 'STYLES': item.style} 
				})
			});
			
			map.addLayer(layer);
		});
		
		setOpacity();
	},
	'click #set-location-center-5': function() {
		if(typeof Session.get('locationCoordinates') !== 'undefined' && Session.get('locationCoordinates') !== null) {
			map.getView().setCenter(Session.get('locationCoordinates'));
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

function getIcon(coordinates) {
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
			anchor: [0.5, 32],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/' +  Meteor.settings.public.domainSuffix + '/images/location.svg',
			size: [32, 32]
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
			if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
				if(index !== map.getLayers().getLength() - 1) {
					item.setOpacity(Session.get('sliderValue-2') / 100);
				}
			} else {
				item.setOpacity(Session.get('sliderValue-2') / 100);
			}
		}
	});
}

function setLufoLayers() {
	var urlLufo = Meteor.settings.public.luchtfotoService.url;
	var layersLufo = Meteor.settings.public.luchtfotoService.layers;
	var versionLufo = Meteor.settings.public.luchtfotoService.version;
	
	layersLufo.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlLufo, 
				params: {'LAYERS': item.name, 'VERSION': versionLufo, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
}

function setTranchotLayers() {
	var urlTranchot = Meteor.settings.public.tranchotService.url;
	var layersTranchot = Meteor.settings.public.tranchotService.layers;
	var versionTranchot = Meteor.settings.public.tranchotService.version;
	
	layersTranchot.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlTranchot, 
				params: {'LAYERS': item.name, 'VERSION': versionTranchot, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
}

function setThumbnailSize() {
	var thumbnails = $('#kk-container-5 img');
	$.each(thumbnails, function(index, item) {
		var width = $(item).width();
		$(item).css({'height':width + 'px'});
	});
}

function addServiceLayers(kkId, ltActive, element, layerObjects) {
	Session.set('kernkwaliteitId', kkId);
	Session.set('ltActive', ltActive);
	
	map.getLayers().clear();
	
	setBorderThumbnail(element);
	setLufoLayers();
	
	layerObjects.forEach(function(item) {
		item.layers.forEach(function(layer) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: item.url, 
					params: {'LAYERS': layer.name, 'VERSION': item.version, 'STYLES': layer.style} 
				})
			});
			
			map.addLayer(layer);
		})
	});
	
	if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('locationCoordinates'));
		map.addLayer(iconLayer);
	}
	
	setOpacity()
}