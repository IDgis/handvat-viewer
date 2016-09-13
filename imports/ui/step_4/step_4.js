import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
	var stepBarUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/step_4.jpg';
	
	$('#tabs-main-img').attr('src', stepBarUrl);
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null) {
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getText', result.content, Meteor.settings.public.step4Text, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#text-4').append(result.content);
				}
			});
			
			Meteor.call('getTexts', result.content, 'sector', function(err, result) {
				var sectors = $('#js-sectors');
				
				var itemCount = 0;
				var count = 0;
				$.each(result, function(index, item) {
					var innerDiv = document.createElement('div');
					$(innerDiv).attr('class', 'col-xs-6');
					
					var image = $(item.images[0])[0];
					
					$(image).removeAttr('style');
					$(image).attr('class', 'sector-btn-4');
					$(image).attr('data-id', item.id);
					$(image).attr('data-name', item.name);
					
					$(innerDiv).append(image);
					
					var span = document.createElement('span');
					$(span).append(item.name);
					
					$(innerDiv).append(span);
					
					if(count === 0) {
						var outerDiv = document.createElement('div');
						$(outerDiv).attr('class', 'col-xs-12 text-div');
						$(outerDiv).attr('id', 'sector-' + itemCount);
						$(outerDiv).append(innerDiv);
						$(sectors).append(outerDiv);
						
						count++;
					} else {
						$('#sector-' + itemCount).append(innerDiv);
						
						itemCount++;
						count = 0;
					}
				});
			});
		});
	} else {
		$('#text-4').append('U heeft geen valide deelgebied geselecteerd.');
	}
	
	if(typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
		$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
		$('#js-next-icon').attr('style', 'color:#ffffff !important;');
	} else {
		$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
		$('#js-next-icon').attr('style', 'color:grey !important;');
	}
});

Template.step_4.events ({
	'click .sector-btn-4': function(e) {
		var id = $(e.target).attr('data-id');
		Session.set('sectorName', $(e.target).attr('data-name'));
		
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getText', result.content, id, function(err, result) {
				if(typeof result !== 'undefined') {
					var buttons = $('.sector-btn-4');
					$.each(buttons, function(index, item) {
						$(item).attr('class', 'sector-btn-4');
					});
					
					$(e.target).attr('class', 'sector-btn-4 sector-btn-4-active');
					
					Session.set('sectorId', id);
					$('#viewer-4').empty();
					$('#viewer-4').append(result.content);
				}
				
				if(typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
					$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
					$('#js-next-icon').attr('style', 'color:#ffffff !important;');
				} else {
					$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
					$('#js-next-icon').attr('style', 'color:grey !important;');
				}
			});
		});
	}
});