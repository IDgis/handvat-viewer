import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Router } from 'meteor/iron:router';

import './main.css';
import './main.html';

Template.main.onRendered(function() {
	setCursorInProgress();
	
	var bannerUrl = window.location.protocol + '//' + window.location.hostname + ':' + 
					window.location.port + '/' + Meteor.settings.public.domainSuffix + '/images/banner.jpg';
	
	$('#banner-img').attr('src', bannerUrl);
	
	$(".modal").draggable({
		handle: ".modal-header"
	});
	
	$('.modal-content').resizable({
		alsoResize: ".modal-body"
	});
	
	HTTP.get("http://148.251.183.26/handvat-admin/text/json", {
		headers: {
			'Content-Type' : 'application/json; charset=UTF-8'
		}
	}, function(err, result) {
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.popupHandleiding, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#handleiding-main').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.popupHelp, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#help-main').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.popupContact, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#contact-main').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.popupLinks, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#links-main').append(result.content);
			}
		});
		
		Meteor.call('getTextFromCoupling', result.content, Meteor.settings.public.popupDisclaimer, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#disclaimer-main').append(result.content);
			}
		});
		
		setCursorDone();
	});
	
	String.prototype.replaceAll = function(s1, s2) {  
		var str = this;  
		var pos = str.indexOf(s1);  
		while (pos > -1) {  
			str = str.replace(s1, s2);
			pos = str.indexOf(s1);
		}
		return (str);
	}
	
	$('#banner').resize(setBannerSize);
	$('#tabs').resize(setTabsWidth);
	$('html').resize(setPageHeight);
});

Template.main.helpers({
	doneTab: function(page) {
		var curPage = parseInt(Session.get('stepNumber'));
		
		if(curPage > page) {
			return 'done-tab-step';
		}
	},
	activeTab: function(page) {
		var curPage = parseInt(Session.get('stepNumber'));
		
		if(curPage === page) {
			return 'active';
		}
		
		if(page === 'none' && curPage !== 1 && curPage !== 2 && curPage !== 3 && curPage !== 4 && 
				curPage !== 5 && curPage !== 6) {
			return 'active';
		}
	}
});

Template.main.events({
	'click #banner-title': function() {
		Router.go('start');
		Session.clear();
	},
	'click #js-home': function() {
		Session.clear();
		Router.go('start');
		Session.set('stepNumber', 'start');
	},
	'click #js-previous': function() {
		var step = Session.get('stepNumber');
		
		if(step === 'info') {
			Router.go('start');
		} else if(step === 'explain') {
			Router.go('info');
		} else if(step === '1') {
			Router.go('explain');
		} else if(step === '2') {
			Router.go('step_1');
		} else if(step === '3') {
			Router.go('step_2');
		} else if(step === '4') {
			Router.go('step_3');
		} else if(step === '5') {
			Router.go('step_4');
		} else if(step === '6') {
			Router.go('step_5');
		}
	},
	'click #js-next': function() {
		var step = Session.get('stepNumber');
		
		if(step === 'start') {
			Router.go('info');
		} else if(step === 'info') {
			Router.go('explain');
		} else if(step === 'explain') {
			Router.go('step_1');
		} else if(step === '1') {
			Router.go('step_2');
		} else if(step === '2') {
			Router.go('step_3');
		} else if(step === '3') {
			Router.go('step_4');
		} else if(step === '4') {
			Router.go('step_5');
		} else if(step === '5') {
			Router.go('step_6');
		}
	},
	'click #js-step-1': function() {
		Router.go('step_1');
	},
	'click #js-step-2': function() {
		Router.go('step_2');
	},
	'click #js-step-3': function() {
		Router.go('step_3');
	},
	'click #js-step-4': function() {
		Router.go('step_4');
	},
	'click #js-step-5': function() {
		Router.go('step_5');
	},
	'click #js-step-6': function() {
		Router.go('step_6');
	},
	'click .js-zoom-in': function(e) {
		var body = $(e.target).parent().siblings('.modal-body')[0];
		var zoomOut = $(e.target).siblings('.js-zoom-out')[0];
		
		$(body).removeClass('zoom-level-1');
		$(body).removeClass('zoom-level-2');
		$(body).removeClass('zoom-level-3');
		$(body).removeClass('zoom-level-4');
		$(body).removeClass('zoom-level-5');
		
		var zLevel = $(e.target).attr('data-zoom-level');
		
		if(zLevel === '1') {
			$(body).addClass('zoom-level-2');
			$(e.target).attr('data-zoom-level', '2');
			$(zoomOut).attr('data-zoom-level', '2');
		} else if(zLevel === '2') {
			$(body).addClass('zoom-level-3');
			$(e.target).attr('data-zoom-level', '3');
			$(zoomOut).attr('data-zoom-level', '3');
		} else if(zLevel === '3') {
			$(body).addClass('zoom-level-4');
			$(e.target).attr('data-zoom-level', '4');
			$(zoomOut).attr('data-zoom-level', '4');
		} else if(zLevel === '4' || zLevel === '5') {
			$(body).addClass('zoom-level-5');
			$(e.target).attr('data-zoom-level', '5');
			$(zoomOut).attr('data-zoom-level', '5');
		}
	},
	'click .js-zoom-out': function(e) {
		var body = $(e.target).parent().siblings('.modal-body')[0];
		var zoomIn = $(e.target).siblings('.js-zoom-in')[0];
		
		$(body).removeClass('zoom-level-1');
		$(body).removeClass('zoom-level-2');
		$(body).removeClass('zoom-level-3');
		$(body).removeClass('zoom-level-4');
		$(body).removeClass('zoom-level-5');
		
		var zLevel = $(e.target).attr('data-zoom-level');
		
		if(zLevel === '1') {
			$(body).addClass('zoom-level-1');
			$(e.target).attr('data-zoom-level', '1');
			$(zoomIn).attr('data-zoom-level', '1');
		} else if(zLevel === '2') {
			$(body).addClass('zoom-level-1');
			$(e.target).attr('data-zoom-level', '1');
			$(zoomIn).attr('data-zoom-level', '1');
		} else if(zLevel === '3') {
			$(body).addClass('zoom-level-2');
			$(e.target).attr('data-zoom-level', '2');
			$(zoomIn).attr('data-zoom-level', '2');
		} else if(zLevel === '4') {
			$(body).addClass('zoom-level-3');
			$(e.target).attr('data-zoom-level', '3');
			$(zoomIn).attr('data-zoom-level', '3');
		} else if(zLevel === '5') {
			$(body).addClass('zoom-level-4');
			$(e.target).attr('data-zoom-level', '4');
			$(zoomIn).attr('data-zoom-level', '4');
		}
	}
});

function setBannerSize() {
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var titleOffset = (bannerHeight / 2) - 22;
	$('#banner-title').attr('style', 'top:' + titleOffset + 'px');
	
	var linksOffset = bannerHeight - 22 - 15;
	$('#banner-links').attr('style', 'top:' + linksOffset + 'px');
}

function setTabsWidth() {
	var tabsWidth = $(window).width() + 17;
	
	if(tabsWidth > 789) {
		var tabWidth = (((tabsWidth /3) * 2) / 6) -4;
		$('.tab-step').attr('style', 'width:' + tabWidth + 'px');
	}
}

function setPageHeight() {
	var documentHeight = $(window).height();
	
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var tabsHeight = $('#tabs').height();
	
	var pageHeight = documentHeight - bannerHeight - tabsHeight - 20 - 45;
	
	$('#page').attr('style', 'height:' + pageHeight + 'px');
	
	if(typeof map !== 'undefined') {
		map.updateSize();
	}
}