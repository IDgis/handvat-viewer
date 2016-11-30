import './info.html';
import './info.css';

Template.info.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'info');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.infoLinks, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-info').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.infoRechts, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#viewer-container-info').append(result.content);
			}
		});
		
		setCursorDone();
	});
});