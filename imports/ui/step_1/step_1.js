import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', '1');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
			+ Meteor.settings.public.stap1Links, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#text-container-1').append(result.data.html);
		}
	});
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/api/text/app-coupling/"
			+ Meteor.settings.public.stap1Rechts, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#viewer-container-1').append(result.data.html);
		}
		
		setCursorDone();
	});
});