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
	
	var extent;
	var center;
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapExtentCenter') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('mapExtentCenter');
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
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
		+ Meteor.settings.public.stap3Deelgebied, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#intro-dg-3').append(result.data.html);
		}
		
		setCursorDone();
	});
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
		+ Meteor.settings.public.stap3Beginselen, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#intro-lb-3').append(result.data.html);
		}
	});
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/name/"
		+ Session.get('area'), {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(typeof Session.get('area') !== 'undefined') {
			if(typeof result.data[0] !== 'undefined') {
				$('#dg-text-3').append(result.data[0].html);
			} else {
				$('#dg-text-3').append('U heeft geen valide deelgebied geselecteerd.');
			}
		}
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
		iconLayer = getIcon(Session.get('locationCoordinates'));
		map.addLayer(iconLayer);
		setLandschapstypeId(Session.get('locationCoordinates'));
	} else {
		$('#error-3').append('U heeft geen valide deelgebied geselecteerd.');
		$('#dg-text-3').append('U heeft geen valide deelgebied geselecteerd.');
		$('#lb-text-3').append('U heeft geen valide deelgebied geselecteerd.');
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
	getImageLink: function(filename) {
		return Meteor.absoluteUrl() + Meteor.settings.public.domainSuffix + '/images/' + filename;
	},
	getLeidendeBeginselen: function() {
		$('#lb-text-3').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			setCursorInProgress();
			
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/coupling/leidend/json/"
				+ Session.get('landschapstypeId'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				var itemCount = 1;
				var divCount = 0;
				
				$.each(result.data, function(index, item) {
					if(divCount === 0) {
						var outerDiv = document.createElement('div');
						$(outerDiv).attr('id', 'leidendbeginsel-' + itemCount);
						$(outerDiv).attr('class', 'col-xs-12 text-div');
						
						var innerDivLeft = document.createElement('div');
						$(innerDivLeft).attr('class', 'col-xs-6 text-div');
						$('#lb-text-3').append(outerDiv);
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
							+ item, {
							headers: {
								'Content-Type' : 'application/json; charset=UTF-8'
							}
						}, function(err, result) {
							if(result.data !== null) {
								$.each(result.data.images, function(ix, elt) {
									$(innerDivLeft).append(elt);
								});
								
								cleanImages('lb-text-3', 'text-div-img');
								
								$(innerDivLeft).append(result.data.html);
							}
						});
						
						$(outerDiv).append(innerDivLeft);
						
						divCount++;
					
					} else {
						var innerDivRight = document.createElement('div');
						$(innerDivRight).attr('class', 'col-xs-6 text-div');
						$('#leidendbeginsel-' + itemCount).append(innerDivRight);
						
						HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/id/"
							+ item, {
							headers: {
								'Content-Type' : 'application/json; charset=UTF-8'
							}
						}, function(err, result) {
							if(result.data !== null) {
								$.each(result.data.images, function(ix, elt) {
									$(innerDivRight).append(elt);
								});
								
								cleanImages('lb-text-3', 'text-div-img');
								
								$(innerDivRight).append(result.data.html);
							}
						});
						
						itemCount++;
						divCount = 0;
					}
				});
				
				setCursorDone();
			});
		}
	},
	disableElement: function() {
		if(typeof Session.get('locationCoordinates') === 'undefined' || Session.get('locationCoordinates') === null) {
			return 'disabled';
		}
	}
});

Template.step_3.events({
	'click #set-location-center-3': function() {
		if(typeof Session.get('locationCoordinates') !== 'undefined' && Session.get('locationCoordinates') !== null) {
			map.getView().setCenter(Session.get('locationCoordinates'));
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