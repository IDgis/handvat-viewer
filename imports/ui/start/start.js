import './start.html';
import './start.css';

Template.start.onRendered(function() {
	Session.set('stepNumber', 'start');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/step_1.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	
	$('#js-previous').attr('style', 'pointer-events:none;color:grey !important;');
	$('#js-previous-icon').attr('style', 'color:grey !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.startText, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-start').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.startImage, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#viewer-container-start').append(result.content);
			}
		});
	});
});