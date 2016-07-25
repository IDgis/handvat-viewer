import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '../../ui/main.js';

import '../../ui/intro/intro.js';

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('intro');
}, {
  name: 'intro'
});