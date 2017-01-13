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
			Meteor.call('getTextFromTypeName', result.content, 'sector_icoon', Session.get('sectorName'), function(err, result) {
				if(typeof result !== 'undefined') {
					$('.print-location-sector-icon').append(result.contentPrint);
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
			Meteor.call('getTextFromId', result.content, Session.get('sectorId'), function(err, result) {
				if(typeof result !== 'undefined') {
					$('#print-sector-general').append(result.contentPrint);
				}
			});
		});
	},
	getKkText: function(kk) {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public[kk], function(err, result) {
				if(typeof result !== 'undefined') {
					$('#print-kk-' + kk + '-text').append(result.contentPrint);
				}
			});
		});
	},
	getLegenda: function(kk, part) {
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			var json = result.content;
			
			Meteor.call('getTextFromCoupling', json, Meteor.settings.public[kk], function(err, result) {
				if(typeof result !== 'undefined') {
					var legendaItem = result.name + '-' + part;
					Meteor.call('getTextFromTypeName', json, 'legenda', legendaItem, function(err, result) {
						if(typeof result !== 'undefined') {
							$('#print-kk-' + kk + '-legenda-' + part).append(result.content);
						}
					});
				}
			});
		});
	},
	getOntwerpPrincipes: function() {
		$('#op-text-5').empty();
		var ltBln = typeof Session.get('landschapstypeId') !== 'undefined' && 
						Session.get('landschapstypeId') !== null;
		var sBln = typeof Session.get('sectorId') !== 'undefined' && 
						Session.get('sectorId') !== null;
		
		if(ltBln && sBln) {
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, res) {
				var json = res.content;
				
				Meteor.call('getTexts', 
						json, 'kernkwaliteit', 
						function(err, obj) {
					if(typeof obj !== 'undefined') {
						for(var h = 0; h < obj.length; h++) {
							createOpPages(obj[h]);
						}
					}
				});
			});
		}
	}
});

function createOpPages(item) {
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/ontwerp/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getOntwerpen', result.content, 
				Session.get('landschapstypeId'), 
				Session.get('sectorId'),
				item.id,
				function(err, result) {
			
			var extraAmount = result.length - 6;
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
			for(var j = 0; j < result.length; j++) {
				getOntwerpPrincipe(ops, j, result[j]);
			}
		});
	});
}

function getOntwerpPrincipe(ops, item, id) {
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, res) {
		var json = res.content;
		
		Meteor.call('getTextFromId', 
				json, id, 
				function(err, obj) {
			if(typeof obj !== 'undefined') {
				$(ops[item]).append(obj.content);
			}
		});
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