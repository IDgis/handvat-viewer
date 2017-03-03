import './print.html';
import './print.css';

Template.print.onRendered(function() {
	var chapter = 5;
	var page = 5;
	
	if(Session.get('chapterDeelgebied')) {
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + 
				chapter + ' - Deelgebied - pagina ' + page + '</p>');
		chapter++;
		page++;
	}
	
	if(Session.get('chapterBeginselen')) {
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + 
				chapter + ' - Leidende beginselen - pagina ' + page + '</p>');
		chapter++;
		page += 2;
	}
	
	if(Session.get('chapterSector')) {
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + 
				chapter + ' - Sector - pagina ' + page + '</p>');
		chapter++;
		page++;
	}
	
	if(Session.get('chapterOntwerpprincipes')) {
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + 
				chapter + ' - Ontwerpprincipes - pagina ' + page + '</p>');
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
	
	var viewCoordinateCentered1 = new ol.View({
		projection: projection,
		center: center,
		zoom: 1
	});
	
	var viewCoordinateCentered2 = new ol.View({
		projection: projection,
		center: center,
		zoom: 2
	});
	
	var zoomControl = new ol.control.Zoom();
	
	var top10Url = Meteor.settings.public.top10Service.url;
	var top10Layers = Meteor.settings.public.top10Service.layers;
	var top10Version = Meteor.settings.public.top10Service.version;
	
	var skUrl = Meteor.settings.public.landschapStructuurService.url;
	var skLayerId = Meteor.settings.public.landschapStructuurService[Session.get('area')];
	var skVersion = Meteor.settings.public.landschapStructuurService.version;
	
	var reliefUrl = Meteor.settings.public.reliefService.url;
	var reliefLayers = Meteor.settings.public.reliefService.layers;
	var reliefVersion = Meteor.settings.public.reliefService.version;
	
	var openBeslotenUrl = Meteor.settings.public.openBeslotenService.url;
	var openBeslotenLayers = Meteor.settings.public.openBeslotenService.layers;
	var openBeslotenVersion = Meteor.settings.public.openBeslotenService.version;
	
	var cultuurHistorieUrl = Meteor.settings.public.cultuurhistorieService.url;
	var cultuurHistorieLayers = Meteor.settings.public.cultuurhistorieService.layers;
	var cultuurHistorieVersion = Meteor.settings.public.cultuurhistorieService.version;
	
	var groenKarakterUrl = Meteor.settings.public.groenKarakterService.url;
	var groenKarakterLayers = Meteor.settings.public.groenKarakterService.layers;
	var groenKarakterVersion = Meteor.settings.public.groenKarakterService.version;
	
	addMapGroup(zoomControl, viewLocationCentered, 'map-print-location', top10Url, top10Layers, 
			top10Version, true);
	addMapLayer(zoomControl, viewCoordinateCentered1, 'map-print-deelgebied', skUrl, skLayerId, 
			skVersion, false);
	addMapLayer(zoomControl, viewLocationCentered, 'map-print-beginselen', skUrl, skLayerId, 
			skVersion, true);
	addMapGroup(zoomControl, viewCoordinateCentered2, 'map-kk-r', reliefUrl, reliefLayers, 
			reliefVersion, true);
	addMapGroup(zoomControl, viewCoordinateCentered2, 'map-kk-ob', openBeslotenUrl, openBeslotenLayers, 
			openBeslotenVersion, true);
	addMapGroup(zoomControl, viewCoordinateCentered2, 'map-kk-ch', cultuurHistorieUrl, 
			cultuurHistorieLayers,  cultuurHistorieVersion, true);
	addMapGroup(zoomControl, viewCoordinateCentered2, 'map-kk-gk', groenKarakterUrl, groenKarakterLayers, 
			groenKarakterVersion, true);
});

