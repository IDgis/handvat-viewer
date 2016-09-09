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
	
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var titleOffset = (bannerHeight / 2) - 22;
	$('#banner-title').attr('style', 'top:' + titleOffset + 'px');
	
	var linksOffset = bannerHeight - 22 - 15;
	$('#banner-links').attr('style', 'top:' + linksOffset + 'px');
});