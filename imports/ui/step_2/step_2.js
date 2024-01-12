import './step_2.html';
import './step_2.css';

Template.step_2.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', '2');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$(".modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	if(typeof Session.get('area') === 'undefined' || Session.get('area') === null) {
		$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
		$('#js-next-icon').attr('style', 'color:grey !important;');
	} else {
		$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
		$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	}
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
			+ Meteor.settings.public.stap2Links, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#text-2').append(result.data.html);
		}
		
		setCursorDone();
	});
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [165027, 306558, 212686, 338329]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [188856, 322443],
		zoom: 2
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		control: zoomControl,
		target: 'map-2',
		view: view
	});

	var ltLayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: Meteor.settings.public.landschapstypenService.url,
			opacity: 0,
			params: {'LAYERS': Meteor.settings.public.landschapstypenService.layers[0].name, 
				'VERSION': Meteor.settings.public.landschapstypenService.version} 
		})
	});
	
	map.addLayer(ltLayer);
	map.getLayers().item(0).setOpacity(0);
	
	var urlTop10 = Meteor.settings.public.top10Service.url;
	var layersTop10 = Meteor.settings.public.top10Service.layers;
	var versionTop10 = Meteor.settings.public.top10Service.version;
	
	layersTop10.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlTop10, 
				params: {'LAYERS': item.name, 'VERSION': versionTop10, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var urlInfrastructuur = Meteor.settings.public.infrastructuurService.url;
	var versionInfrastructuur = Meteor.settings.public.infrastructuurService.version;
	var layersInfrastructuur = Meteor.settings.public.infrastructuurService.layers;
	
	layersInfrastructuur.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlInfrastructuur, 
				params: {'LAYERS': item.name, 'VERSION': versionInfrastructuur, 'STYLES': item.style} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var url = Meteor.settings.public.deelgebiedenService.url;
	var layers = Meteor.settings.public.deelgebiedenService.layers;
	var version = Meteor.settings.public.deelgebiedenService.version;
	
	layers.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: url, 
				params: {'LAYERS': item.name, 'VERSION': version, 'STYLES': item.style} 
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
				'/' +  Meteor.settings.public.domainSuffix + '/images/location.svg',
			size: [32, 32]
		}))
	});
	
	var iconLayer;
	
	if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
		iconLayer = getIcon(Session.get('locationCoordinates'), iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
	}
	
	var kadGemeentes = Meteor.settings.public.kadGemeentes;
	
	kadGemeentes.forEach(function(item) {
		var option = '<option value="' + item.value + '">' + item.label + '</option>';
		$('#js-cadastre-kadgem').append(option);
	});
	
	$("#slider-id-2").slider({
		value: 100,
		slide: function(e, ui) {
			$.each(map.getLayers().getArray(), function(index, item) {
				if(index > 11) {
					if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
						if(index !== map.getLayers().getLength() - 1) {
							item.setOpacity(ui.value / 100);
						}
					} else {
						item.setOpacity(ui.value / 100);
					}
				}
			});
		}
	});
	
	map.on('singleclick', function(evt) {
		if(Session.get('iconLayerSet') === true) {
			map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
		}
		
		getDeelgebied(evt.coordinate);
		
		Session.set('location', 'x-coördinaat: ' + evt.coordinate[0] + ' | y-coördinaat: ' + evt.coordinate[1]);
		Session.set('locationCoordinates', evt.coordinate);
		setLandschapstypeId(Session.get('locationCoordinates'));
		iconLayer = getIcon(evt.coordinate, iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
	});
});

Template.step_2.helpers ({
	disableElement: function() {
		if(typeof Session.get('locationCoordinates') === 'undefined' || Session.get('locationCoordinates') === null) {
			return 'disabled';
		}
	}
});

