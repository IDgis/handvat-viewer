import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'kernkwaliteit', function(err, result) {
			$.each(result, function(index, item) {
				var header = document.createElement('p');
				$(header).attr('class', 'header');
				header.innerHTML = item.name;
				$('#kk-container').append(header);
				
				var image = document.createElement('img');
				$(image).attr('class', 'kernkwaliteit-img');
				$(image).attr('id', item.id);
				$('#kk-container').append(image);
			});
		});
	});
	
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [167658.241026781, 307862.821900462, 208090.624144334, 339455.907872023]
	});
	
	var view = new ol.View({
		projection: projection,
		center: [187000, 323000],
		zoom: 2
	});
	
	var source = new ol.source.ImageWMS({
		url: 'http://portal.prvlimburg.nl/geoservices/landschapstypen?', 
		params: {'LAYERS': 'landschapstypen_v', 'VERSION': '1.1.1'} 
	})
	
	var achtergrond = new ol.layer.Image({
		source: source
	});
	
	var zoomControl = new ol.control.Zoom();
	
	map = new ol.Map({
		layers: [
	      achtergrond
		],
		control: zoomControl,
		target: 'map',
		view: view
	});
	
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
			anchor: [0.5, 32],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
				'/images/location.svg'
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
		
		iconLayer = getIcon(evt.coordinate);
		map.addLayer(iconLayer);
		
		var url = source.getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 
				map.getView().getProjection(), {'INFO_FORMAT': 'application/vnd.ogc.gml'});
		
		Meteor.call('getLandschapsType', url, function(err, result) {
			if(result === 'Dalbodem') {
				Session.set('landschapstypeId', Meteor.settings.public.dalId);
				Session.set('mapCoordinates', evt.coordinate);
			} else if(result === 'Helling > 4 graden' || result === 'Helling < 4 graden') {
				Session.set('landschapstypeId', Meteor.settings.public.hellingId);
				Session.set('mapCoordinates', evt.coordinate);
			} else if(result === 'Tussenterras' || result === 'Plateau' || result === 'Groeve' || 
					result === 'Geisoleerde heuvel') {
				Session.set('landschapstypeId', Meteor.settings.public.plateauId);
				Session.set('mapCoordinates', evt.coordinate);
			} else {
				Session.set('landschapstypeId', null);
				Session.set('mapCoordinates', null);
			}
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
});

Template.step_3.helpers({
	getLandschapsType: function() {
		$('#lt-text').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('landschapstypeId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var header = document.createElement('p');
						$(header).attr('class', 'header');
						header.innerHTML = 'Landschapstype';
						$('#lt-text').append(header);
						
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#lt-text').append(div);
					}
				});
			});
		}
	},
	getKernKwaliteit: function() {
		$('#kk-text').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('kernkwaliteitId'), function(err, result) {
					if(typeof result !== 'undefined') {
						var header = document.createElement('p');
						$(header).attr('class', 'header');
						header.innerHTML = 'Kernkwaliteit';
						$('#kk-text').append(header);
						
						var div = document.createElement('div');
						$(div).attr('class', 'col-xs-12 text-div');
						$(div).append(result.content);
						$('#kk-text').append(div);
					}
				});
			});
		}
	},
	getLeidendeBeginselen: function() {
		$('#lb-text').empty();
		
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
						if(index === 0) {
							var header = document.createElement('p');
							$(header).attr('class', 'header');
							header.innerHTML = 'Leidende beginselen';
							$('#lb-text').append(header);
						}
						
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'leidendbeginsel-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#lb-text').append(outerDiv);
							
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
										
										cleanImages('lb-text');
										
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
										
										cleanImages('lb-text');
										
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
	},
	getOntwerpPrincipes: function() {
		$('#op-text').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' && Session.get('landschapstypeId') !== null &&
				typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null &&
				typeof Session.get('kernkwaliteitId') !== 'undefined' && Session.get('kernkwaliteitId') !== null) {
			HTTP.get("http://148.251.183.26/handvat-admin/coupling/ontwerp/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getOntwerpen', result.content, 
						Session.get('landschapstypeId'), 
						Session.get('sectorId'),
						Session.get('kernkwaliteitId'),
						function(err, result) {
					
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						if(index === 0) {
							var header = document.createElement('p');
							$(header).attr('class', 'header');
							header.innerHTML = 'Ontwerpprincipes';
							$('#op-text').append(header);
						}
						
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
							$(outerDiv).attr('class', 'col-xs-12 text-div');
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#op-text').append(outerDiv);
							
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
										
										cleanImages('op-text');
										
										$(innerDiv).append(result.content);
									}
								});
							});
							
							$(outerDiv).append(innerDiv);
							
							divCount++;
						
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6 text-div');
							$('#ontwerpprincipe-' + itemCount).append(innerDiv);
							
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
										
										cleanImages('op-text');
										
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

