import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTexts', result.content, 'kernkwaliteit', function(err, result) {
			var select = $('select[id=js-temp-kernkwaliteiten]');
			$.each(select, function(index, item) {
				item.add(document.createElement('option'));
				$.each(result, function(idx, el) {
					var option = document.createElement('option');
					option.value = el.id;
					option.innerHTML = el.name;
					item.add(option);
				});
			});
		});
	});
});

Template.step_3.helpers({
	getOntwerpPrincipes: function() {
		if(typeof Session.get('landschapstypeId') !== 'undefined' &&
				typeof Session.get('sectorId') !== 'undefined' &&
				typeof Session.get('kernkwaliteitId') !== 'undefined') {
			HTTP.get("http://148.251.183.26/handvat-admin/coupling/ontwerp/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getOntwerpen', result.content, 
						Session.get('landschapstypeId'), 
						Session.get('sectorId'),
						Session.get('kernkwaliteitId'),
						function(err, result) {
					$('#text-container').empty();
					
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6');
							$('#text-container').append(outerDiv);
							
							$.each(item.ontwerpprincipes, function(idx, el) {
								HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
									headers: {
										'Content-Type' : 'application/json; charset=UTF-8'
									}
								}, function(err, result) {
									Meteor.call('getText', result.content, el, function(err, result) {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										$(innerDiv).append(result.content);
									});
								});
							});
							
							$(outerDiv).append(innerDiv);
							
							divCount++;
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6');
							$('#ontwerpprincipe-' + itemCount).append(innerDiv);
							
							$.each(item.ontwerpprincipes, function(idx, el) {
								HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
									headers: {
										'Content-Type' : 'application/json; charset=UTF-8'
									}
								}, function(err, result) {
									Meteor.call('getText', result.content, el, function(err, result) {
										$.each(result.images, function(ix, elt) {
											$(innerDiv).append(elt);
										});
										
										$(innerDiv).append(result.content);
									});
								});
							});
							
							itemCount++;
							divCount = 0;
						}
					});
					
					$.each($('#text-container img'), function(index, item) {
						var src = $(item).attr('src');
						
						if(typeof src === 'undefined') {
							$(item).remove();
						} else {
							$(item).removeAttr('style');
							$(item).attr('class', 'ontwerpprincipe-img');
						}
					});
				});
			});
		}
	}
});

Template.step_3.events ({
	'change #js-temp-kernkwaliteiten': function(e) {
		Session.set('kernkwaliteitId', e.target.value);
	}
});