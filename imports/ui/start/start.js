import './start.html';
import './start.css';

Template.start.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'start');
	
	$('#js-previous').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-previous-icon').attr('style', 'color:grey !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
			+ Meteor.settings.public.startLinks, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(typeof result.data !== 'undefined') {
			$('#text-container-start').append(result.data.html);
		}
	});
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
			+ Meteor.settings.public.startRechts, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(typeof result.data !== 'undefined') {
			$('#viewer-container-start').append(result.data.html);
		}
		
		setCursorDone();
	});
});