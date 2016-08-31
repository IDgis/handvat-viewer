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
		iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	map.on('singleclick', function(evt) {
		if(typeof iconLayer !== 'undefined') {
			map.removeLayer(iconLayer);
		}
		
		Session.set('mapCoordinates', evt.coordinate);
		iconLayer = getIcon(evt.coordinate);
		map.addLayer(iconLayer);
		
		var url = map.getLayers().item(Meteor.settings.public.deelgebiedenService.indexDG)
				.getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getDeelgebied', url, function(err, result) {
			if(result === 'Baneheide' || result === 'Doenrade' || result === 'Eperheide' || 
					result === 'Maasterras Gronsveld' || result === 'Margraten' || 
					result === 'Schimmert' || result === 'Ubachsberg' || result === 'Vijlenerbos') {
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
			
			Meteor.call('getBoundingBox', urlSK, function(err, result) {
				$.each(result, function(index, item) {
					if(Session.get('area') !== 'undefined') {
						var area = Session.get('area');
						
						setExtentCenter(area, 'Baneheide', item.Name[0], 'Landschapskaart_deelgebied_Baneheide', item);
						setExtentCenter(area, 'Doenrade', item.Name[0], 'Landschapskaart_deelgebied_Doenrade', item);
						setExtentCenter(area, 'Eperheide', item.Name[0], 'Landschapskaart_deelgebied_Eperheide', item);
						setExtentCenter(area, 'Maasterras Gronsveld', item.Name[0], 'Landschapskaart_deelgebied_Gronsveld', item);
						setExtentCenter(area, 'Margraten', item.Name[0], 'Landschapskaart_deelgebied_Margraten', item);
						setExtentCenter(area, 'Schimmert', item.Name[0], 'Landschapskaart_deelgebied_Schimmert', item);
						setExtentCenter(area, 'Ubachsberg', item.Name[0], 'Landschapskaart_deelgebied_Ubachsberg', item);
						setExtentCenter(area, 'Vijlenerbos', item.Name[0], 'Landschapskaart_deelgebied_Vijlenerbos', item);
					}
				});
			});
		});
	});
	
	function getIcon(coordinates) {
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
});