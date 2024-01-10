import { Meteor } from 'meteor/meteor';

Meteor.methods({
	executeLocatieServerSuggest: function(url) {
		var res = HTTP.get(url);
		var content = JSON.parse(res.content);
		var docs = content.response.docs;
		
		var addresses = [];
		docs.forEach(function(doc) {
			addresses.push({"id": doc.id, "name": doc.weergavenaam});
		});
		
		return addresses;
	}
});