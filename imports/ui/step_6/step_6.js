import './step_6.html';
import './step_6.css';

Template.step_6.onRendered(function() {
	Session.set('stepNumber', '6');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-next-icon').attr('style', 'color:grey !important;');
	
	var extent;
	var center;
	if(typeof Session.get('mapExtent') === 'undefined' || typeof Session.get('locationCoordinates') === 'undefined') {
		extent = [165027, 306558, 212686, 338329];
		center = [188856, 322443];
	} else {
		extent = Session.get('mapExtent');
		center = Session.get('locationCoordinates');
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
	var versionTop10 = Meteor.settings.public.top10Service.version;
	var layersTop10 = Meteor.settings.public.top10Service.layers;
	
	layersTop10.forEach(function(item) {
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: urlTop10, 
				params: {'LAYERS': item, 'VERSION': versionTop10} 
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
				params: {'LAYERS': item, 'VERSION': versionInfrastructuur} 
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
	
	if(Session.get('locationCoordinates') !== null && typeof Session.get('locationCoordinates') !== 'undefined') {
		var iconLayer = getIcon(Session.get('locationCoordinates'));
		map.addLayer(iconLayer);
	}
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		setCursorInProgress();
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
				+ Meteor.settings.public.stap6Links, {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#intro-text-6').append(result.data.html);
			}
			
			setCursorDone();
		});
	} else {
		$('#text-6').attr('style', 'display:none;');
		
		var areaBln = typeof Session.get('area') === 'undefined' || Session.get('area') === null;
		var sectorBln = typeof Session.get('sectorId') === 'undefined' || Session.get('sectorId') === null;
		
		if(areaBln && sectorBln) {
			$('#intro-text-6').append('U heeft geen valide deelgebied en geen sector geselecteerd.');
		} else if(areaBln) {
			$('#intro-text-6').append('U heeft geen valide deelgebied geselecteerd.');
		} else if(sectorBln) {
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
		if(typeof Session.get('locationCoordinates') === 'undefined' || Session.get('locationCoordinates') === null) {
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
		
		if($('#js-chapter-deelgebied')[0].checked) {
			Session.set('chapterDeelgebied', true);
		} else {
			Session.set('chapterDeelgebied', false);
		}
		
		if($('#js-chapter-beginselen')[0].checked) {
			Session.set('chapterBeginselen', true);
		} else {
			Session.set('chapterBeginselen', false);
		}
		
		if($('#js-chapter-sector')[0].checked) {
			Session.set('chapterSector', true);
		} else {
			Session.set('chapterSector', false);
		}
		
		if($('#js-chapter-ontwerpprincipes')[0].checked) {
			Session.set('chapterOntwerpprincipes', true);
		} else {
			Session.set('chapterOntwerpprincipes', false);
		}
		
		if(goToPrint) {
			Router.go('print');
		}
	},
	'click #set-location-center-6': function() {
		if(typeof Session.get('locationCoordinates') !== 'undefined' && Session.get('locationCoordinates') !== null) {
			map.getView().setCenter(Session.get('locationCoordinates'));
		}
	}
});