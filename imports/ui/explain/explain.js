import './explain.html';
import './explain.css';

Template.explain.onRendered(function() {
	Session.set('stepNumber', 'explain');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.uitlegLinks, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-explain').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.uitlegRechts, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#viewer-container-explain').append(result.content);
			}
		});
	});
});