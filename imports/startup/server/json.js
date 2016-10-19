import { Meteor } from 'meteor/meteor';

Meteor.methods({
	getTexts: function(content, texttype) {
		var array = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.texttype === texttype) {
				var element = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
				array.push(element);
			}
		});
		
		return array;
	},
	getOntwerpen: function(content, landschapstype, sector, kernkwaliteit) {
		var array = [];
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if((item.landschapstype === landschapstype || item.landschapstype === Meteor.settings.algemeenId) && 
					item.sector === sector && item.kernkwaliteit === kernkwaliteit) {
				item.ontwerpprincipe.forEach(function(item) {
					array.push(item);
				});
			}
		});
		
		return array;
	},
	getBeginselen: function(content, landschapstype) {
		var array = [];
		var json = JSON.parse(content);
		var algemeen = Meteor.call('getIdFromCoupling', Meteor.settings.public.Algemeen);
		
		json.forEach(function(item) {
			if(item.landschapstype === landschapstype || item.landschapstype === algemeen) {
				item.leidend_beginsel.forEach(function(item) {
					array.push(item);
				});
			}
		});
		
		return array;
	},
	getTextFromCoupling: function(content, appCoupling) {
		var object;
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.appCoupling === appCoupling) {
				object = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
			}
		});
		
		return object;
	},
	getTextFromId: function(content, id) {
		var object;
		var json = JSON.parse(content);
		json.forEach(function(item) {
			if(item.id === id) {
				object = {'id': item.id, 'name' : item.name, 'content' : item.html, 'images' : item.images};
			}
		});
		
		return object;
	},
	getIdFromCoupling: function(coupling) {
		var res = HTTP.get('http://148.251.183.26/handvat-admin/text/json');
		var json = JSON.parse(res.content);
		
		var id;
		json.forEach(function(item) {
			if(item.appCoupling === coupling) {
				id = item.id;
			}
		});
		
		return id;
	}
});