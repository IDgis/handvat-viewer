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
	
	var woonplaatsen = Meteor.settings.public.woonplaatsen;
	
	woonplaatsen.forEach(function(item) {
		var option = '<option value="' + item.value + '">' + item.label + '</option>';
		$('#js-address-city').append(option);
	});
	
	var kadGemeentes = Meteor.settings.public.kadGemeentes;
	
	kadGemeentes.forEach(function(item) {
		var option = '<option value="' + item.value + '">' + item.label + '</option>';
		$('#js-cadastre-kadgem').append(option);
	});
	
	$("#slider-id-2").slider({
		value: 100,
		slide: function(e, ui) {
			$.each(map.getLayers().getArray(), function(index, item) {
				if(index > 10) {
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
		
		Session.set('location', 'x-coördinaat: ' + evt.coordinate[0] + ' | y-coördinaat: ' + evt.coordinate[1]);
		Session.set('mapCoordinates', evt.coordinate);
		iconLayer = getIcon(evt.coordinate, iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
		
		getDeelgebied(evt.coordinate);
	});
});

Template.step_2.events ({
	'change #js-address-city': function(e) {
		setCursorInProgress();
		
		$('#js-address-street').css('display', 'none');
		$('#js-address-number').css('display', 'none');
		
		$('#js-address-street').empty();
		$('#js-address-number').empty();
		
		$('#js-address-street').append('<option value="none">--</option>');
		$('#js-address-number').append('<option value="none">--</option>');
		
		var url = 'http://bag.idgis.nl/bag/services?&TYPENAME=bag:Openbareruimte&VERSION=1.1.0&SERVICE=' +
			'WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27http://www.opengis.net/ogc%27%20xmlns:app=' +
			'%27http://www.deegree.org/app%27%3E%3CPropertyIsEqualTo%20wildCard=%22*%22%20singleChar=%22%23%' +
			'22%20escape=%22!%22%3E%0A%3CPropertyName%3Ebag:woonplaats%3C/PropertyName%3E%3CLiteral%3E' + 
			e.target.value + '%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E';
		
		Meteor.call('getAddressStreets', url, function(err, result) {
			result.forEach(function(item) {
				var option = '<option value="' + item.id + '">' + item.straat + '</option>';
				$('#js-address-street').append(option);
			});
			
			if(e.target.value !== 'none') {
				$('#js-address-street').css('display', 'block');
			}
			
			setCursorDone();
		});
	},
	'change #js-address-street': function(e) {
		setCursorInProgress();
		
		$('#js-address-number').css('display', 'none');
		$('#js-address-number').empty();
		$('#js-address-number').append('<option value="none">--</option>');
		
		var url = 'http://bag.idgis.nl/bag/services?&TYPENAME=bag:AdresseerbaarObject&VERSION=1.1.0&' +
			'SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27http://www.opengis.net/ogc%27%20' +
			'xmlns:app=%27http://www.deegree.org/app%27%3E%3CPropertyIsEqualTo%20wildCard=%22*%22%20' +
			'singleChar=%22%23%22%20escape=%22!%22%3E%0A%3CPropertyName%3Ebag:openbareruimte%3C/PropertyName' +
			'%3E%3CLiteral%3E' + e.target.value + '%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E';
		
		Meteor.call('getAddressNumbers', url, function(err, result) {
			result.forEach(function(item) {
				var option = '<option value="' + item.id + '">' + item.nummer + '</option>';
				$('#js-address-number').append(option);
			});
			
			if(e.target.value !== 'none') {
				$('#js-address-number').css('display', 'block');
			}
			
			setCursorDone();
		});
	},
	'change #js-address-number': function(e) {
		setCursorInProgress();
		
		if(e.target.value !== 'none') {
			var city = $('#js-address-city')[0].options[$('#js-address-city')[0].selectedIndex].text;
			var street = $('#js-address-street')[0].options[$('#js-address-street')[0].selectedIndex].text;
			var number = $('#js-address-number')[0].options[$('#js-address-number')[0].selectedIndex].text;
			
			Session.set('location', street + ' ' + number + ', ' + city);
		}
		
		var url = 'http://bag.idgis.nl/bag/services?&TYPENAME=bag:AdresseerbaarObject&VERSION=1.1.0&' +
		'SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27http://www.opengis.net/ogc%27%20' +
		'xmlns:app=%27http://www.deegree.org/app%27%3E%3CPropertyIsEqualTo%20wildCard=%22*%22%20' +
		'singleChar=%22%23%22%20escape=%22!%22%3E%0A%3CPropertyName%3Ebag:identificatie%3C/PropertyName' +
		'%3E%3CLiteral%3E' + e.target.value + '%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E';
		
		Meteor.call('getAddressCoordinates', url, function(err, result) {
			if(result) {
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
				if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
				Session.set('iconLayerSet', false);
			}
			
			setCursorDone();
		});
	},
	'change #js-cadastre-kadgem': function(e) {
		setCursorInProgress();
		
		$('#js-cadastre-kadsek').css('display', 'none');
		$('#js-cadastre-kadobj').css('display', 'none');
		
		$('#js-cadastre-kadsek').empty();
		$('#js-cadastre-kadobj').empty();
		
		$('#js-cadastre-kadsek').append('<option value="none">--</option>');
		$('#js-cadastre-kadobj').append('<option value="none">--</option>');
		
		var url = "http://portal.prvlimburg.nl/geoservices/kad_perceel?&TYPENAME=kad_perceel_v&" +
				"VERSION=1.1.0&SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns%3D%27http%3A%2F%" +
				"2Fwww.opengis.net%2Fogc%27%20xmlns%3Aapp%3D%27http%3A%2F%2Fwww.deegree.org%2Fapp%27%3E%" +
				"3CPropertyIsEqualTo%20wildCard%3D%22*%22%20singleChar%3D%22%23%22%20escape%3D%22!%22%3E" +
				"%0A%3CPropertyName%3EKADGEM%3C%2FPropertyName%3E%3CLiteral%3E" + e.target.value + "%3C%2FLite" +
				"ral%3E%3C%2FPropertyIsEqualTo%3E%3C%2FFilter%3E";
		
		Meteor.call('getCadastreSectors', url, function(err, result) {
			result.forEach(function(item) {
				var option = '<option value="' + item + '">' + item + '</option>';
				$('#js-cadastre-kadsek').append(option);
			});
			
			if(e.target.value !== 'none') {
				$('#js-cadastre-kadsek').css('display', 'block');
			}
			
			setCursorDone();
		});
	},
	'change #js-cadastre-kadsek': function(e) {
		setCursorInProgress();
		
		$('#js-cadastre-kadobj').css('display', 'none');
		$('#js-cadastre-kadobj').empty();
		$('#js-cadastre-kadobj').append('<option value="none">--</option>');
		
		var url = "http://portal.prvlimburg.nl/geoservices/kad_perceel?&TYPENAME=kad_perceel_v&VERSION" +
				"=1.1.0&SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27http%3A//www.opengis." +
				"net/ogc%27%20xmlns%3Aapp=%27http%3A//www.deegree.org/app%27%3E%3CAND%3E%3CPropertyIsEqu" +
				"alTo%20wildCard=%22*%22%20singleChar=%22%23%22%20escape=%22!%22%3E%0A%3CPropertyName%3E" +
				"KADGEM%3C/PropertyName%3E%3CLiteral%3E" + $('#js-cadastre-kadgem')[0].value + "%3C/Literal%3E%" +
				"3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%20wildCard=%22*%22%20singleChar=%22%23%22%20escape" +
				"=%22!%22%3E%3CPropertyName%3EKADSEK%3C/PropertyName%3E%3CLiteral%3E" + e.target.value + "%3C/" +
				"Literal%3E%3C/PropertyIsEqualTo%3E%3C/AND%3E%3C/Filter%3E";
		
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
		
		var url = "http://portal.prvlimburg.nl/geoservices/kad_perceel?&TYPENAME=kad_perceel_v&VERSION=1.1.0&" +
				"SERVICE=WFS&REQUEST=GetFeature&FILTER=%3CFilter%20xmlns=%27http://www.opengis.net/ogc%27%20" +
				"xmlns:app=%27http://www.deegree.org/app%27%3E%3CAND%3E%3CPropertyIsEqualTo%20wildCard=%22*%22" +
				"%20singleChar=%22%23%22%20escape=%22!%22%3E%0A%3CPropertyName%3EKADGEM%3C/PropertyName%3E%3C" +
				"Literal%3E" + $('#js-cadastre-kadgem')[0].value + "%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C" +
				"PropertyIsEqualTo%20wildCard=%22*%22%20singleChar=%22%23%22%20escape=%22!%22%3E%3CPropertyName" +
				"%3EKADSEK%3C/PropertyName%3E%3CLiteral%3E" + $('#js-cadastre-kadsek')[0].value + "%3C/Literal" +
				"%3E%3C/PropertyIsEqualTo%3E%3CPropertyIsEqualTo%20wildCard=%22*%22%20singleChar=%22%23%22%20" +
				"escape=%22!%22%3E%3CPropertyName%3EKADOBJNR%3C/PropertyName%3E%3CLiteral%3E" + e.target.value + 
				"%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/AND%3E%3C/Filter%3E";
		
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
				if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
					map.removeLayer(map.getLayers().item(map.getLayers().getLength() -1));
				}
				
				Session.set('iconLayerSet', false);
			}
			
			setCursorDone();
		});
	},
	'change #search-method-select': function(e) {
		setCursorInProgress();
		
		var searchValue = e.target.value;
		if(searchValue === 'address') {
			$('#address-search').attr('style', 'display:block;');
			$('#cadastre-search').attr('style', 'display:none;');
		} else if(searchValue === 'cadastre') {
			$('#address-search').attr('style', 'display:none;');
			$('#cadastre-search').attr('style', 'display:block;');
		}
		
		setCursorDone();
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