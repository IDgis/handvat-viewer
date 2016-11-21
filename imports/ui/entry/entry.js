import './entry.html';
import './entry.css';

Template.entry.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'entry');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.entree, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#container-entry').append(result.content);
			}
		});
		
		setCursorDone();
	});
});

Template.entry.events({
	'click #container-entry': function() {
		Router.go('start');
	}
});