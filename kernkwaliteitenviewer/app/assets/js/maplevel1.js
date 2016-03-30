define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom',
	'dojo/dom-class',
	'dojo/dom-construct',
	'dojo/request/xhr'

        ], 
function(
		declare,
		on,
		dom,
		domClass,
		domConstruct,
		xhr
		
		
){
	return declare ([], {
		
		constructor: function () {
			var node = dom.byId("map-container1");
			var thisObject = this;
			on (node, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				thisObject.nextLevel (node);
			});
			
			
			
		},
	
		nextLevel: function (node) {
		
			console.log("voeg toe");
		
		//haal html op
			xhr(jsRoutes.controllers.Viewer.nextLevel("2").url, {
				handleAs: "html"
			}).then (function (html){
				//laad module EditService
				domClass.toggle (node, 'level-visible');
				var mapLevelNode = domConstruct.toDom(html);
				domConstruct.place(mapLevelNode, node, "after");
				
			}, function (error){
				//TODO: error handling
			});
		}
	
	});
});