function cleanImages(div) {
	$.each($('#' + div + ' img'), function(index, item) {
		var src = $(item).attr('src');
		
		if(typeof src === 'undefined') {
			$(item).remove();
		} else {
			$(item).removeAttr('style');
			$(item).attr('class', 'text-div-img');
		}
	});
}

Template.step_3.events ({
	'click .kernkwaliteit-img': function(e) {
		Session.set('kernkwaliteitId', e.target.id);
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.openBeslotenId) {
			map.getLayers().clear();
			
			var layer1 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'masker_zuid_limburg_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer2 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'masker_beschermingsgebied_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer3 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'boom', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer4 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'bomenrij', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer5 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'heg_haag', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer6 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'landschapstypen_v_plateau', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer7 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'top10nl_relief_hogezijde_l', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer8 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'beheertypenkaart_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer9 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'dorpsmantel_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer10 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'bos_boomgaard_kwekerij', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer11 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'top10nl_spoorbaandeel_l', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer12 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/schaalcontrast_open_besloten?', 
					params: {'LAYERS': 'landschapstypen_v', 'VERSION': '1.1.1'} 
				})
			});
			
			map.addLayer(layer1);
			map.addLayer(layer2);
			map.addLayer(layer3);
			map.addLayer(layer4);
			map.addLayer(layer5);
			map.addLayer(layer6);
			map.addLayer(layer7);
			map.addLayer(layer8);
			map.addLayer(layer9);
			map.addLayer(layer10);
			map.addLayer(layer11);
			map.addLayer(layer12);
		}
		
		if(Session.get('kernkwaliteitId') === Meteor.settings.public.cultuurhistorieId) {
			map.getLayers().clear();
			
			var layer1 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'cultuurlandschap_zl_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer2 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'masker_zuid_limburg_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer3 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'masker_beschermingsgebied_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer4 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'rijksmonumenten_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer5 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'geologisch_monument_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer6 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'lvzl_kloosters_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer7 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'lvzl_sympoint_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer8 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'lvzl_kerken_point_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer9 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'cultuurhistorische_elementen_p', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer10 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'cultuurhistorische_elementen_l', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer11 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'cultuurhistorische_elementen_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer12 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'Cultuurlandschap_ZL_L', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer13 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'prov_archeol_aandachtsgeb_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer14 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'historische_buitenplaatsen_v', 'VERSION': '1.1.1'} 
				})
			});
			
			var layer15 = new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://portal.prvlimburg.nl/geoservices/cultuurhistoriekaart?', 
					params: {'LAYERS': 'archeologische_monumenten_v', 'VERSION': '1.1.1'} 
				})
			});
			
			map.addLayer(layer1);
			map.addLayer(layer2);
			map.addLayer(layer3);
			map.addLayer(layer4);
			map.addLayer(layer5);
			map.addLayer(layer6);
			map.addLayer(layer7);
			map.addLayer(layer8);
			map.addLayer(layer9);
			map.addLayer(layer10);
			map.addLayer(layer11);
			map.addLayer(layer12);
			map.addLayer(layer13);
			map.addLayer(layer14);
			map.addLayer(layer15);
		}
	}
});