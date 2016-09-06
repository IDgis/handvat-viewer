import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	$('#tabs-main-img').attr('src', '../images/step_1.jpg');
	$('#tabs-main').attr('style', 'margin-top:3px;position:relative;top:0;');
	$('#page').attr('style', 'height:75%;');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getText', result.content, Meteor.settings.public.step1Text, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#text-container-1').append(result.content);
			}
		});
	});
});

Template.step_1.events ({
	'click #js-next-1': function() {
		Router.go('step_2');
	}
});