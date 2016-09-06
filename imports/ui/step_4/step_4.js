import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.step4Text, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-4').append(result.content);
			}
		});
	});
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'sector', function(err, result) {
			var sectors = $('#js-sectors');
			$.each(result, function(index, item) {
				var button = document.createElement('button');
				$(button).append(item.name);
				$(button).attr('class', 'btn btn-default btn-lg col-xs-12 sector-btn-4');
				$(button).attr('data-id', item.id);
				$(button).attr('data-name', item.name);
				
				$(sectors).append(button);
			});
		});
	});
});

Template.step_4.events ({
	'click .sector-btn-4': function(e) {
		var id = $(e.target).attr('data-id');
		Session.set('sectorName', $(e.target).attr('data-name'));
		
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getText', result.content, id, function(err, result) {
				if(typeof result !== 'undefined') {
					var buttons = $('.sector-btn-4');
					$.each(buttons, function(index, item) {
						$(item).attr('class', 'btn btn-default btn-lg col-xs-12 sector-btn-4');
					});
					
					$(e.target).attr('class', 'btn btn-default btn-lg col-xs-12 sector-btn-4 sector-btn-4-active');
					
					Session.set('sectorId', id);
					$('#viewer-4').empty();
					$('#viewer-4').append(result.content);
				}
			});
		});
	},
	'click #js-next-4': function() {
		Router.go('step_5');
	}
});