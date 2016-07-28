import './step_3.html';
import './step_3.css';

Template.step_3.onRendered(function() {
	Session.set('stepNumber', '3');
});

Template.step_3.helpers({
	getOntwerpPrincipe: function() {
		HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			Meteor.call('getTexts', result.content, 'ontwerpprincipe', function(err, result) {
				$('#text-container').empty();
				
				itemCount = 1;
				divCount = 0;
				
				$.each(result, function(index, item) {
					if(item.images.length > 0) {
						if(divCount === 0) {
							var outerDiv = document.createElement('div');
							$(outerDiv).attr('class', 'col-xs-12');
							$(outerDiv).attr('id', 'ontwerpprincipe-' + itemCount);
							
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6');
							$('#text-container').append(outerDiv);
							
							$.each(item.images, function(idx, el) {
								$(innerDiv).append(el);
							});
							
							$(innerDiv).append(item.content);
							$(outerDiv).append(innerDiv);
							
							divCount++;
						} else {
							var innerDiv = document.createElement('div');
							$(innerDiv).attr('class', 'col-xs-6');
							$('#ontwerpprincipe-' + itemCount).append(innerDiv);
							
							$.each(item.images, function(idx, el) {
								$(innerDiv).append(el);
							});
							
							$(innerDiv).append(item.content);
							
							itemCount++;
							divCount = 0;
							
							//return false;
						}
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
});