import './start.html';
import './start.css';

Template.start.onRendered(function() {
	Session.set('stepNumber', 'start');
});