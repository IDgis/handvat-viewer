import './step_2.html';
import './step_2.css';

Template.step_2.onRendered(function() {
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
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap2Links, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-2').append(result.content);
			}
		});
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
		
		map.addLayer(layer);
	});
	
	var urlDG = Meteor.settings.public.deelgebiedenService.urlDG;
	var layersDG = Meteor.settings.public.deelgebiedenService.layersDG;
	var version = Meteor.settings.public.deelgebiedenService.version;
	
	layersDG.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlDG, 
				params: {'LAYERS': item, 'VERSION': version} 
			})
		});
		
		map.addLayer(layer);
	});
	
	var urlSK = Meteor.settings.public.deelgebiedenService.urlSK;
	var layersSK = Meteor.settings.public.deelgebiedenService.layersSK;
	var version = Meteor.settings.public.deelgebiedenService.version;
	
	layersSK.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlSK, 
				params: {'LAYERS': item, 'VERSION': version} 
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
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		iconLayer = getIcon(Session.get('mapCoordinates'), iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
	}
	
	$("#slider-id-2").slider({
		value: 100,
		slide: function(e, ui) {
			$.each(map.getLayers().getArray(), function(index, item) {
				if(index > 9) {
					if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
						if(index !== map.getLayers().getLength() - 1) {
							map.getLayers().item(index).setOpacity(ui.value / 100);
						}
					} else {
						map.getLayers().item(index).setOpacity(ui.value / 100);
					}
				}
			});
		}
	});
	
	map.on('singleclick', function(evt) {
		if(Session.get('iconLayerSet') === true) {
			map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
		}
		
		Session.set('mapCoordinates', evt.coordinate);
		iconLayer = getIcon(evt.coordinate, iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
		
		getDeelgebied(evt.coordinate);
	});
});

