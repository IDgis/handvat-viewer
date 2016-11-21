import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	setCursorInProgress();
	Session.set('stepNumber', '3');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	$(".modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCenter') === 'undefined') {
		var extent: [165027, 306558, 212686, 338329]
		var center = [188856, 322443];
	} else {
		var extent = Session.get('mapExtent');
		var center = Session.get('mapCenter');
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
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		control: zoomControl,
		target: 'map-3',
		view: view
	});
	
	var skUrl = Meteor.settings.public.landschapStructuurService.url;
	var ltUrl = Meteor.settings.public.landschapstypenService.url;
	
	var ltLayerId = Meteor.settings.public.landschapstypenService.indexLT;
	
	var version = Meteor.settings.public.landschapStructuurService.version;
	
	var ltLayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: ltUrl,
			opacity: 0,
			params: {'LAYERS': Meteor.settings.public.landschapstypenService.layers[ltLayerId], 
				'VERSION': version} 
		})
	});
	
	map.addLayer(ltLayer);
	
	map.getLayers().item(0).setOpacity(0);
	
	if(typeof Session.get('area') !== 'undefined') {
		var layerId = Meteor.settings.public.landschapStructuurService[Session.get('area')];
		
		var areaLayer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: skUrl, 
				params: {'LAYERS': Meteor.settings.public.landschapStructuurService.layers[layerId], 
					'VERSION': version} 
			})
		});
		
		map.addLayer(areaLayer);
	}
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap3Deelgebied, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#intro-dg-3').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap3Beginselen, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#intro-lb-3').append(result.content);
			}
		});
		
		if(typeof Session.get('area') !== 'undefined') {
			Meteor.call('getTextFromName', result.content, Session.get('area'), function(err, result) {
				if(typeof result !== 'undefined') {
					$('#dg-text-3').append(result.content);
				} else {
					$('#dg-text-3').append('U heeft geen valide deelgebied geselecteerd.');
				}
			});
		}
		
		setCursorDone();
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
		iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
		setLandschapstypeId(Session.get('mapCoordinates'));
	} else {
		$('#error-3').append('U heeft geen valide deelgebied geselecteerd.');
		$('#lb-text-3').append('U heeft geen valide deelgebied geselecteerd.');
	}
	
	function setLandschapstypeId(coordinates) {
		var url = map.getLayers().item(0).getSource().getGetFeatureInfoUrl(coordinates, map.getView().
				getResolution(), map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getLandschapsType', url, function(err, result) {
			if(typeof result !== 'undefined') {
				Session.set('landschapstypeId', result);
				Session.set('mapCoordinates', coordinates);
			} else {
				Session.set('landschapstypeId', null);
				Session.set('mapCoordinates', null);
			}
		});
	}
	
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
});

Template.step_3.helpers({
	getLeidendeBeginselen: function() {
		$('#lb-text-3').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			setCursorInProgress();
			
			HTTP.get("http://148.251.183.26/handvat-admin/coupling/leidend/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getBeginselen', result.content, Session.get('landschapstypeId'), function(err, result) {
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'leidendbeginsel-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#lb-text-3').append(outerDiv);
							
							HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getTextFromId', result.content, item, function(err, result) {
									if(typeof result !== 'undefined') {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										cleanImages('lb-text-3', 'text-div-img');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							$(outerDiv).append(innerDiv);
							
							divCount++;
						
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#leidendbeginsel-' + itemCount).append(innerDiv);
							
							HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
								headers: {
									'Content-Type' : 'application/json; charset=UTF-8'
								}
							}, function(err, result) {
								Meteor.call('getTextFromId', result.content, item, function(err, result) {
									if(typeof result !== 'undefined') {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										cleanImages('lb-text-3', 'text-div-img');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							itemCount++;
							divCount = 0;
						}
					});
				});
				
				setCursorDone();
			});
		}
	}
});

function cleanImages(div, className) {
	$.each($('#' + div + ' img'), function(index, item) {
		var src = $(item).attr('src');
		
		if(typeof src === 'undefined') {
			$(item).remove();
		} else {
			$(item).removeAttr('style');
			$(item).attr('class', className);
		}
	});
}