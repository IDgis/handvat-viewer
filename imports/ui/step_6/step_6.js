import './step_6.html';
import './step_6.css';

Template.step_6.onRendered(function() {
	Session.set('stepNumber', '6');
	$('#tabs-main-img').attr('src', '../images/step_6.jpg');
	$('#tabs-main').attr('style', 'margin-top:3px;position:relative;top:0;');
	$('#page').attr('style', 'height:75%;');
	
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
});

Template.step_6.helpers({
	getLandschapstype: function() {
		var ltName = Session.get('landschapstypeName');
		
		if(ltName !== null && typeof ltName !== 'undefined') {
			return ltName;
		} else {
			return "niets ingevuld";
		}
	},
	getSector: function() {
		var sectorName = Session.get('sectorName');
		
		if(typeof sectorName !== 'undefined') {
			return sectorName;
		} else {
			return "niets ingevuld";
		}
	}
});