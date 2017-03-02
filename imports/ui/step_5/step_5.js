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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
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
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/texttype/kernkwaliteit", {
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
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCenter') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('mapCenter');
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
});

Template.step_5.helpers({
	getKernKwaliteit: function() {
		$('#kk-text-5').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			setCursorInProgress();
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
					+ Session.get('kernkwaliteitId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				if(result.data !== null) {
					var div = document.createElement('div');
					$(div).attr('class', 'col-xs-12 text-div');
					$(div).append(result.data.html);
					$('#kk-text-5').append(div);
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
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/ontwerp/json/"
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
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
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
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
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
			var openbesloten = {url: Meteor.settings.public.openBeslotenService.url,
					layers: Meteor.settings.public.openBeslotenService.layers, 
					version: Meteor.settings.public.openBeslotenService.version};
			
			addServiceLayers(e.target.id, false, e.target, [openbesloten]);
		} else if(coupling === Meteor.settings.public.cultuurhistorie) {
			var cultuur = {url: Meteor.settings.public.cultuurhistorieService.url,
					layers: Meteor.settings.public.cultuurhistorieService.layers, 
					version: Meteor.settings.public.cultuurhistorieService.version};
			
			addServiceLayers(e.target.id, false, e.target, [cultuur]);
			
			Session.set('chActive', true);
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
					params: {'LAYERS': item, 'VERSION': toponiemenVersion} 
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
		
		Session.set('chActive', false);
	},
	'click #pol-img': function(e) {
		var pol = {url: Meteor.settings.public.polService.url,
			layers: Meteor.settings.public.polService.layers, 
			version: Meteor.settings.public.polService.version};
		
		var natura2000 = {url: Meteor.settings.public.natura2000Service.url,
				layers: Meteor.settings.public.natura2000Service.layers, 
				version: Meteor.settings.public.natura2000Service.version};
		
		addServiceLayers(null, false, e.target, [pol, natura2000]);
		
		Session.set('chActive', false);
	},
	'click #nb-img': function(e) {
		var natuurbeheer = {url: Meteor.settings.public.natuurbeheerService.url,
				layers: Meteor.settings.public.natuurbeheerService.layers, 
				version: Meteor.settings.public.natuurbeheerService.version};
		
		var beheerplan2017 = {url: Meteor.settings.public.natuurbeheerplan2017Service.url,
				layers: Meteor.settings.public.natuurbeheerplan2017Service.layers, 
				version: Meteor.settings.public.natuurbeheerplan2017Service.version};
		
		var natura2000 = {url: Meteor.settings.public.natura2000Service.url,
				layers: Meteor.settings.public.natura2000Service.layers, 
				version: Meteor.settings.public.natura2000Service.version};
		
		addServiceLayers(null, false, e.target, [natuurbeheer, beheerplan2017, natura2000]);
		
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

function addServiceLayers(kkId, ltActive, element, layerObjects) {
	Session.set('kernkwaliteitId', kkId);
	Session.set('ltActive', ltActive);
	
	map.getLayers().clear();
	
	setBorderThumbnail(element);
	setLufoLayers();
	
	layerObjects.forEach(function(item) {
		item.layers.forEach(function(layername) {
			var layer = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: item.url, 
					params: {'LAYERS': layername, 'VERSION': item.version} 
				})
			});
			
			map.addLayer(layer);
		})
	});
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	setOpacity()
}