import './print.html';
import './print.css';

Template.print.onRendered(function() {
	$(".modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	$('#print-modal').modal();
	
	var chapter = 4;
	var page = 5;
	
	writeChapterPage('Hoofdstuk ' + chapter + ' - Deelgebied');
	if(Session.get('chapterDeelgebied')) {
		writeChapterPage('Pagina ' + page);
		
		chapter++;
		page++;
	} else {
		writeChapterPage('niet weergegeven');
	}
	
	writeChapterPage('Hoofdstuk ' + chapter + ' - Leidende beginselen');
	if(Session.get('chapterBeginselen')) {
		writeChapterPage('Pagina ' + page);
		
		chapter++;
		page += 4;
	} else {
		writeChapterPage('niet weergegeven');
	}
	
	writeChapterPage('Hoofdstuk ' + chapter + ' - Sector');
	if(Session.get('chapterSector')) {
		writeChapterPage('Pagina ' + page);
		
		chapter++;
		page++;
	} else {
		writeChapterPage('niet weergegeven');
	}
	
	writeChapterPage('Hoofdstuk ' + chapter + ' - Ontwerpprincipes');
	if(Session.get('chapterOntwerpprincipes')) {
		writeChapterPage('Pagina ' + page);
	} else {
		writeChapterPage('niet weergegeven');
	}
	
	var extent;
	var extentCenter;
	var locationCoordinates;
	
	if(typeof Session.get('locationCoordinates') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		extentCenter = [188856, 322443];
		locationCoordinates = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		extentCenter = Session.get('mapExtentCenter');
		locationCoordinates = Session.get('locationCoordinates');
	}
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: extent
	});
	
	var viewLocationCentered = new ol.View({
		projection: projection,
		center: locationCoordinates,
		zoom: 3
	});
	
	var viewExtentCentered = new ol.View({
		projection: projection,
		center: extentCenter,
		zoom: 1
	});
	
	var viewKernkwaliteit = new ol.View({
		projection: projection,
		center: locationCoordinates,
		zoom: 6
	});
	
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
	
	addMapGroup(viewLocationCentered, 'map-print-location', top10Url, top10Layers, 
			top10Version, true);
	addMapLayer(viewExtentCentered, 'map-print-deelgebied', skUrl, skLayerId, 
			skVersion, false);
	addMapLayer(viewLocationCentered, 'map-print-beginselen', skUrl, skLayerId, 
			skVersion, true);
	addMapGroup(viewKernkwaliteit, 'map-kk-r', reliefUrl, reliefLayers, 
			reliefVersion, true);
	addMapGroup(viewKernkwaliteit, 'map-kk-ob', openBeslotenUrl, openBeslotenLayers, 
			openBeslotenVersion, true);
	addMapGroup(viewKernkwaliteit, 'map-kk-ch', cultuurHistorieUrl, 
			cultuurHistorieLayers,  cultuurHistorieVersion, true);
	addMapGroup(viewKernkwaliteit, 'map-kk-gk', groenKarakterUrl, groenKarakterLayers, 
			groenKarakterVersion, true);
	
	writePageNumbers();
});

Template.print.helpers({
	getImageLink: function(filename) {
		return window.location.protocol + '//' + window.location.hostname + ':' + 
			window.location.port + '/' +  Meteor.settings.public.domainSuffix + '/images/' + filename;
	},
	hideChapter: function(chapter) {
		if(!Session.get(chapter)) {
			return "hide-element";
		}
	},	
	setPageNrClass: function(chapter) {
		if(Session.get(chapter)) {
			return "page-number";
		} else {
			return "page-number-hide";
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/start-links", {
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/typename/sector_icoon/"
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/" 
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/name/" 
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
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
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/coupling/leidend/"
					+ Session.get('landschapstypeId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				$.each(result.data, function(index, item) {
					HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/"
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/" + Session.get('sectorId'), {
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
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
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
				+ Meteor.settings.public[kk], {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				var legendaItem = result.data.name + '-' + part;
				
				HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/typename/legenda/"
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
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/texttype/kernkwaliteit", {
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
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/coupling/ontwerp/" 
			+ Session.get('landschapstypeId') 
			+ "/"
			+ Session.get('sectorId')
			+ "/"
			+ item.id, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		var extraAmount;
		var opPage;
		
		if(item.appCoupling === 'kernkwaliteit-cultuurhistorie') {
			extraAmount = result.data.length - 4;
			opPage = 2;
		} else {
			extraAmount = result.data.length;
			opPage = 0;
		}
		
		var pages = 0;
		
		while(extraAmount > 0) {
			extraAmount -= 3;
			pages++;
		}
		
		for(var i = 0; i < pages; i++) {
			var outerDivKk = document.createElement('div');
			$(outerDivKk).attr('class', 'print-page');
			$(outerDivKk).attr('id', item.appCoupling + '-ops-' + (opPage + 1));
			
			var innerDivKk = document.createElement('div');
			$(innerDivKk).attr('class', 'col-xs-4 print-height-3 print-op-' 
					+ item.appCoupling);
			
			$(innerDivKk).clone().appendTo(outerDivKk);
			$(innerDivKk).clone().appendTo(outerDivKk);
			$(innerDivKk).clone().appendTo(outerDivKk);
			
			$(outerDivKk).append('<div class="page-number"></div>');
			
			if(opPage === 0) {
				$('#' + item.appCoupling + '-main').after(outerDivKk);
			} else {
				$('#' + item.appCoupling + '-ops-' + opPage).after(outerDivKk);
			}
			
			writePageNumbers();
			
			opPage++;
		}
		
		var ops = $('.print-op-' + item.appCoupling);
		for(var j = 0; j < result.data.length; j++) {
			getOntwerpPrincipe(ops, j, result.data[j]);
		}
	});
}

function getOntwerpPrincipe(ops, item, id) {
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/id/" + id, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$(ops[item]).append(result.data.print);
		}
	});
}

function addMapGroup(view, target, url, layers, version, setMarker) {
	var map = new ol.Map({
		controls: [],
		interactions: ol.interaction.defaults({mouseWheelZoom: false}),
		target: target,
		view: view
	});
	
	map.getInteractions().forEach(function(interaction) {
		map.removeInteraction(interaction);
	});
	
	layers.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
				params: {'LAYERS': item.name, 'VERSION': version, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
	
	if(setMarker) {
		setIcon(map, Session.get('locationCoordinates'));
	}
}

function addMapLayer(view, target, url, id, version, setMarker) {
	var map = new ol.Map({
		controls: [],
		interactions: ol.interaction.defaults({mouseWheelZoom: false}),
		target: target,
		view: view
	});
	
	map.getInteractions().forEach(function(interaction) {
		map.removeInteraction(interaction);
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
		setIcon(map, Session.get('locationCoordinates'));
	}
}

function setIcon(map, coordinates) {
	if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
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

function writeChapterPage(value) {
	$('#print-index').append('<div class="col-xs-6"><div class="negate-margin">' + 
			value + '</div></div>');
}

function writePageNumbers() {
	var pageNumbers = $('.page-number');
	
	$.each(pageNumbers, function(index, item) {
		$(item).html(index + 1);
	});
}