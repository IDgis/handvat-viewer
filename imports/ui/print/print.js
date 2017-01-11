import './print.html';
import './print.css';

Template.print.onRendered(function() {
	var chapter = 4;
	var page = 5;
	
	if(Session.get('chapterDeelgebied')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Deelgebied - pagina ' + page + '</p>');
		page++;
	}
	
	if(Session.get('chapterBeginselen')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Leidende beginselen - pagina ' + page + '</p>');
		page += 2;
	}
	
	if(Session.get('chapterSector')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Sector - pagina ' + page + '</p>');
		page++;
	}
	
	if(Session.get('chapterOntwerpprincipes')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Ontwerpprincipes - pagina ' + page + '</p>');
	}
	
	var extent;
	var center;
	var coordinates;
	if(typeof Session.get('mapCoordinates') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
		coordinates = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('mapCenter');
		coordinates = Session.get('mapCoordinates');
	}
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: extent
	});
	
	var viewLocationCentered = new ol.View({
		projection: projection,
		center: coordinates,
		zoom: 2
	});
	
	var viewCoordinateCentered = new ol.View({
		projection: projection,
		center: center,
		zoom: 1
	});
	
	var zoomControl = new ol.control.Zoom();
	
	var top10Url = Meteor.settings.public.top10Service.url;
	var top10Layers = Meteor.settings.public.top10Service.layers;
	var top10Version = Meteor.settings.public.top10Service.version;
	
	var skUrl = Meteor.settings.public.landschapStructuurService.url;
	var skLayerId = Meteor.settings.public.landschapStructuurService[Session.get('area')];
	var skVersion = Meteor.settings.public.landschapStructuurService.version;
	
	addMapGroup(zoomControl, viewLocationCentered, 'map-print-location', top10Url, top10Layers, 
			top10Version, true);
	addMapLayer(zoomControl, viewCoordinateCentered, 'map-print-deelgebied', skUrl, skLayerId, 
			skVersion, false);
	addMapLayer(zoomControl, viewLocationCentered, 'map-print-beginselen', skUrl, skLayerId, 
			skVersion, true);
});

Template.print.helpers({
	getLocation: function() {
		return Session.get('location');
	},
	getTitle: function() {
		return Session.get('titleInitiative');
	},
	getName: function() {
		return Session.get('nameInitiator');
	},
	getDate: function() {
		var today = new Date();
		var todayDay = today.getDate();
		var todayMonth = today.getMonth() + 1;
		var todayYear = today.getFullYear();
		
		return todayDay + '-' + todayMonth + '-' + todayYear;
	},
	getSectorIcon: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextPrintFromTypeName', result.content, 'sector_icoon', Session.get('sectorName'), function(err, result) {
				if(typeof result !== 'undefined') {
					$('.print-location-sector-icon').append(result);
				}
			});
		});
	},
	getComment: function() {
		return Session.get('commentInitiator');
	},
	getDeelgebiedIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap3Deelgebied, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#print-deelgebied-general').append(result.contentPrint);
				}
			});
		});
	},
	getDeelgebiedText: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(typeof Session.get('area') !== 'undefined') {
				Meteor.call('getTextFromName', result.content, Session.get('area'), function(err, result) {
					if(typeof result !== 'undefined') {
						$('#print-deelgebied-text').append(result.contentPrint);
					} else {
						$('#print-deelgebied-text').append('U heeft geen valide deelgebied geselecteerd.');
					}
				});
			}
		});
	},
	getBeginselenIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap3Beginselen, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#print-beginselen-general').append(result.contentPrint);
				}
			});
		});
	},
	getBeginselen: function() {
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			var count = 1;
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/leidend/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getBeginselen', result.content, Session.get('landschapstypeId'), function(err, result) {
					$.each(result, function(index, item) {
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
							headers: {
								'Content-Type' : 'application/json; charset=UTF-8'
							}
						}, function(err, result) {
							Meteor.call('getTextFromId', result.content, item, function(err, result) {
								if(typeof result !== 'undefined') {
									$('#print-lb-' + count).append(result.contentPrint);
									count++;
								}
							});
						});
					});
				});
			});
		}
	},
	getSectorIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap4Links, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#print-sector-general').append(result.contentPrint);
				}
			});
		});
	}
});

function addMapGroup(zoomControl, view, target, url, layers, version, setMarker) {
	var map = new ol.Map({
		control: zoomControl,
		target: target,
		view: view
	});
	
	layers.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
				params: {'LAYERS': item, 'VERSION': version} 
			})
		});
		
		map.addLayer(layer);
	});
	
	if(setMarker) {
		setIcon(map, Session.get('mapCoordinates'));
	}
}

function addMapLayer(zoomControl, view, target, url, id, version, setMarker) {
	var map = new ol.Map({
		control: zoomControl,
		target: target,
		view: view
	});
	
	var layer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: url, 
			params: {'LAYERS': Meteor.settings.public.landschapStructuurService.layers[id], 
				'VERSION': version} 
		})
	});

	map.addLayer(layer);
	
	if(setMarker) {
		setIcon(map, Session.get('mapCoordinates'));
	}
}

function setIcon(map, coordinates) {
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
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
		
		iconFeature.setStyle(iconStyle);
		
		var vectorLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [iconFeature]
			})
		});
		
		map.addLayer(vectorLayer);
	}
}