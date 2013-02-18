/*
 * File: app/view/RoundStageBar.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.RoundStageBar', {
//------------------------------------------------------------------------------

    constructor: function (config) {
  		this.markers = new Array();
    },
    
    // FIXME: Ok, the system of using the given incoming coordinates ended up
    //	being odd/awkward...not a huge deal maybe but this could be more straightfoward
    // Inputs e.g., atX = 60, atY = 35, width = 380
    //--------------------------------------------------------------------------
    addToSurface: function(surface, atX, atY, width) {

    	this.surface = surface;
    	this.placement = {
  			x: atX,
  			y: atY,
  			width: width
  		};

    	var timeline = [{
    		type: 'rect',
			fill: '#000',
			opacity: '0.5',
    		x: atX,
    		y: atY-1,
    		width: width,
    		height: 3,
    		zIndex: 100
    	},{
    		type: 'rect',
			fill: '#fff',
			opacity: '0.25',
    		x: atX,
    		y: atY+1,
    		width: width,
    		height: 1,
    		zIndex: 100
    	}];
    	
    	var index;
   		var result = surface.add(timeline);
  		this.timeline = result;
		for (index = 0; index < result.length; index++) {
			result[index].show(true);
		}
		
		this.year = 1;
		this.yearLabel = surface.add([{
    		type: 'text',
    		text: ' ',
    		fill: '#000',
    		font: "16px monospace",
    		x: atX,
    		y: atY-18
    	},{
    		type: 'text',
    		text: ' ',
    		fill: '#fff',
    		font: "16px monospace",
    		x: atX,
    		y: atY-20
    	}]);

    	this.setYear(this.year);
    	
    	this.createStageMarker(surface);
    },
    
    // FIXME: Consider rolling this (totally or partially) into RoundStageMarker.js?
	//--------------------------------------------------------------------------
	createStageMarker: function(surface) {
		
		this.stageMarker = surface.add([{
			type: 'circle',
			radius: 12,
			fill: '#fa2',
			x: this.placement.x,
			y: this.placement.y + 2,
			zIndex: 1000
		}]);
		
		this.stageMarker[0].show(true);
		this.stage = 0;
	},

    // array in the form of ['blah', 'blah', 'blah']
    //--------------------------------------------------------------------------
    setMarkers: function(markerArray) {

		var index;
		// remove old elements if there are any
    	for (index = 0; index < this.markers.length; index++) {
    		this.markers[index].detach();
    		this.markers[index].destroy();
    	}
    	this.markers = [];//this.markers.splice(0, this.markers.length);
    	
    	// Add new elements
		var count = markerArray.length - 1;
		for (index = 0; index <= count; index++) {
			
			var marker = Ext.create('Biofuels.view.RoundStageMarker');
			var posX = this.placement.x + this.placement.width * (index / count);
			marker.addToSurface(this.surface, posX, this.placement.y, markerArray[index]);
			this.markers.push(marker);
		}
    },
    
    // yearNumber as an integer
    //--------------------------------------------------------------------------
    setYear: function(yearNumber) {
    	
    	// re-set, show, center
       	for (var index = 0; index < this.yearLabel.length; index++) {
       		
       		console.log('iteratin!');
       		var label = this.yearLabel[index];
    		label.show(true);
    		label.setText('Year ' + yearNumber);
			label.setAttributes({
				x: this.placement.x + 
					(this.placement.width - label.getBBox().width) * 0.5
			}, true);
    	}		
	},

	// stage as an integer, duration as an integer in MS
	// TODO: reconsider what is passed in here if it seems odd to anyone else?
    //--------------------------------------------------------------------------
	setStage: function(stage, duration) {
		
		// detect wrapping around to the front or a previous position
		if (stage <= this.stage ) {
			
			this.stageMarker[0].setAttributes({
				x: stage * this.placement.width + this.placement.x
			}, true);
		}
		else {
			this.stageMarker[0].animate({
				duration: duration,
				to: {
					translate: {
						x: stage * this.placement.width,
						y: 0
					}
				}
			});
		}
		this.stage = stage;
	}
	
});
