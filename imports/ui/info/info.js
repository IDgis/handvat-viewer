import './info.html';
import './info.css';

Template.info.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'info');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
			+ Meteor.settings.public.infoLinks, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(typeof result.data !== 'undefined') {
			$('#text-container-info').append(result.data.html);
		}
	});
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
			+ Meteor.settings.public.infoRechts, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(typeof result.data !== 'undefined') {
			$('#viewer-container-info').append(result.data.html);
		}
		
		setCursorDone();
	});
});