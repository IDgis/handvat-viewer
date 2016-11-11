import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap1Links, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-1').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap1Rechts, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#viewer-container-1').append(result.content);
			}
		});
	});
});