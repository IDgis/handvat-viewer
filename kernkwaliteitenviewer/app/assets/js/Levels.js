define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom',
	'dojo/dom-class',
	'dojo/dom-construct',
	'dojo/request/xhr',
	'dojo/when',
	'dojo/Deferred',
	'js/Level'

        ], 
function(
		declare,
		on,
		dom,
		domClass,
		domConstruct,
		xhr,
		when,
		Deferred,
		level
		
		
){
	return declare ([], {
		levelMapNode: null,
		levelTextNode: null,
		activeMapNode: null,
		activeTextNode: null,
		
		
		
		
		
		setLevel: function (mapNode, textNode, deelgebied, lev, sublev) {
			var thisObj = this;
			when (this.setMapLevel (mapNode, deelgebied, lev, sublev), function() {
				when (thisObj.setTextLevel (textNode, deelgebied, lev, sublev), function() {
					var newLevel =  new level (thisObj, lev, sublev);
						
				});
			});
		},
		
		setMapLevel: function (mapNode, deelgebied, lev) {		
			var def = new Deferred ();
			var thisObj = this;
			if (dom.byId ("map-container" + lev) === null) {
				xhr (jsRoutes.controllers.Viewer.getMapHtml (deelgebied, lev).url, {
					handleAs: "html"
				}).then (function (html) {
					thisObj.levelMapNode = domConstruct.toDom (html);
					domConstruct.place (thisObj.levelMapNode, mapNode, "after");
					def.resolve();
				});				
			} else {
				thisObj.levelMapNode = dom.byId ("map-container" + lev);
				def.resolve();
			}
			return def;
		},
		
		setTextLevel: function (textNode, deelgebied, lev) {
			var def = new Deferred ();
			var thisObj = this;
			if (dom.byId("text" + lev) === null) {
				xhr (jsRoutes.controllers.Viewer.getTextHtml (deelgebied,lev).url, {
					handleAs: "html"
				}).then (function (html) {
					thisObj.levelTextNode = domConstruct.toDom (html);
					domConstruct.place (thisObj.levelTextNode, textNode, "after");
					def.resolve();
				}//, function (error){
					//TODO: error handling
				//}
				);
			} else {
				thisObj.levelTextNode = dom.byId("text" + lev);
				def.resolve();
			}
			return def;
		},
		
		setActiveNodes: function (mapNode, textNode, button) {
			if(this.activeMapNode) {
				domClass.toggle (this.activeMapNode, 'level-visible');
			}
			if(this.activeTextNode) {
				domClass.toggle (this.activeTextNode, 'level-visible');
			}
			domClass.toggle (button, 'focus');
			domClass.toggle (mapNode, 'level-visible');
			this.activeMapNode = mapNode; 
			domClass.toggle (textNode, 'level-visible');
			this.activeTextNode = textNode; 
		}
		

		
		
		
	});
});	