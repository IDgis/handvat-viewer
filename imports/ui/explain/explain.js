import './explain.html';
import './explain.css';

Template.explain.onRendered(function() {
	Session.set('stepNumber', 'explain');
	
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
	});
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
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
	'click #js-next-explain': function() {
		Router.go('step_1');
	}
});