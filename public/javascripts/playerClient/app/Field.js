/*
 * File: app/view/Field.js
 *
 * Visual representation of a field
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Field', {
//------------------------------------------------------------------------------

	requires: [
        'Biofuels.view.CornPlantSprite',
        'Biofuels.view.CoverCropPlantSprite',
        'Biofuels.view.GrassPlantSprite',
		'Biofuels.view.ToggleSprite'
	],
	

    constructor: function (config) {
        this.crop = new Array();
        this.cropType = "none";
    },
    
    //--------------------------------------------------------------------------
    attachTo: function(toSurface, atX, atY) {
    	
		var paths = [{        
			type: 'rect',
			width: 160,
			height: 120,
			radius: 10,
			x: atX,
			y: atY,
			fill: '#864',
			stroke: '#364',
			'stroke-width': 10
		},
		{
			type: 'image',
			src: 'resources/field_overlay.png',
			x: atX,
			y: atY,
			width: 160,
			height: 120,
		}];
		
    	this.surface = toSurface;
    	this.atX = atX;
    	this.atY = atY;
    	
  		var result = toSurface.add(paths);
  		this.sprites = result;
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}
		
		this.addPlantingIcon(toSurface, atX + 5, atY + 105);
		this.addManagementIcons(toSurface, atX + 55, atY + 105);
    },
    
    //--------------------------------------------------------------------------
    addManagementIcons: function(surface, atX, atY) {
    	
    	this.fertilizer = Ext.create('Biofuels.view.ToggleSprite');
    	this.fertilizer.addToSurface(surface, [{        
			type: 'image',
			src: 'resources/fertilizer_no_icon.png',
			x: atX,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}], 'resources/fertilizer_no_icon.png', 'resources/fertilizer_yes_icon.png');

		this.till = Ext.create('Biofuels.view.ToggleSprite');
    	this.till.addToSurface(surface, [{        
			type: 'image',
			src: 'resources/till_no_icon.png',
			x: atX + 35,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}], 'resources/till_no_icon.png', 'resources/till_yes_icon.png');

		this.pesticide = Ext.create('Biofuels.view.ToggleSprite');
    	this.pesticide.addToSurface(surface, [{        
			type: 'image',
			src: 'resources/pesticide_no_icon.png',
			x: atX + 70,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}], 'resources/pesticide_no_icon.png', 'resources/pesticide_yes_icon.png');
		
    },
    
    //--------------------------------------------------------------------------
    showManagementIcons: function() {
    	this.fertilizer.show();
    	this.till.show();
    	this.pesticide.show();
    },

    //--------------------------------------------------------------------------
    hideManagementIcons: function() {
    	this.fertilizer.hide();
    	this.till.hide();
    	this.pesticide.hide();
    },
    
    //--------------------------------------------------------------------------
    addPlantingIcon: function(surface, atX, atY) {
    	
    	var path = [{
			type: 'image',
			src: 'resources/planting_icon.png',
			x: atX,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
    	}];
    	
  		var result = surface.add(path);
  		this.plantingIcon = result[0];
		this.plantingIcon.show(true);
		
		this.setPlantingIconListeners();
		
		this.popup = Ext.create('Biofuels.view.PlantPopup');
        this.popup.createForSurface(this.surface, atX, atY);
    },

    //--------------------------------------------------------------------------
	setPlantingIconListeners: function() {
		
		this.plantingIcon.on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: this.plantingIcon
		});
		this.plantingIcon.on({
				click: this.onClick,
				scope: this
		});
	},
	
    //--------------------------------------------------------------------------
    showPlantingIcon: function() {
    	this.plantingIcon.stopAnimation().show(true).animate({
    		duration: 100,
    		to: {
    			opacity: 1
    		}
    	});
    	
		this.setPlantingIconListeners();
    },
    
    //--------------------------------------------------------------------------
    hidePlantingIcon: function() {
    	this.plantingIcon.stopAnimation().animate({
    		duration: 100,
    		to: {
    			opacity: 0
    		},
    		callback: this.doHide,
    		scope: this.plantingIcon
    	});
    	this.plantingIcon.clearListeners();
    },
    
    //--------------------------------------------------------------------------
    doHide: function() {
    	this.hide(true);
    },
    
    //--------------------------------------------------------------------------
    onMouseOver: function(evt, target) {
    	this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
    	});
	},

    //--------------------------------------------------------------------------
    onMouseOut: function(evt, target) {
    	this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
    	});
	},
	
	// cropType: grass, corn, none, cancel
    //--------------------------------------------------------------------------
	onPlantingClickHandler: function(cropType) {
		if (!cropType.localeCompare("cancel")) {
			return;
		}
		
		if (this.cropType != cropType) {
			this.removeOldCrop();
			if (!cropType.localeCompare("corn")) {
				this.plantCorn(this.surface);
			}
			else if (!cropType.localeCompare("grass")) {
				this.plantGrass(this.surface);
			}
			else if (!cropType.localeCompare("cover")) {
				this.plantCoverCrop(this.surface);
			}
			this.cropType = cropType;
		}
	},
	
    //--------------------------------------------------------------------------
    onClick: function(evt, target) {
        this.popup.showPopup(this.onPlantingClickHandler, this);
	},
    
    //--------------------------------------------------------------------------
	removeOldCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].removeFromSurface();
		}
	},
	
    //--------------------------------------------------------------------------
	showCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.show(true);
		}
	},
	
    //--------------------------------------------------------------------------
	hideCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.hide(true);
		}
	},
	
    //--------------------------------------------------------------------------
    plantCorn: function(surface) {
    	var cx = 0;
    	var cy = 0;
    	
		for (var corns = 0; corns < 16; corns++ ) {
			var rAtX = cx + this.atX + 12; 
			var rAtY = cy + this.atY - 22;
			
			var aCorn = Ext.create('Biofuels.view.CornPlantSprite');
			aCorn.addToSurface(surface, rAtX, rAtY, 1000 + Math.random() * 500);

			cx += 35;
			if (cx >= 120) {
				cx = 0;
				cy += 30;
			}
			this.crop.push(aCorn);
		}
	},
	
    //--------------------------------------------------------------------------
    plantGrass: function(surface) {
    	var cx = 0;
    	var cy = 0;
    	
		for (var grass = 0; grass < 14; grass++ ) {
			var rAtX = cx + this.atX + 12; 
			var rAtY = cy + this.atY - 22;
			
			var aGrass = Ext.create('Biofuels.view.GrassPlantSprite');
			aGrass.addToSurface(surface, rAtX, rAtY, 1200 + Math.random() * 800);

			cx += 35;
			if (cx > 105) {
				cx -= 140;
				cx += (35 / 2);
				cy += 30;
			}
			this.crop.push(aGrass);
		}
	},
	
    //--------------------------------------------------------------------------
    plantCoverCrop: function(surface) {
    	var cx = 0;
    	var cy = 0;
    	
		for (var cover = 0; cover < 14; cover++ ) {
			var rAtX = cx + this.atX + 12; 
			var rAtY = cy + this.atY - 22;
			
			var aGrass = Ext.create('Biofuels.view.CoverCropPlantSprite');
			aGrass.addToSurface(surface, rAtX, rAtY, 1200 + Math.random() * 800);

			cx += 35;
			if (cx > 105) {
				cx -= 140;
				cx += (35 / 2);
				cy += 30;
			}
			this.crop.push(aGrass);
		}
	}       
	

});

