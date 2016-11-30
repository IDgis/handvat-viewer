import './start.html';
import './start.css';

Template.start.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'start');
	
	$('#js-previous').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-previous-icon').attr('style', 'color:grey !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.startLinks, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-start').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.startRechts, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#viewer-container-start').append(result.content);
			}
		});
		
		setCursorDone();
	});
});