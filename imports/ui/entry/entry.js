import './entry.html';
import './entry.css';

Template.entry.onRendered(function() {
	Session.set('stepNumber', 'entry');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.entryImage, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#container-entry').append(result.content);
			}
		});
	});
});

Template.entry.events({
	'click #container-entry': function() {
		Router.go('start');
	}
});