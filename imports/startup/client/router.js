import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '../../ui/main.js';

import '../../ui/step_1/step_1.js';
import '../../ui/step_2/step_2.js';

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('step_1');
}, {
  name: 'step_1'
});

Router.route('/2', function () {
  this.render('step_2');
}, {
  name: 'step_2'
});