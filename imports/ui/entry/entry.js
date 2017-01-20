import './entry.html';
import './entry.css';

Template.entry.onRendered(function() {
	setCursorInProgress();
	
	Session.set('stepNumber', 'entry');
	
	HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/" 
			+ Meteor.settings.public.entree, {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		if(result.data !== null) {
			$('#container-entry').append(result.data.html);
		}
		
		setCursorDone();
	});
});

Template.entry.events({
	'click #container-entry': function() {
		Router.go('start');
	}
});