Template.print.helpers({
	hideChapter: function(chapter) {
		if(!Session.get(chapter)) {
			return "hide-element";
		}
	},	
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
	getAppInleiding: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/start-links", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(typeof result.data !== 'undefined') {
				$('#print-app-inleiding').append(result.data.print);				
			}
		});
	},
	getSectorIcon: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/typename/sector_icoon/"
				+ Session.get('sectorName'), {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(typeof result.data[0] !== 'undefined') {
				$('.print-location-sector-icon').append(result.data[0].print);
			}
		});
	},
	getComment: function() {
		return Session.get('commentInitiator');
	},
	getDeelgebiedIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/" 
				+ Meteor.settings.public.stap3Deelgebied, {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#print-deelgebied-general').append(result.data.print);
			}
		});
	},
	getDeelgebiedText: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/name/" 
				+ Session.get('area'), {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(typeof result.data[0] !== 'undefined') {
				$('#print-deelgebied-text').append(result.data[0].print);
			} else {
				$('#print-deelgebied-text').append('U heeft geen valide deelgebied geselecteerd.');
			}
		});
	},
	getBeginselenIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
				+ Meteor.settings.public.stap3Beginselen, {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#print-beginselen-general').append(result.data.print);
			}
		});
	},
	getBeginselen: function() {
		var boolLtNotUndefined = typeof Session.get('landschapstypeId') !== 'undefined';
		var boolLtNotNull = Session.get('landschapstypeId') !== null;
		
		if(boolLtNotUndefined && boolLtNotNull) {
			var count = 1;
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/leidend/json/"
					+ Session.get('landschapstypeId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				$.each(result.data, function(index, item) {
					HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
							+ item, {
						headers: {
							'Content-Type' : 'application/json; charset=UTF-8'
						}
					}, function(err, res) {
						if(res.data !== null) {
							$('#print-lb-' + count).append(res.data.print);
							count++;
						}
					});
				});
			});
		}
	},
	getSectorIntro: function() {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/" + Session.get('sectorId'), {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#print-sector-general').append(result.data.print);
			}
		});
	},
	getKkText: function(kk) {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
				+ Meteor.settings.public[kk], {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#print-kk-' + kk + '-text').append(result.data.print);
			}
		});
	},
	getLegenda: function(kk, part) {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
				+ Meteor.settings.public[kk], {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				var legendaItem = result.data.name + '-' + part;
				
				HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/typename/legenda/"
						+ legendaItem, {
					headers: {
						'Content-Type' : 'application/json; charset=UTF-8'
					}
				}, function(err, res) {
					if(typeof res.data[0] !== 'undefined') {
						$('#print-kk-' + kk + '-legenda-' + part).append(res.data[0].print);
					}
				});
			}
		});
	},
	getOntwerpPrincipes: function() {
		$('#op-text-5').empty();
		var chapterOps = Session.get('chapterOntwerpprincipes');
		var boolLt = typeof Session.get('landschapstypeId') !== 'undefined' && 
						Session.get('landschapstypeId') !== null;
		var boolS = typeof Session.get('sectorId') !== 'undefined' && 
						Session.get('sectorId') !== null;
		
		if(chapterOps && boolLt && boolS) {
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/texttype/kernkwaliteit", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, res) {
				$.each(res.data, function(index, item) {
					createOpPages(item);
				});
			});
		}
	}
});

function createOpPages(item) {
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/ontwerp/json/" 
			+ Session.get('landschapstypeId') 
			+ "/"
			+ Session.get('sectorId')
			+ "/"
			+ item.id, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		var extraAmount = result.data.length - 6;
		var pages = 0;
		
		while(extraAmount > 0) {
			extraAmount -= 9;
			pages++;
		}
		
		var opPage = 1;
		
		for(var i = 0; i < pages; i++) {
			var outerDivKk = document.createElement('div');
			$(outerDivKk).attr('class', 'print-page');
			$(outerDivKk).attr('id', item.appCoupling + '-ops-' + (opPage + 1));
			
			var innerDivKk = document.createElement('div');
			$(innerDivKk).attr('class', 'col-xs-4 print-height-3');
			
			var textDivKk = document.createElement('div');
			$(textDivKk).attr('class', 'col-xs-12 print-height-1 print-op-' 
					+ item.appCoupling);
			
			$(textDivKk).clone().appendTo(innerDivKk);
			$(textDivKk).clone().appendTo(innerDivKk);
			$(textDivKk).clone().appendTo(innerDivKk);
			
			$(innerDivKk).clone().appendTo(outerDivKk);
			$(innerDivKk).clone().appendTo(outerDivKk);
			$(innerDivKk).clone().appendTo(outerDivKk);
			
			$('#' + item.appCoupling + '-ops-' + opPage).after(outerDivKk);
			opPage++;
		}
		
		var ops = $('.print-op-' + item.appCoupling);
		for(var j = 0; j < result.data.length; j++) {
			getOntwerpPrincipe(ops, j, result.data[j]);
		}
	});
}

function getOntwerpPrincipe(ops, item, id) {
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/" + id, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$(ops[item]).append(result.data.print);
		}
	});
}

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