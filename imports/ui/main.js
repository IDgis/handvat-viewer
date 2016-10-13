import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Router } from 'meteor/iron:router';

import './main.css';
import './main.html';

Template.main.onRendered(function() {
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
		Meteor.call('getText', result.content, Meteor.settings.public.handleidingId, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#handleiding-main').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.helpId, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#help-main').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.contactId, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#contact-main').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.linksId, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#links-main').append(result.content);
			}
		});
		
		Meteor.call('getText', result.content, Meteor.settings.public.disclaimerId, function(err, result) {
			if(typeof result !== 'undefined') {
				$('#disclaimer-main').append(result.content);
			}
		});
	});
	
	$('#banner').resize(setBannerSize);
	$('#tabs-main').resize(setNavigationSize);
	$('html').resize(setPageHeight);
});

Template.main.events({
	'click #banner-title': function() {
		Router.go('start');
		Session.clear();
	},
	'click #js-home': function() {
		Router.go('start');
		Session.clear();
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

function setNavigationSize() {
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var tabsWidth = $('#tabs-main').width();
	var tabsHeight = tabsWidth / 33.031008;
	
	var navigationOffset = (bannerHeight + (((tabsHeight * 0.6744) / 2)) - 8);
	$('#navigation-buttons').attr('style', 'top:' + navigationOffset + 'px');
}

function setPageHeight() {
	var documentHeight = $(window).height();
	
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var tabsWidth = $('#tabs-main').width();
	var tabsHeight = tabsWidth / 33.031008;
	
	var pageHeight = documentHeight - bannerHeight - tabsHeight - 20 - 45;
	
	$('#page').attr('style', 'height:' + pageHeight + 'px');
}