import './print.html';
import './print.css';

Template.print.onRendered(function() {
	var chapter = 4;
	var page = 5;
	
	if(Session.get('chapterDeelgebied')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Deelgebied - pagina ' + page + '</p>');
		page++;
	}
	
	if(Session.get('chapterBeginselen')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Leidende beginselen - pagina ' + page + '</p>');
		page += 2;
	}
	
	if(Session.get('chapterSector')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Sector - pagina ' + page + '</p>');
		page++;
	}
	
	if(Session.get('chapterOntwerpprincipes')) {
		chapter++;
		$('#print-index').append('<p class="negate-margin">Hoofdstuk ' + chapter + ' - Ontwerpprincipes - pagina ' + page + '</p>');
	}
});

Template.print.helpers({
	getLocation: function() {
		return Session.get('location');
	},
	getTitle: function() {
		return Session.get('titleInitiative');
	},
	getName: function() {
		return Session.get('nameInitiator');
	},
	getDate: function() {
		var today = new Date();
		var todayDay = today.getDate();
		var todayMonth = today.getMonth() + 1;
		var todayYear = today.getFullYear();
		
		return todayDay + '-' + todayMonth + '-' + todayYear;
	}
});