import './start.html';
import './start.css';

Template.start.onRendered(function() {
	Session.set('stepNumber', 'start');
	
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
	});
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.startImage, function(err, result) {
			if(typeof result !== 'undefined') {
				$.each(result.images, function(index, item) {
					var src = $(item).attr('src');
					
					if(typeof src === 'undefined') {
						$(item).remove();
					} else {
						$(item).removeAttr('style');
						$(item).attr('class', 'text-start-img');
					}
					
					$('#viewer-container-start').append(item);
				});
				
				$.each($('#viewer-container-start img'), function(index, item) {
					var src = $(item).attr('src');
					
					if(typeof src === 'undefined') {
						$(item).remove();
					} else {
						$(item).removeAttr('style');
						$(item).attr('class', 'text-start-img');
					}
				});
			}
		});
	});
});

Template.start.events ({
	'click #js-next-start': function() {
		Router.go('step_1');
	}
});