/*
 * File: app/view/RoundStageMarker.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.RoundStageMarker', {
//------------------------------------------------------------------------------

    constructor: function (config) {
    	
    },
    
    //--------------------------------------------------------------------------
    addToSurface: function(surface, atX, atY, label) {

    	var markerConfig = [{
			type: 'circle',
			fill: '#000',
			opacity: '0.5',
			x: atX,
			y: atY,
			radius: 15,
			zIndex: 200
    	},{
			type: 'circle',
			fill: '#fff',
			opacity: '0.5',
			x: atX,
			y: atY+2,
			radius: 15,
			zIndex: 200
    	},{
			type: 'circle',
			fill: '#164028',
			opacity: '0.75',
			x: atX,
			y: atY+1,
			radius: 14,
			zIndex: 200
    	}];
    	
  		var result = surface.add(markerConfig);
  		this.markerSprites = result;
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}
		
    	var labelConfig = [{
    		type: 'text',
    		text: label,
    		fill: '#000',
    		font: '15px monospace',
    		x: atX,
    		y: atY+29
    	},{
    		type: 'text',
    		text: label,
    		fill: '#fff',
    		font: '15px monospace',
    		x: atX-30,
    		y: atY+27
    	}];
    	
  		result = surface.add(labelConfig);
  		this.labelSprites = result;
  		// ensure labels are visible and properly centered
		for (var index = 0; index < result.length; index++) {
			var text = result[index];
			text.show(true);
			text.setAttributes({
				x: atX - text.getBBox().width * 0.5
			}, true);
		}
    },

    detach: function() {
      	var index;
		for (index = 0; index < this.markerSprites.length; index++) {
			this.markerSprites[index].remove();
			this.markerSprites[index].destroy();
		}
		for (index = 0; index < this.labelSprites.length; index++) {
			this.labelSprites[index].remove();
			this.labelSprites[index].destroy();
		}
    }
});
