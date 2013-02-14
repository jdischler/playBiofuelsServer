/*
 * File: app/view/ToggleSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ToggleSprite', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    addToSurface: function(surface, config, off, on) {

    	this.stateImages = new Array();
    	this.stateImages.push(off);
    	this.stateImages.push(on);
    	this.stateValue = 0;
    	
  		var result = surface.add(config);
  		this.sprite = result[0];
  		this.sprite.show(true);
  		
    	this.setListeners();
    },

    //-----------------------------------------------------------------------
    setListeners: function() {
    	
		this.sprite.on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: this.sprite
		});
		this.sprite.on({
				click: this.onClick,
				scope: this
		});
    },
    
    //-----------------------------------------------------------------------
    show: function() {
    	this.sprite.stopAnimation().show(true).animate({
    		duration: 100,
    		to: {
    			opacity: 1
    		}
    	});
    	this.setListeners();
    },

    //-----------------------------------------------------------------------
    hide: function() {
    	if (this.sprite.attr.hidden) {
    		return;
    	}
    	this.sprite.stopAnimation().animate({
    		duration: 100,
    		callback: this.doHide,
    		scope: this.sprite,
    		to: {
    			opacity: 0
    		}
    	});
    	this.sprite.clearListeners();
    },
    
    //-----------------------------------------------------------------------
    doHide: function() {
    	this.sprite.hide(true);
    },
    
    //-----------------------------------------------------------------------
    onMouseOver: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
    	});
	},

    //-----------------------------------------------------------------------
    onMouseOut: function(evt, target) {
    	
    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
    	});
	},
	
    //-----------------------------------------------------------------------
    onClick: function(evt, target) {

    	this.stateValue++; if (this.stateValue > 1) this.stateValue = 0;
    	this.sprite.setAttributes({
    			src: this.stateImages[this.stateValue]
    	}, true);
	},


});
