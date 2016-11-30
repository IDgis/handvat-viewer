import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null) {
		setCursorInProgress();
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.stap4Links, function(err, result) {
				if(typeof result !== 'undefined') {
					$('#text-4').append(result.content);
				}
			});
			
			Meteor.call('getTexts', result.content, 'sector_icoon', function(err, result) {
				var sectors = $('#js-sectors');
				
				var itemCount = 0;
				var count = 0;
				$.each(result, function(index, item) {
					var innerDiv = document.createElement('div');
					$(innerDiv).attr('class', 'col-xs-6');
					
					$(innerDiv).append(item.content);
					
					var span = document.createElement('span');
					$(span).append(item.name);
					$(span).attr('class', 'sector-btn-4');
					$(span).attr('data-name', item.name);
					
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
			
			setCursorDone();
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
		setCursorInProgress();
		
		var sectorName = $(e.target).attr('data-name');
		Session.set('sectorName', sectorName);
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTexts', result.content, 'sector', function(err, result) {
				if(typeof result !== 'undefined') {
					$.each(result, function(index, item) {
						if(item.name === sectorName) {
							Session.set('sectorId', item.id);
							$('#viewer-4').empty();
							$('#viewer-4').append(item.content);
						}
					});
				}
				
				if(typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
					$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
					$('#js-next-icon').attr('style', 'color:#ffffff !important;');
				} else {
					$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
					$('#js-next-icon').attr('style', 'color:grey !important;');
				}
			});
			
			setCursorDone();
		});
	}
});