Template.step_2.events ({
	'keyup #js-address-suggest': function(e) {
		setCursorInProgress();
		$('#js-address-results').empty();
		
		var queryInput = e.target.value;
		if(!!queryInput) {
			var url = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=" + 
				queryInput + 
				"&fq=type:adres&fq=provincienaam:limburg&sort=sortering%20asc&rows=5";
			
			Meteor.call('executeLocatieServerSuggest', url, function(err, results) {
				$('#js-address-results').empty();
				results.forEach(function(result) {
					var addressSuggestItem = '<p data-id="' + result.id + '" class="js-address-suggest-item">' + result.name + '</p>';
					$('#js-address-results').append(addressSuggestItem);
				});
			});
		}
		
		setCursorDone();
	},
	'click .js-address-suggest-item': function(e) {
		setCursorInProgress();
		
		var clickedItem = e.target;
		var suggestItemId = $(clickedItem).attr("data-id");
		
		Session.set('location', clickedItem.innerHTML);
		
		var url = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=" + suggestItemId;
		
		Meteor.call('executeLocatieServerLookup', url, function(err, result) {
			if(result) {
				if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
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
				
				var center = [result.x, result.y];
				Session.set('locationCoordinates', center);
				setLandschapstypeId(center);
				var iconLayer = getIcon(center, iconStyle);
				map.addLayer(iconLayer);
				Session.set('iconLayerSet', true);
				getDeelgebied(center);
			} else {
				if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
				Session.set('iconLayerSet', false);
			}
		});
		
		setCursorDone();
	},
	'change #js-cadastre-kadgem': function(e) {
		setCursorInProgress();
		
		$('#js-cadastre-kadsek').css('display', 'none');
		$('#js-cadastre-kadobj').css('display', 'none');
		
		$('#js-cadastre-kadsek').empty();
		$('#js-cadastre-kadobj').empty();
		
		$('#js-cadastre-kadsek').append('<option value="none">--</option>');
		$('#js-cadastre-kadobj').append('<option value="none">--</option>');
		
		var sections = Meteor.settings.public.kadGemeentes;
		sections.forEach(function(item) {
			if(e.target.value === item.value) {
				item.sections.forEach(function(item) {
					var option = '<option value="' + item + '">' + item + '</option>';
					$('#js-cadastre-kadsek').append(option);
				});
			}
		});
		 
		if(e.target.value !== 'none') {
			$('#js-cadastre-kadsek').css('display', 'block');
		}
		
		setCursorDone();
	},
	'change #js-cadastre-kadsek': function(e) {
		setCursorInProgress();
		
		$('#js-cadastre-kadobj').css('display', 'none');
		$('#js-cadastre-kadobj').empty();
		$('#js-cadastre-kadobj').append('<option value="none">--</option>');
		
		var url = "https://portal.prvlimburg.nl/geodata/KADASTER/wfs?" +
			"TYPENAME=KADASTER:V_KAD_ONRRND_ZK_BRK20&" +
			"VERSION=2.0.0&" +
			"SERVICE=WFS&" +
			"REQUEST=GetFeature&" +
			"FILTER=" +
			"%3CFilter%20xmlns%3D%27http%3A%2F%2Fwww.opengis.net%2Fogc%27%3E%3C" +
			"And%3E%3C" +
			"PropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%0A%3C" +
			"PropertyName%3EGEMEENTECODE%3C%2F" +
			"PropertyName%3E%3C" +
			"Literal%3E" +
			$('#js-cadastre-kadgem')[0].value + 
			"%3C%2F" +
			"Literal%3E%3C%2F" +
			"PropertyIsEqualTo%3E%3C" +
			"PropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%3C" +
			"PropertyName%3ESECTIE%3C%2F" +
			"PropertyName%3E%3C" +
			"Literal%3E" +
			e.target.value +
			"%3C%2F" +
			"Literal%3E%3C%2F" +
			"PropertyIsEqualTo%3E%3C%2F" +
			"And%3E%3C%2F" +
			"Filter%3E";
		
		Meteor.call('getCadastreObjects', url, function(err, result) {
			result.forEach(function(item) {
				var option = '<option value="' + item + '">' + item + '</option>';
				$('#js-cadastre-kadobj').append(option);
			});
			
			if(e.target.value !== 'none') {
				$('#js-cadastre-kadobj').css('display', 'block');
			}
			
			setCursorDone();
		});
	},
	'change #js-cadastre-kadobj': function(e) {
		setCursorInProgress();
		
		if(e.target.value !== 'none') {
			var kadgem = $('#js-cadastre-kadgem')[0].value;
			var kadsek = $('#js-cadastre-kadsek')[0].value;
			var kadobj = $('#js-cadastre-kadobj')[0].value;
			
			Session.set('location', kadgem + kadsek + ' ' + kadobj);
		}
		
		var url = "https://portal.prvlimburg.nl/geodata/KADASTER/wfs?" +
			"TYPENAME=KADASTER:V_KAD_ONRRND_ZK_BRK20&" +
			"VERSION=2.0.0&" +
			"SERVICE=WFS&" +
			"REQUEST=GetFeature&" +
			"FILTER=%3CFilter%20xmlns%3D%27http%3A%2F%2Fwww.opengis.net%2Fogc%27%3E%3C" +
			"And%3E%3C" +
			"PropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%0A%3C" +
			"PropertyName%3EGEMEENTECODE%3C%2F" +
			"PropertyName%3E%3C" +
			"Literal%3E" +
			$('#js-cadastre-kadgem')[0].value +
			"%3C%2F" +
			"Literal%3E%3C%2F" +
			"PropertyIsEqualTo%3E%3C" +
			"PropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%3C" +
			"PropertyName%3ESECTIE%3C%2F" +
			"PropertyName%3E%3C" +
			"Literal%3E" +
			$('#js-cadastre-kadsek')[0].value +
			"%3C%2F" +
			"Literal%3E%3C%2F" +
			"PropertyIsEqualTo%3E%3C" +
			"PropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%3C" +
			"PropertyName%3EPERCEELNUMMER%3C%2F" +
			"PropertyName%3E%3C" +
			"Literal%3E" +
			e.target.value +
			"%3C%2F" +
			"Literal%3E%3C%2F" +
			"PropertyIsEqualTo%3E%3C%2F" +
			"And%3E%3C%2F" +
			"Filter%3E";
		
		Meteor.call('getCadastreCoordinates', url, function(err, result) {
			if(result) {
				var lowerCorner = result.lowerCorner.split(' ');
				var upperCorner = result.upperCorner.split(' ');
				
				var minX = parseFloat(lowerCorner[0]);
				var maxX = parseFloat(upperCorner[0]);
				var minY = parseFloat(lowerCorner[1]);
				var maxY = parseFloat(upperCorner[1]);
				
				var center1 = ((maxX - minX) / 2) + minX;
				var center2 = ((maxY - minY) / 2) + minY;
				
				if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
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
				
				var center = [center1, center2];
				Session.set('locationCoordinates', center);
				setLandschapstypeId(center);
				var iconLayer = getIcon(center, iconStyle);
				map.addLayer(iconLayer);
				Session.set('iconLayerSet', true);
				getDeelgebied(center);
			} else {
				if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
				Session.set('iconLayerSet', false);
			}
			
			setCursorDone();
		});
	},
	'change #search-method-select': function(e) {
		setCursorInProgress();
		
		$('#js-address-results').empty();
		
		var searchValue = e.target.value;
		if(searchValue === 'address') {
			$('#address-search').attr('style', 'display:block;');
			$('#cadastre-search').attr('style', 'display:none;');
		} else if(searchValue === 'cadastre') {
			$('#address-search').attr('style', 'display:none;');
			$('#cadastre-search').attr('style', 'display:block;');
		}
		
		setCursorDone();
	},
	'click #set-location-center-2': function() {
		if(typeof Session.get('locationCoordinates') !== 'undefined' && Session.get('locationCoordinates') !== null) {
			map.getView().setCenter(Session.get('locationCoordinates'));
		}
	}
});

