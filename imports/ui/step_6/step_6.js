import './step_6.html';
import './step_6.css';

Template.step_6.onRendered(function() {
	Session.set('stepNumber', '6');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-next-icon').attr('style', 'color:grey !important;');
	
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('mapCoordinates') === 'undefined') {
		var extent = [165027, 306558, 212686, 338329];
		var center = [188856, 322443];
	} else {
		var extent = Session.get('mapExtent');
		var center = Session.get('mapCoordinates');
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
		target: 'map-6',
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
	
	if(Session.get('mapCoordinates') !== null && typeof Session.get('mapCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('mapCoordinates'));
		map.addLayer(iconLayer);
	}
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		setCursorInProgress();
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap6Links, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#intro-text-6').append(result.content);
				}
			});
			
			setCursorDone();
		});
	} else {
		$('#text-6').attr('style', 'display:none;');
		
		if((typeof Session.get('area') === 'undefined' || Session.get('area') === null) &&
				(typeof Session.get('sectorId') === 'undefined' || Session.get('sectorId') === null)) {
			$('#intro-text-6').append('U heeft geen valide deelgebied en geen sector geselecteerd.');
		} else if(typeof Session.get('area') === 'undefined' || Session.get('area') === null) {
			$('#intro-text-6').append('U heeft geen valide deelgebied geselecteerd.');
		} else if(typeof Session.get('sectorId') === 'undefined' || Session.get('sectorId') === null) {
			$('#intro-text-6').append('U heeft geen sector geselecteerd.');
		}
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

Template.step_6.helpers({
	getSector: function() {
		var sectorName = Session.get('sectorName');
		
		if(typeof sectorName !== 'undefined') {
			return sectorName;
		} else {
			return "niets ingevuld";
		}
	},
	getLocation: function() {
		var location = Session.get('location');
		
		if(typeof location !== 'undefined') {
			return location;
		} else {
			return "niets ingevuld";
		}
	},
	disableElement: function() {
		if(typeof Session.get('mapCoordinates') === 'undefined' || Session.get('mapCoordinates') === null) {
			return 'disabled';
		}
	}
});

Template.step_6.events({
	'click #js-print-6': function(e) {
		var title = $('#input-title-6')[0].value.trim();
		var name = $('#input-name-6')[0].value.trim();
		var address = $('#input-address-6')[0].value.trim();
		var residence = $('#input-residence-6')[0].value.trim();
		var comment = $('#input-comment-6')[0].value.trim();
		
		var goToPrint = true;
		
		if(title === '') {
			$('#alert-title-6').css('display', 'block');
			goToPrint = false;
		} else {
			$('#alert-title-6').css('display', 'none');
			Session.set('titleInitiative', title);
		}
		
		if(name === '') {
			$('#alert-name-6').css('display', 'block');
			goToPrint = false;
		} else {
			$('#alert-name-6').css('display', 'none');
			Session.set('nameInitiator', name);
		}
		
		if(address === '') {
			$('#alert-address-6').css('display', 'block');
			goToPrint = false;
		} else {
			$('#alert-address-6').css('display', 'none');
			Session.set('addressInitiator', address);
		}
		
		if(residence === '') {
			$('#alert-residence-6').css('display', 'block');
			goToPrint = false;
		} else {
			$('#alert-residence-6').css('display', 'none');
			Session.set('residenceInitiator', residence);
		}
		
		if(comment.split(' ').length > 200) {
			$('#alert-comment-6').css('display', 'block');
			goToPrint = false;
		} else {
			$('#alert-comment-6').css('display', 'none');
			
			if(comment !== '') {
				Session.set('commentInitiator', comment);
			}
		}
		
		if(goToPrint) {
			Router.go('print');
		}
	},
	'click #set-location-center-6': function() {
		if(typeof Session.get('mapCoordinates') !== 'undefined' && Session.get('mapCoordinates') !== null) {
			map.getView().setCenter(Session.get('mapCoordinates'));
		}
	}
});