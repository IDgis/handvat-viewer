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
		
		constructor: function (levels, level) {

			var mapContainerNode = dom.byId ("map-container" + level);
			var mapNode = query(".map", mapContainerNode)[0];
			var textNode = dom.byId ("text" + level);
			var button = dom.byId ("btn-level" + level);
			levels.setActiveNodes (mapContainerNode, textNode, button);

			on (mapNode, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				console.log(mapContainerNode);
				levels.setLevel (mapContainerNode, textNode, level + 1);
			});
			
			
			on (button, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				levels.setActiveNodes (mapContainerNode, textNode, button);
			});
			
		}
	});
});