function getIcon(coordinates, iconStyle) {
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

function setExtentCenter(item) {
	var tiff = 'Landschapskaart_deelgebied_' + Session.get('area').replaceAll(' ', '_');
	if(item.Name[0].toLowerCase() === tiff.toLowerCase()) {
		item.BoundingBox.forEach(function(item) {
			if(item.$.CRS === 'EPSG:28992') {
				var minx = item.$.minx;
				var maxx = item.$.maxx;
				var miny = item.$.miny;
				var maxy = item.$.maxy;
				
				var center1 = ((+maxx - +minx) / 2) + +minx;
				var center2 = ((+maxy - +miny) / 2) + +miny;
				
				var extent = [minx, miny, maxx, maxy];
				var center = [center1, center2];
				
				Session.set('mapExtent', extent);
				Session.set('mapExtentCenter', center);
			}
		});
	}
}

function getDeelgebied(coordinates) {
	var url = map.getLayers().item(12)
		.getSource().getGetFeatureInfoUrl(coordinates, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
	
	Meteor.call('getDeelgebied', url, function(err, result) {
		if(typeof result !== 'undefined' && result !== '') {
			Session.set('area', result);
			
			$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
			$('#js-next-icon').attr('style', 'color:#ffffff !important;');
		} else {
			Session.set('area', null);
			Session.set('mapExtent', null);
			Session.set('mapExtentCenter', null);
			
			$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
			$('#js-next-icon').attr('style', 'color:grey !important;');
		}
		
		Meteor.call('getLayer', Meteor.settings.public.deelgebiedenService.url, function(err, result) {
			$.each(result, function(index, item) {
				if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null) {
					setExtentCenter(item);
				}
			});
		});
	});
}

function setLandschapstypeId(coordinates) {
	var url = map.getLayers().item(0).getSource().getGetFeatureInfoUrl(coordinates, map.getView().
			getResolution(), map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
	
	Meteor.call('getLandschapsType', url, function(err, result) {
		if(typeof result !== 'undefined') {
			Session.set('landschapstypeId', result);
			Session.set('locationCoordinates', coordinates);
		} else {
			Session.set('landschapstypeId', null);
			Session.set('locationCoordinates', null);
			
			map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
		}
	});
}