import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [167658.241026781, 307862.821900462, 208090.624144334, 339455.907872023]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [187000, 323000],
		zoom: 2
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		control: zoomControl,
		target: 'map-2',
		view: view
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
				'/' +  Meteor.settings.public.domainSuffix + '/images/location.svg'
		}))
	});
	
	var iconLayer;
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		iconLayer = getIcon(Session.get('mapCoordinates'), iconStyle);
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
	}
	
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

Template.step_1.events ({
	'keyup #js-input-search': function(e) {
		if(e.target.value !== '') {
			$('#address-suggestions').attr('style', 'display:block;');
		} else {
			$('#address-suggestions').attr('style', 'display:none;');
		}
		
		var url = 'http://bag.idgis.nl/geoide-search-service/bag/suggest?q=' + e.target.value;
		
		Meteor.call('getSuggestions', url, function(err, result) {
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
	'click .address-suggestion': function(e) {
		var element = $(e.target).parent()[0];
		var input = $('.address-input', element)[0];
		var suggestion = $('.address-suggestion-append', element)[0];
		
		$('#js-input-search').val(input.innerHTML + suggestion.innerHTML);
		$('#address-suggestions').attr('style', 'display:none;');
	}
	,
	'click #js-execute-address-search': function(e) {
		$('#address-suggestions').attr('style', 'display:none;');
		$('#address-search-results').empty();
		
		var searchValue = $('#js-input-search').val();
		
		var url = 'http://bag.idgis.nl/geoide-search-service/bag/search?q=' + searchValue + '&srs=28992';
		
		Meteor.call('getSearchResults', url, function(err, result) {
			result.forEach(function(item) {
				var minX = item.envelope.minX;
				var maxX = item.envelope.maxX;
				var minY = item.envelope.minY;
				var maxY = item.envelope.maxY;
				
				var center1 = ((maxX - minX) / 2) + minX;
				var center2 = ((maxY - minY) / 2) + minY;
				
				var li = document.createElement('li');
				$(li).attr('class', 'list-group-item');
				
				var a = document.createElement('a');
				$(a).attr('class', 'address-search-result')
				$(a).attr('data-center-1', center1)
				$(a).attr('data-center-2', center2)
				$(a).attr('data-dismiss', 'modal')
				$(a).append(item.name);
				
				$(li).append(a);
				$('#address-search-results').append(li);
			});
		});
	},
	'click .address-search-result': function(e) {
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
					'/' +  Meteor.settings.public.domainSuffix + '/images/location.svg'
			}))
		});
		
		var center1 = parseFloat($(e.target).attr('data-center-1'));
		var center2 = parseFloat($(e.target).attr('data-center-2'));
		
		var center = [center1, center2];
		Session.set('mapCoordinates', center);
		var iconLayer = getIcon(center, iconStyle);
		
		map.addLayer(iconLayer);
		Session.set('iconLayerSet', true);
		getDeelgebied(Session.get('mapCoordinates'));
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

function setExtentCenter(areaSession, area, nameLayer, name, layerItem) {
	if(areaSession === area) {
		if(nameLayer === name) {
			var minx = layerItem.BoundingBox[0].$.minx;
			var maxx = layerItem.BoundingBox[0].$.maxx;
			var miny = layerItem.BoundingBox[0].$.miny;
			var maxy = layerItem.BoundingBox[0].$.maxy;
			
			var center1 = ((+maxx - +minx) / 2) + +minx;
			var center2 = ((+maxy - +miny) / 2) + +miny;
			
			var extent = [minx, miny, maxx, maxy];
			var center = [center1, center2];
			
			Session.set('mapExtent', extent);
			Session.set('mapCenter', center);
		}
	}
}

function getDeelgebied(coordinates) {
	var url = map.getLayers().item(Meteor.settings.public.deelgebiedenService.indexDG)
		.getSource().getGetFeatureInfoUrl(coordinates, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
	
	Meteor.call('getDeelgebied', url, function(err, result) {
		if(result === 'Baneheide' || result === 'Bekken van Heerlen' || result === 'Doenrade' || 
				result === 'Eperheide' || result === 'Geleenbeek' || result === 'Geuldal' || 
				result === 'Maasdal' || result === 'Maasterras Gronsveld' || result === 'Margraten' || 
				result === 'Roode Beek' || result === 'Schimmert' || result === 'Ubachsberg' || 
				result === 'Vijlenerbos') {
			Session.set('area', result);
			
			if(typeof Session.get('sectorId') === 'undefined') {
				var sectorElement = $('#sector-dropdown-label');
				$.each(sectorElement, function(index, item) {
					$(item).css({'color':'#BF3F3F'});
					$(item).css({'border':'1px solid black'});
					$(item).css({'font-weight':'bold'});
				});
			}
		}
		
		Meteor.call('getBoundingBox', Meteor.settings.public.deelgebiedenService.urlSK, function(err, result) {
			$.each(result, function(index, item) {
				if(Session.get('area') !== 'undefined') {
					var area = Session.get('area');
					
					setExtentCenter(area, 'Baneheide', item.Name[0], 'Landschapskaart_deelgebied_Baneheide', item);
					setExtentCenter(area, 'Bekken van Heerlen', item.Name[0], 'Landschapskaart_deelgebied_Heerlen', item);
					setExtentCenter(area, 'Doenrade', item.Name[0], 'Landschapskaart_deelgebied_Doenrade', item);
					setExtentCenter(area, 'Eperheide', item.Name[0], 'Landschapskaart_deelgebied_Eperheide', item);
					setExtentCenter(area, 'Geleenbeek', item.Name[0], 'Landschapskaart_deelgebied_Geleenbeek', item);
					setExtentCenter(area, 'Geuldal', item.Name[0], 'Landschapskaart_deelgebied_Geuldal', item);
					setExtentCenter(area, 'Maasdal', item.Name[0], 'Landschapskaart_deelgebied_Maasdal', item);
					setExtentCenter(area, 'Maasterras Gronsveld', item.Name[0], 'Landschapskaart_deelgebied_Gronsveld', item);
					setExtentCenter(area, 'Margraten', item.Name[0], 'Landschapskaart_deelgebied_Margraten', item);
					setExtentCenter(area, 'Roode Beek', item.Name[0], 'Landschapskaart_deelgebied_Roode_beek', item);
					setExtentCenter(area, 'Schimmert', item.Name[0], 'Landschapskaart_deelgebied_Schimmert', item);
					setExtentCenter(area, 'Ubachsberg', item.Name[0], 'Landschapskaart_deelgebied_Ubachsberg', item);
					setExtentCenter(area, 'Vijlenerbos', item.Name[0], 'Landschapskaart_deelgebied_Vijlenerbos', item);
				}
			});
		});
	});
}