import './explain.html';
import './explain.css';

Template.explain.onRendered(function() {
	Session.set('stepNumber', 'explain');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/no_step.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	$('#tabs-main').attr('style', 'margin-top:0;position:relative;top:-4px;');
	$('#page').attr('style', 'height:78%;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.explainText, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-explain').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.explainImage, function(err, result) {
			if(typeof result !== 'undefined') {
				$.each(result.images, function(index, item) {
					$('#viewer-container-explain').append(item);
				});
				
				$.each($('#viewer-container-explain img'), function(index, item) {
					var src = $(item).attr('src');
					
					if(typeof src === 'undefined') {
						$(item).remove();
					} else {
						$(item).removeAttr('style');
						$(item).attr('class', 'text-explain-img');
					}
				});
			}
		});
	});
});

Template.explain.events ({
	'click #js-previous-explain': function() {
		Router.go('start');
	},
	'click #js-next-explain': function() {
		Router.go('step_1');
	}
});