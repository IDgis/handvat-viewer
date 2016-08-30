import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '../../ui/main.js';

import '../../ui/start/start.js';
import '../../ui/step_1/step_1.js';
import '../../ui/step_2/step_2.js';
import '../../ui/step_3/step_3.js';
import '../../ui/step_4/step_4.js';
import '../../ui/step_5/step_5.js';

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/handvat-viewer', function () {
	  this.render('start');
	}, {
	  name: 'start'
});

Router.route('/handvat-viewer/1', function () {
  this.render('step_1');
}, {
  name: 'step_1'
});

Router.route('/handvat-viewer/2', function () {
  this.render('step_2');
}, {
  name: 'step_2'
});

Router.route('/handvat-viewer/3', function () {
  this.render('step_3');
}, {
  name: 'step_3'
});

Router.route('/handvat-viewer/4', function () {
	  this.render('step_4');
	}, {
	  name: 'step_4'
});

Router.route('/handvat-viewer/5', function () {
	  this.render('step_5');
	}, {
	  name: 'step_5'
});