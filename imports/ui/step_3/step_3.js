import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/step_3.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	
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
	
	var areaLayer;
	var layerId;
	var textAreaId;
	
	if(Session.get('area') === 'Baneheide' || Session.get('area') === 'Bekken van Heerlen' || 
			Session.get('area') === 'Doenrade' || Session.get('area') === 'Eperheide' || 
			Session.get('area') === 'Geleenbeek' || Session.get('area') === 'Geuldal' || 
			Session.get('area') === 'Maasdal' || Session.get('area') === 'Maasterras Gronsveld' || 
			Session.get('area') === 'Margraten' || Session.get('area') === 'Roode Beek' || 
			Session.get('area') === 'Schimmert' || Session.get('area') === 'Ubachsberg' || 
			Session.get('area') === 'Vijlenerbos') {
		
		if(Session.get('area') === 'Baneheide') {
			layerId = Meteor.settings.public.landschapStructuurService.indexBH;
			textAreaId = Meteor.settings.public.step3TextBH;
		} else if(Session.get('area') === 'Bekken van Heerlen') {
			layerId = Meteor.settings.public.landschapStructuurService.indexH;
			textAreaId = Meteor.settings.public.step3TextH;
		} else if(Session.get('area') === 'Doenrade') {
			layerId = Meteor.settings.public.landschapStructuurService.indexDR;
			textAreaId = Meteor.settings.public.step3TextDR;
		} else if(Session.get('area') === 'Eperheide') {
			layerId = Meteor.settings.public.landschapStructuurService.indexEH;
			textAreaId = Meteor.settings.public.step3TextEH;
		} else if(Session.get('area') === 'Geleenbeek') {
			layerId = Meteor.settings.public.landschapStructuurService.indexGB;
			textAreaId = Meteor.settings.public.step3TextGB;
		} else if(Session.get('area') === 'Geuldal') {
			layerId = Meteor.settings.public.landschapStructuurService.indexGD;
			textAreaId = Meteor.settings.public.step3TextGD;
		} else if(Session.get('area') === 'Maasdal') {
			layerId = Meteor.settings.public.landschapStructuurService.indexMD;
			textAreaId = Meteor.settings.public.step3TextMD;
		} else if(Session.get('area') === 'Maasterras Gronsveld') {
			layerId = Meteor.settings.public.landschapStructuurService.indexMG;
			textAreaId = Meteor.settings.public.step3TextMG;
		} else if(Session.get('area') === 'Margraten') {
			layerId = Meteor.settings.public.landschapStructuurService.indexM;
			textAreaId = Meteor.settings.public.step3TextM;
		} else if(Session.get('area') === 'Roode Beek') {
			layerId = Meteor.settings.public.landschapStructuurService.indexRB;
			textAreaId = Meteor.settings.public.step3TextRB;
		} else if(Session.get('area') === 'Schimmert') {
			layerId = Meteor.settings.public.landschapStructuurService.indexS;
			textAreaId = Meteor.settings.public.step3TextS;
		} else if(Session.get('area') === 'Ubachsberg') {
			layerId = Meteor.settings.public.landschapStructuurService.indexUB;
			textAreaId = Meteor.settings.public.step3TextUB;
		} else if(Session.get('area') === 'Vijlenerbos') {
			layerId = Meteor.settings.public.landschapStructuurService.indexVB;
			textAreaId = Meteor.settings.public.step3TextVB;
		}
		
		areaLayer = new ol.layer.Image({
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
		Meteor.call('getText', result.content, Meteor.settings.public.step3Dg, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#intro-dg-3').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.step3Lb, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#intro-lb-3').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, textAreaId, function(err, result) {
			if(typeof result !== 'undefined') {
				$.each(result.images, function(index, item) {
					if(index === 0) {
						$('#dg-text-3').append(item);
					}
				});
				
				cleanImages('dg-text-3', 'area-img-3');
				$('#dg-text-3').append(result.content);
			} else {
				$('#dg-text-3').append('U heeft geen valide deelgebied geselecteerd.');
			}
		});
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
		setLandschapstypeId(Session.get('mapCoordinates'));
	} else {
		$('#error-3').append('U heeft geen valide deelgebied geselecteerd.');
		$('#lb-text-3').append('U heeft geen valide deelgebied geselecteerd.');
	}
	
	function setLandschapstypeId(coordinates) {
		var url = map.getLayers().item(0).getSource().getGetFeatureInfoUrl(coordinates, map.getView().
				getResolution(), map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getLandschapsType', url, function(err, result) {
			if(result === 'Dalbodem') {
				Session.set('landschapstypeId', Meteor.settings.public.dalId);
				Session.set('mapCoordinates', coordinates);
				Session.set('landschapstypeName', 'Dal');
			} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
				Session.set('landschapstypeId', Meteor.settings.public.hellingId);
				Session.set('mapCoordinates', coordinates);
				Session.set('landschapstypeName', 'Helling');
			} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
					result === 'Geisoleerde heuvel') {
				Session.set('landschapstypeId', Meteor.settings.public.plateauId);
				Session.set('mapCoordinates', coordinates);
				Session.set('landschapstypeName', 'Plateau');
			} else {
				Session.set('landschapstypeId', null);
				Session.set('mapCoordinates', null);
				Session.set('landschapstypeName', null);
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
								Meteor.call('getText', result.content, item, function(err, result) {
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
								Meteor.call('getText', result.content, item, function(err, result) {
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