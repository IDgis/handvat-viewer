import './step_4.html';
import './step_4.css';

Template.step_4.onRendered(function() {
	Session.set('stepNumber', '4');
	
	$('#js-previous').attr('style', 'pointer-events:auto;color:#ffffff !important;');
	$('#js-previous-icon').attr('style', 'color:#ffffff !important;');
	
	if(typeof Session.get('sectorName') === 'undefined' || Session.get('sectorName') === null) {
		setImageNoSector();
	}
	
	if(typeof Session.get('area') !== 'undefined' && Session.get('area') !== null) {
		setCursorInProgress();
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/appCoupling/"
				+ Meteor.settings.public.stap4Links, {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			if(result.data !== null) {
				$('#text-4').append(result.data.html);
			}
		});
		
		HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/texttype/sector_icoon", {
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8'
			}
		}, function(err, result) {
			var sectors = $('#js-sectors');
			
			var itemCount = 0;
			var count = 0;
			
			$.each(result.data, function(index, item) {
				var innerDiv = document.createElement('div');
				$(innerDiv).attr('class', 'col-xs-6 sector-img-4');
				$(innerDiv).attr('data-name', item.name);
				
				$(innerDiv).append(item.html);
				
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
			
			setCursorDone();
		});
	} else {
		$('#text-4').append('U heeft geen valide deelgebied geselecteerd.');
	}
});

Template.step_4.helpers({
	setSector: function() {
		setCursorInProgress();
		
		if(typeof Session.get('sectorName') === 'undefined' || Session.get('sectorName') === null) {
			setImageNoSector();
			
			setCursorDone();
		} else {
			HTTP.get(Meteor.settings.public.hostname + "/handvat-admin/text/json/typename/sector/"
					+ Session.get('sectorName'), {
				headers: {
					'Content-Type' : 'application/json; charset=UTF-8'
				}
			}, function(err, result) {
				if(typeof result.data[0] !== 'undefined') {
					Session.set('sectorId', result.data[0].id);
					$('#viewer-4').empty();
					$('#viewer-4').append(result.data[0].html);
				}
				
				setCursorDone();
			});
		}
	},
	setNavBtnStatus: function() {
		if(typeof Session.get('sectorId') !== 'undefined' && Session.get('sectorId') !== null) {
			$('#js-next').attr('style', 'pointer-events:auto;color:#ffffff !important;');
			$('#js-next-icon').attr('style', 'color:#ffffff !important;');
		} else {
			$('#js-next').attr('style', 'pointer-events:none;color:grey !important;');
			$('#js-next-icon').attr('style', 'color:grey !important;');
		}
	}
});

Template.step_4.events({
	'click .sector-img-4': function(e) {
		Session.set('sectorName', $(e.currentTarget).attr('data-name'));
	}
});

function setImageNoSector() {
	var img = document.createElement('img');
	$(img).attr('id', 'no-sector-selected-img-4');
	$(img).attr('src', 
			Meteor.absoluteUrl() + Meteor.settings.public.domainSuffix + '/images/no_sector.jpg');
	
	$('#viewer-4').empty();
	$('#viewer-4').append(img);
}