import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Router } from 'meteor/iron:router';

import './main.css';
import './main.html';

Template.main.onRendered(function() {
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'sector', function(err, result) {
			var ul = $('ul[id=js-sectors]');
			$.each(ul, function(index, item) {
				$.each(result, function(idx, el) {
					var li = document.createElement('li');
					li.id = "sector-" + idx;
					$('#js-sectors').append(li);
					
					var a = document.createElement('a');
					a.id = el.id;
					a.innerHTML = el.name;
					$('#sector-' + idx).append(a);
				});
			});
		});
	});
});

Template.main.helpers({
	showSectorChoice: function() {
		return Session.get('stepNumber') === '2';
	},
	disablePreviousButton: function() {
		if(Session.get('stepNumber') === '1') {
			return "disabled";
		}
	},
	disableNextButton: function() {
		if(Session.get('stepNumber') === '6') {
			return "disabled";
		}
	},
	activeStep: function(step) {
		if(Session.equals('stepNumber', step)) {
			return "active";
		}
	},
	getSectorLabel: function() {
		if(typeof Session.get('sectorLabel') === 'undefined') {
			return "geen sector geselecteerd";
		} else {
			return Session.get('sectorLabel');
		}
	}
});

Template.main.events ({
	'click #js-sectors li a': function (e) {
		Session.set('sectorLabel', e.target.textContent);
		Session.set('sectorId', e.target.id);
		
		var sectorElement = $('#sector-dropdown-label');
		$.each(sectorElement, function(index, item) {
			$(item).removeAttr('style');
		});
		
		if(typeof Session.get('mapExtent') !== 'undefined' && Session.get('mapCenter') !== 'undefined') {
			Router.go('step_3');
		}
	},
	'click #js-next-step': function() {
		if(Session.get('stepNumber') === '1') {
			Router.go('step_2');
		} else if(Session.get('stepNumber') === '2') {
			Router.go('step_3');
		} else if(Session.get('stepNumber') === '3') {
			Router.go('step_4');
		} else if(Session.get('stepNumber') === '4') {
			Router.go('step_5');
		} else if(Session.get('stepNumber') === '5') {
			Router.go('step_6');
		}
	},
	'click #js-previous-step': function() {
		if(Session.get('stepNumber') === '2') {
			Router.go('step_1');
		} else if(Session.get('stepNumber') === '3') {
			Router.go('step_2');
		} else if(Session.get('stepNumber') === '4') {
			Router.go('step_3');
		} else if(Session.get('stepNumber') === '5') {
			Router.go('step_4');
		} else if(Session.get('stepNumber') === '6') {
			Router.go('step_5');
		}
	}
});