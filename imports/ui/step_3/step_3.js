import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
	
	HTTP.get("http://localhost:5000/text/json", {
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
	getLandschapsType: function() {
		$('#lt-text').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined') {
			HTTP.get("http://localhost:5000/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('landschapstypeId'), function(err, result) {
					var div = document.createElement('div');
					$(div).attr('class', 'col-xs-12 text-div');
					$(div).append(result.content);
					$('#lt-text').append(div);
				});
			});
		}
	},
	getKernKwaliteit: function() {
		$('#kk-text').empty();
		
		if(typeof Session.get('kernkwaliteitId') !== 'undefined') {
			HTTP.get("http://localhost:5000/text/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getText', result.content, Session.get('kernkwaliteitId'), function(err, result) {
					var div = document.createElement('div');
					$(div).attr('class', 'col-xs-12 text-div');
					$(div).append(result.content);
					$('#kk-text').append(div);
				});
			});
		}
	},
	getOntwerpPrincipes: function() {
		$('#op-text').empty();
		
		if(typeof Session.get('landschapstypeId') !== 'undefined' &&
				typeof Session.get('sectorId') !== 'undefined' &&
				typeof Session.get('kernkwaliteitId') !== 'undefined') {
			HTTP.get("http://localhost:5000/coupling/ontwerp/json", {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				Meteor.call('getOntwerpen', result.content, 
						Session.get('landschapstypeId'), 
						Session.get('sectorId'),
						Session.get('kernkwaliteitId'),
						function(err, result) {
					
					itemCount = 1;
					divCount = 0;
					
					$.each(result, function(index, item) {
						$.each(item.ontwerpprincipes, function(idx, el) {
							if(divCount === 0) {
								var outerDiv = document.createElement('div');
								$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
								$(outerDiv).attr('class', 'col-xs-12 text-div');
								
								var innerDiv = document.createElement('div');
								$(innerDiv).attr('class', 'col-xs-6 text-div');
								$('#op-text').append(outerDiv);
								
								HTTP.get("http://localhost:5000/text/json", {
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
								
								$(outerDiv).append(innerDiv);
								
								divCount++;
							
							} else {
								var innerDiv = document.createElement('div');
								$(innerDiv).attr('class', 'col-xs-6 text-div');
								$('#ontwerpprincipe-' + itemCount).append(innerDiv);
								
								$.each(item.ontwerpprincipes, function(idx, el) {
									HTTP.get("http://localhost:5000/text/json", {
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
						
						return false;
					});
					
					$.each($('#op-text img'), function(index, item) {
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