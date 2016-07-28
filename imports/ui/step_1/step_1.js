import './step_1.html';
import './step_1.css';

Template.step_1.onRendered(function() {
	Session.set('stepNumber', '1');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getLandschapsTypen', result.content, function(err, result) {
			var select = $('select[id=js-temp-landschapstypen]');
			$.each(select, function(index, item) {
				$.each(result, function(idx, el) {
					var option = document.createElement('option');
					option.id = el.id;
					option.value = el.name;
					option.innerHTML = el.name;
					item.add(option);
				});
			});
		});
	});
});