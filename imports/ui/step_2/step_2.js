import './step_2.html';
import './step_2.css';

Template.step_2.onRendered(function() {
	Session.set('stepNumber', '2');
});