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
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromTypeName', result.content, 'sector_icoon', Session.get('sectorName'), function(err, result) {
			if(typeof result !== 'undefined') {
				$('#print-location-sector-icon').append(result);
			}
		});
	});
	
	var extent;
	var center;
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCoordinates') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('mapCoordinates');
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
	
	var viewDeelgebied = new ol.View({
		projection: projection,
		center: center,
		zoom: 1
	});
	
	var zoomControl = new ol.control.Zoom();
	
	addLocationMap(zoomControl, view);
	addDeelgebiedMap(zoomControl, viewDeelgebied);
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
	}
});

function addLocationMap(zoomControl, view) {
	var mapLocation = new ol.Map({
		control: zoomControl,
		target: 'map-print-location',
		view: view
	});
	
	var urlTop10 = Meteor.settings.public.top10Service.url;
	var layersTop10 = Meteor.settings.public.top10Service.layers;
	var versionTop10 = Meteor.settings.public.top10Service.version;
	
	layersTop10.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlTop10, 
				params: {'LAYERS': item, 'VERSION': versionTop10} 
			})
		});
		
		mapLocation.addLayer(layer);
	});
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('mapCoordinates'));
		mapLocation.addLayer(iconLayer);
	}
}

function addDeelgebiedMap(zoomControl, view) {
	var mapDeelgebied = new ol.Map({
		control: zoomControl,
		target: 'map-print-deelgebied',
		view: view
	});
	
	var url = Meteor.settings.public.landschapStructuurService.url;
	var version = Meteor.settings.public.landschapStructuurService.version;
	var layerId = Meteor.settings.public.landschapStructuurService[Session.get('area')];
	
	var areaLayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: url, 
			params: {'LAYERS': Meteor.settings.public.landschapStructuurService.layers[layerId], 
				'VERSION': version} 
		})
	});
	
	mapDeelgebied.addLayer(areaLayer);
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