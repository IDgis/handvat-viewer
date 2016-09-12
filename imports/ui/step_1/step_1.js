import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/step_1.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	$('#tabs-main').attr('style', 'margin-top:3px;position:relative;top:0;');
	$('#page').attr('style', 'height:75%;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.step1Text, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-1').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.step1Image, function(err, result) {
			if(typeof result !== 'undefined') {
				$.each(result.images, function(index, item) {
					$('#viewer-container-1').append(item);
				});
				
				$.each($('#viewer-container-1 img'), function(index, item) {
					var src = $(item).attr('src');
					
					if(typeof src === 'undefined') {
						$(item).remove();
					} else {
						$(item).removeAttr('style');
						$(item).attr('class', 'text-1-img');
					}
				});
			}
		});
	});
});

Template.step_1.events ({
	'click #js-previous-1': function() {
		Router.go('explain');
	},
	'click #js-next-1': function() {
		Router.go('step_2');
	}
});