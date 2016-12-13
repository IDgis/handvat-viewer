import './print.html';
import './print.css';

Template.print.onRendered(function() {
	
});

Template.print.helpers({
	getLocation: function() {
		return Session.get('location');
	},
	getTitle: function() {
		return Session.get('titleInitiative');
	},
	getName: function() {
		return Session.get('nameInitiator');
	},
	getDate: function() {
		var today = new Date();
		var todayDay = today.getDate();
		var todayMonth = today.getMonth() + 1;
		var todayYear = today.getFullYear();
		
		return todayDay + '-' + todayMonth + '-' + todayYear;
	}
});