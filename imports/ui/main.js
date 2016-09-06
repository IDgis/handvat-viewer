import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Router } from 'meteor/iron:router';

import './main.css';
import './main.html';

Template.main.onRendered(function() {
	var bannerWidth = $('#banner').width();
	var bannerHeight = bannerWidth / 13.09375;
	
	var titleOffset = (bannerHeight / 2) - 22;
	$('#banner-title').attr('style', 'top:' + titleOffset + 'px');
	
	var linksOffset = bannerHeight - 22 - 15;
	$('#banner-links').attr('style', 'top:' + linksOffset + 'px');
});