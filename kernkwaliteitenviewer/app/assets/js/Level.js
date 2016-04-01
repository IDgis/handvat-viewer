define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom',
	'dojo/query'
        ], 
function(
		declare,
		on,
		dom,
		query
){
	return declare ([], {
		
		constructor: function (levels, level, sublevel) {
			console.log("nieuw level" + level);
			var mapContainerNode = dom.byId ("map-container" + level);
			var mapNode = query(".map", mapContainerNode)[0];
			var textNode = dom.byId ("text" + level);
			var button = dom.byId ("btn-level" + level);
			var mapButton = null;
			var deelgebied = "margraten";

			if (sublevel) {
				console.log("map button " + "map-button-" + level + "-" + sublevel);
				mapButton = dom.byId ("map-button-" + level + "-" + sublevel);
				on (mapButton, 'click', function(e){
					e.preventDefault();
					e.stopPropagation();
					console.log("leuke kaart");
				});
			}
			
			levels.setActiveNodes (mapContainerNode, textNode, button);
			
			if (level < 3) {
				on (mapNode, 'click', function(e){
					e.preventDefault();
					e.stopPropagation();
					if(level==1){
					//level 1 bepaal deelgebied
						levels.setLevel (mapContainerNode, textNode, deelgebied, 2);
					}	
					
					if(level==2){
						//level 2 bepaal locatie
						levels.setLevel (mapContainerNode, textNode, deelgebied, 3, 1);
					} 
				});
			}		
			
			on (button, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				levels.setActiveNodes (mapContainerNode, textNode, button);
			});
			
			
			
			
		}
	});
});