import './step_6.html';
import './step_6.css';

Template.step_6.onRendered(function() {
	Session.set('stepNumber', '6');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-next-icon').attr('style', 'color:grey !important;');
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		setCursorInProgress();
		
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
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
	}
});

Template.step_6.events({
	'click #js-print-6': function(e) {
		var title = $('#input-title-6')[0].value.trim();
		var name = $('#input-name-6')[0].value.trim();
		var address = $('#input-address-6')[0].value.trim();
		var residence = $('#input-residence-6')[0].value.trim();
		var comment = $('#input-comment-6')[0].value.trim();
		
		if(title === '') {
			$('#alert-title-6').css('display', 'block');
		} else {
			$('#alert-title-6').css('display', 'none');
			Session.set('titleInitiative', title);
		}
		
		if(name === '') {
			$('#alert-name-6').css('display', 'block');
		} else {
			$('#alert-name-6').css('display', 'none');
			Session.set('nameInitiator', name);
		}
		
		if(address === '') {
			$('#alert-address-6').css('display', 'block');
		} else {
			$('#alert-address-6').css('display', 'none');
			Session.set('addressInitiator', address);
		}
		
		if(residence === '') {
			$('#alert-residence-6').css('display', 'block');
		} else {
			$('#alert-residence-6').css('display', 'none');
			Session.set('residenceInitiator', residence);
		}
		
		if(comment.split(' ').length > 200) {
			$('#alert-comment-6').css('display', 'block');
		} else {
			$('#alert-comment-6').css('display', 'none');
			
			if(comment !== '') {
				Session.set('commentInitiator', comment);
			}
		}
	}
});