Template.step_2.events ({
	'keyup #js-input-address-search': function(e) {
		if(e.target.value !== '') {
			$('#address-suggestions').attr('style', 'display:block;');
		} else {
			$('#address-suggestions').attr('style', 'display:none;');
		}
		
		var url = 'http://bag.idgis.nl/geoide-search-service/bag/suggest?q=' + e.target.value;
		
		Meteor.call('getAddressSuggestions', url, function(err, result) {
			$('#address-suggestions').empty();
			var count = 0;
			
			result.forEach(function(item) {
				var begin = item.indexOf('{');
				var end = item.indexOf('}');
				var suggestion = item.substring(begin + 1, end);
				
				if(count < 5 && suggestion !== '') {
					var li = document.createElement('li');
					$(li).attr('class', 'list-group-item');
					
					var a = document.createElement('a');
					$(a).attr('class', 'address-suggestion')
					var spanInput = document.createElement('span');
					$(spanInput).attr('class', 'address-input');
					$(spanInput).append(e.target.value);
					$(a).append(spanInput);
					
					var spanSuggestion = document.createElement('span');
					$(spanSuggestion).attr('class', 'address-suggestion-append');
					$(spanSuggestion).append(suggestion);
					$(a).append(spanSuggestion);
					
					$(li).append(a);
					$('#address-suggestions').append(li);
					
					count++;
				}
			});
		});
	},
	'keyup #js-input-cadastre-search': function(e) {
		if(e.target.value !== '') {
			$('#cadastre-suggestions').attr('style', 'display:block;');
		} else {
			$('#cadastre-suggestions').attr('style', 'display:none;');
		}
		
		var url = 'http://portal.prvlimburg.nl/geoservices/kad_perceel?&TYPENAME=kad_perceel_v&' +
			'VERSION=1.1.0&SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27' +
			'http://www.opengis.net/ogc%27%20xmlns:app=%27http://www.deegree.org/app%27%3E%3CPropertyIsLike' +
			'%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%0A%3CPropertyName' +
			'%3EKADSLEUTEL%3C%2FPropertyName%3E%0A%3CLiteral%3E' + e.target.value.toUpperCase() + 
			'*%3C%2FLiteral%3E%0A%3C%2FPropertyIsLike%3E%3C/Filter%3E&maxFeatures=5';
		
		Meteor.call('getCadastreSuggestions', url, function(err, result) {
			$('#cadastre-suggestions').empty();
			var searchValue = e.target.value;
			
			result.forEach(function(item) {
				var appendValue = item.substring(searchValue.length).replace(/ /g, '&nbsp;');
				
				if(appendValue !== '') {
					var li = document.createElement('li');
					$(li).attr('class', 'list-group-item');
					
					var a = document.createElement('a');
					$(a).attr('class', 'cadastre-suggestion')
					var spanInput = document.createElement('span');
					$(spanInput).attr('class', 'cadastre-input');
					$(spanInput).append(searchValue.toUpperCase());
					$(a).append(spanInput);
					
					var spanSuggestion = document.createElement('span');
					$(spanSuggestion).attr('class', 'cadastre-suggestion-append');
					$(spanSuggestion).append(appendValue);
					$(a).append(spanSuggestion);
					
					$(li).append(a);
					$('#cadastre-suggestions').append(li);
				}
			});
		});
	},	
	'click .address-suggestion': function(e) {
		var element = $(e.target).parent()[0];
		var input = $('.address-input', element)[0];
		var suggestion = $('.address-suggestion-append', element)[0];
		
		$('#js-input-address-search').val(input.innerHTML + suggestion.innerHTML);
		$('#address-suggestions').attr('style', 'display:none;');
	},	
	'click .cadastre-suggestion': function(e) {
		var element = $(e.target).parent()[0];
		var input = $('.cadastre-input', element)[0];
		var suggestion = $('.cadastre-suggestion-append', element)[0];
		
		$('#js-input-cadastre-search').val(input.innerHTML + suggestion.innerHTML.replaceAll('&nbsp;', ' '));
		$('#cadastre-suggestions').attr('style', 'display:none;');
	},
	'click #js-execute-address-search': function(e) {
		$('#address-suggestions').attr('style', 'display:none;');
		var searchValue = $('#js-input-address-search').val();
		var url = 'http://bag.idgis.nl/geoide-search-service/bag/search?q=' + searchValue + '&srs=28992';
		
		Meteor.call('getAddressSearchResult', url, function(err, result) {
			if(result) {
				$('#no-results-found-search').attr('style', 'display:none;');
				
				var minX = result.envelope.minX;
				var maxX = result.envelope.maxX;
				var minY = result.envelope.minY;
				var maxY = result.envelope.maxY;
				
				var center1 = ((maxX - minX) / 2) + minX;
				var center2 = ((maxY - minY) / 2) + minY;
				
				if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
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
				Session.set('mapCoordinates', center);
				var iconLayer = getIcon(center, iconStyle);
				map.addLayer(iconLayer);
				Session.set('iconLayerSet', true);
				getDeelgebied(Session.get('mapCoordinates'));
			} else {
				$('#no-results-found-search').attr('style', 'display:block;');
			}
		});
	},
	'click #js-execute-cadastre-search': function(e) {
		$('#cadastre-suggestions').attr('style', 'display:none;');
		$('#cadastre-search-results').empty();
		
		var searchValue = $('#js-input-cadastre-search').val().toUpperCase().replace(/ /g, '%20');
		
		var url = 'http://portal.prvlimburg.nl/geoservices/kad_perceel?&TYPENAME=kad_perceel_v&' +
		'VERSION=1.1.0&SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27' +
		'http://www.opengis.net/ogc%27%20xmlns:app=%27http://www.deegree.org/app%27%3E%3CPropertyIsLike' +
		'%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E%0A%3CPropertyName' +
		'%3EKADSLEUTEL%3C%2FPropertyName%3E%0A%3CLiteral%3E' + searchValue + 
		'*%3C%2FLiteral%3E%0A%3C%2FPropertyIsLike%3E%3C/Filter%3E&maxFeatures=5';
		
		Meteor.call('getCadastreSearchResult', url, function(err, result) {
			if(result) {
				$('#no-results-found-search').attr('style', 'display:none;');
				
				var lowerCorner = result.lowerCorner.split(' ');
				var upperCorner = result.upperCorner.split(' ');
				
				var minX = parseFloat(lowerCorner[0]);
				var maxX = parseFloat(upperCorner[0]);
				var minY = parseFloat(lowerCorner[1]);
				var maxY = parseFloat(upperCorner[1]);
				
				var center1 = ((maxX - minX) / 2) + minX;
				var center2 = ((maxY - minY) / 2) + minY;
				
				if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
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
				Session.set('mapCoordinates', center);
				var iconLayer = getIcon(center, iconStyle);
				map.addLayer(iconLayer);
				Session.set('iconLayerSet', true);
				getDeelgebied(Session.get('mapCoordinates'));
			} else {
				$('#no-results-found-search').attr('style', 'display:block;');
			}
		});
	},
	'change #search-method-select': function(e) {
		var searchValue = e.target.value;
		if(searchValue === 'address') {
			$('#address-search').attr('style', 'display:block;');
			$('#cadastre-search').attr('style', 'display:none;');
		} else if(searchValue === 'cadastre') {
			$('#address-search').attr('style', 'display:none;');
			$('#cadastre-search').attr('style', 'display:block;');
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
		var minx = item.BoundingBox[0].$.minx;
		var maxx = item.BoundingBox[0].$.maxx;
		var miny = item.BoundingBox[0].$.miny;
		var maxy = item.BoundingBox[0].$.maxy;
		
		var center1 = ((+maxx - +minx) / 2) + +minx;
		var center2 = ((+maxy - +miny) / 2) + +miny;
		
		var extent = [minx, miny, maxx, maxy];
		var center = [center1, center2];
		
		Session.set('mapExtent', extent);
		Session.set('mapCenter', center);
	}
}

function getDeelgebied(coordinates) {
	var url = map.getLayers().item(Meteor.settings.public.deelgebiedenService.indexDG)
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
			Session.set('mapCenter', null);
			
			$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
			$('#js-next-icon').attr('style', 'color:grey !important;');
		}
		
		Meteor.call('getLayer', Meteor.settings.public.deelgebiedenService.urlSK, function(err, result) {
			$.each(result, function(index, item) {
				if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null) {
					setExtentCenter(item);
				}
			});
		});
	});
}