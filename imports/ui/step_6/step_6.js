import './step_6.html';
import './step_6.css';

Template.step_6.onRendered(function() {
	Session.set('stepNumber', '6');
	$('#tabs-main-img').attr('src', '../images/step_6.jpg');
	$('#tabs-main').attr('style', 'margin-top:3px;position:relative;top:0;');
	$('#page').attr('style', 'height:75%;');
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null &&
			typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getText', result.content, Meteor.settings.public.step6Text, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#intro-text-6').append(result.content);
				}
			});
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
	}
});

Template.step_6.events ({
	'click #js-previous-6': function() {
		Router.go('step_5');
	}
});