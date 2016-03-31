define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom'
        ], 
function(
		declare,
		on,
		dom
){
	return declare ([], {
		
		constructor: function (levels, level) {

			var mapNode = dom.byId ("map-container" + level);
			var textNode = dom.byId ("text" + level);
			var button = dom.byId ("btn-level" + level);
			levels.setActiveNodes (mapNode, textNode, button);

			on (mapNode, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				levels.setLevel (mapNode, textNode, level + 1);
			});
			
			
			on (button, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				levels.setActiveNodes (mapNode, textNode, button);
			});
			
		}
	});
});