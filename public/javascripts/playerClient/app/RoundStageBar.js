/*
 * File: app/view/RoundStageBar.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.RoundStageBar', {
//------------------------------------------------------------------------------

    constructor: function (config) {
    	
    },
    
    //--------------------------------------------------------------------------
    addToSurface: function(surface, atX, atY) {

    	var config = [{
    		type: 'rect',
			fill: '#000',
			opacity: '0.5',
    		x: 80,
    		y: 34,
    		width: 340,
    		height: 3
    	},{
    		type: 'rect',
			fill: '#fff',
			opacity: '0.25',
    		x: 80,
    		y: 36,
    		width: 340,
    		height: 1
    	}
    	,
    	
    	{
			type: 'circle',
			fill: '#000',
			opacity: '0.5',
			x: 80,
			y: 35,
			radius: 15
    	},{
			type: 'circle',
			fill: '#fff',
			opacity: '0.5',
			x: 80,
			y: 37,
			radius: 15
    	},{
			type: 'circle',
			fill: '#164028',
			opacity: '0.75',
			x: 80,
			y: 36,
			radius: 14
    	},{
    		type: 'text',
    		text: "Contracts",
    		fill: '#000',
    		font: "16px monospace",
    		x: 40,
    		y: 64
    	},{
    		type: 'text',
    		text: "Contracts",
    		fill: '#fff',
    		font: "16px monospace",
    		x: 40,
    		y: 62
    	}
    	,
    	
    	{
			type: 'circle',
			fill: '#000',
			opacity: '0.5',
			x: 250,
			y: 35,
			radius: 15
    	},{
			type: 'circle',
			fill: '#fff',
			opacity: '0.5',
			x: 250,
			y: 37,
			radius: 15
    	},{
			type: 'circle',
			fill: '#164028',
			opacity: '0.75',
			x: 250,
			y: 36,
			radius: 14
    	},{
    		type: 'text',
    		text: "Plant Crops",
    		fill: '#000',
    		font: "16px monospace",
    		x: 200,
    		y: 64
    	},{
    		type: 'text',
    		text: "Plant Crops",
    		fill: '#fff',
    		font: "16px monospace",
    		x: 200,
    		y: 62
    	}
    	
    	,
    	{
    		type: 'circle',
			fill: '#000',
			opacity: '0.5',
    		x: 420,
    		y: 35,
    		radius: 15
    	},{
			type: 'circle',
			fill: '#fff',
			opacity: '0.5',
			x: 420,
			y: 37,
			radius: 15
    	},{
			type: 'circle',
			fill: '#164028',
			opacity: '0.75',
			x: 420,
			y: 36,
			radius: 14
    	},{
    		type: 'text',
    		text: "Round Wrap-Up",
    		fill: '#000',
    		font: "16px monospace",
    		x: 355,
    		y: 64
    	},{
    		type: 'text',
    		text: "Round Wrap-Up",
    		fill: '#fff',
    		font: "16px monospace",
    		x: 355,
    		y: 62
    	}];
    	
  		var result = surface.add(config);
  		this.sprites = result;
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}
    },

});
