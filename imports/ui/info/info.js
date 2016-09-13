import './info.html';
import './info.css';

Template.info.onRendered(function() {
	Session.set('stepNumber', 'info');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/step_1.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.infoText, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-info').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.infoImage, function(err, result) {
			if(typeof result !== 'undefined') {
				$.each(result.images, function(index, item) {
					$('#viewer-container-info').append(item);
				});
				
				$.each($('#viewer-container-info img'), function(index, item) {
					var src = $(item).attr('src');
					
					if(typeof src === 'undefined') {
						$(item).remove();
					} else {
						$(item).removeAttr('style');
						$(item).attr('class', 'text-info-img');
					}
				});
			}
		});
	});
});