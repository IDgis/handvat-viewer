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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap5Links, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#intro-text-5').append(result.content);
				}
			});
			
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
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
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
				$(image).attr('data-coupling', item.appCoupling);
				
				if(item.appCoupling === Meteor.settings.public.cultuurhistorie) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/ch.jpg');
				} else if(item.appCoupling === Meteor.settings.public.openbesloten) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/ob.jpg');
				} else if(item.appCoupling === Meteor.settings.public.relief) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/r.jpg');
				} else if(item.appCoupling === Meteor.settings.public.groenkarakter) {
					$(image).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + 
							window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/gk.jpg');
				}
				
				$('#js-kk-thumbnails-5').append(image);
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
			
			var polHeader = document.createElement('p');
			$(polHeader).attr('class', 'header');
			polHeader.innerHTML = 'POL';
			$('#js-overig-thumbnails-5').append(polHeader);
			
			var polImage = document.createElement('img');
			$(polImage).attr('id', 'pol-img');
			$(polImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
					'/' + Meteor.settings.public.domainSuffix + '/images/pol.png');
			$('#js-overig-thumbnails-5').append(polImage);
			
			var nbHeader = document.createElement('p');
			$(nbHeader).attr('class', 'header');
			nbHeader.innerHTML = 'Natuurbeheer';
			$('#js-overig-thumbnails-5').append(nbHeader);
			
			var nbImage = document.createElement('img');
			$(nbImage).attr('id', 'nb-img');
			$(nbImage).attr('src', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
					'/' + Meteor.settings.public.domainSuffix + '/images/nb.png');
			$('#js-overig-thumbnails-5').append(nbImage);
			
			setBorderThumbnail($('#landschapstype-img'));
		});
		
		setCursorDone();
	});
	
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
	
	setLufoLayers();
	
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
	
	Session.set('sliderValue-2', 100);
	$("#slider-id-5").slider({
		value: Session.get('sliderValue-2'),
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
			
			Session.set('sliderValue-2', ui.value);
		}
	});
	
	$('#kk-container-5').resize(setThumbnailSize);
});

Template.step_5.helpers({
	getKernKwaliteit: function() {
		$('#kk-text-5').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			setCursorInProgress();
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getTextFromId', result.content, Session.get('kernkwaliteitId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#kk-text-5').append(div);
					}
				});
				
				setCursorDone();
			});
		}
	},
	getOntwerpPrincipes: function() {
		$('#op-text-5').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null &&
				typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null &&
				typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			setCursorInProgress();
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/ontwerp/json", {
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
							
							HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getTextFromId', result.content, item, function(err, result) {
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
							
							HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getTextFromId', result.content, item, function(err, result) {
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
				
				setCursorDone();
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
	},
	chBaseLayerOptions: function() {
		if(!Session.get('chActive')) {
			return 'hide-element';
		}
	},
	disableElement: function() {
		if(typeof Session.get('mapCoordinates') === 'undefined' || Session.get('mapCoordinates') === null) {
			return 'disabled';
		}
	}
});

Template.step_5.events ({
	'click .kernkwaliteit-img': function(e) {
		var coupling = $(e.target).attr('data-coupling');
		Session.set('chActive', false);
		
		$('#ch-base-select-5')[0].options[0].selected = 'selected';
		
		if(coupling === Meteor.settings.public.openbesloten) {
			addServiceLayers(e.target.id, false, e.target, Meteor.settings.public.openBeslotenService.url, 
					Meteor.settings.public.openBeslotenService.layers, 
					Meteor.settings.public.openBeslotenService.version);
		} else if(coupling === Meteor.settings.public.cultuurhistorie) {
			addServiceLayers(e.target.id, false, e.target, Meteor.settings.public.cultuurhistorieService.url, 
					Meteor.settings.public.cultuurhistorieService.layers, 
					Meteor.settings.public.cultuurhistorieService.version);
			
			Session.set('chActive', true);
		} else if(coupling === Meteor.settings.public.relief) {
			addServiceLayers(e.target.id, false, e.target, Meteor.settings.public.reliefService.url, 
					Meteor.settings.public.reliefService.layers, 
					Meteor.settings.public.reliefService.version);
		} else if(coupling === Meteor.settings.public.groenkarakter) {
			addServiceLayers(e.target.id, false, e.target, Meteor.settings.public.groenKarakterService.url, 
					Meteor.settings.public.groenKarakterService.layers, 
					Meteor.settings.public.groenKarakterService.version);
		}
		
		var toponiemenUrl = Meteor.settings.public.toponiemenService.url;
		var toponiemenLayers = Meteor.settings.public.toponiemenService.layers;
		var toponiemenVersion = Meteor.settings.public.toponiemenService.version;
		
		toponiemenLayers.forEach(function(item) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: toponiemenUrl, 
					params: {'LAYERS': item, 'VERSION': toponiemenVersion} 
				})
			});
			
			map.addLayer(layer);
		});
	},
	'click #landschapstype-img': function(e) {
		addServiceLayers(null, true, e.target, Meteor.settings.public.landschapstypenService.url, 
				Meteor.settings.public.landschapstypenService.layers, 
				Meteor.settings.public.landschapstypenService.version);
		
		Session.set('chActive', false);
	},
	'click #pol-img': function(e) {
		addServiceLayers(null, false, e.target, Meteor.settings.public.polService.url, 
				Meteor.settings.public.polService.layers, Meteor.settings.public.polService.version);
		
		Session.set('chActive', false);
	},
	'click #nb-img': function(e) {
		addServiceLayers(null, false, e.target, Meteor.settings.public.natuurbeheerService.url, 
				Meteor.settings.public.natuurbeheerService.layers, Meteor.settings.public.natuurbeheerService.version);
		
		Session.set('chActive', false);
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
					params: {'LAYERS': item, 'VERSION': chVersion} 
				})
			});
			
			map.addLayer(layer);
		});
		
		setOpacity();
	},
	'click #set-location-center-5': function() {
		if(typeof Session.get('mapCoordinates') !== 'undefined' && Session.get('mapCoordinates') !== null) {
			map.getView().setCenter(Session.get('mapCoordinates'));
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
			if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
				if(index !== map.getLayers().getLength() - 1) {
					map.getLayers().item(index).setOpacity(Session.get('sliderValue-2') / 100);
				}
			} else {
				map.getLayers().item(index).setOpacity(Session.get('sliderValue-2') / 100);
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
				params: {'LAYERS': item, 'VERSION': versionLufo} 
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
				params: {'LAYERS': item, 'VERSION': versionTranchot} 
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

function addServiceLayers(kkId, ltActive, element, url, layers, version) {
	Session.set('kernkwaliteitId', kkId);
	Session.set('ltActive', ltActive);
	map.getLayers().clear();
	
	setBorderThumbnail(element);
	setLufoLayers();
	
	layers.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
				params: {'LAYERS': item, 'VERSION': version} 
			})
		});
		
		map.addLayer(layer);
	});
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	setOpacity()
}