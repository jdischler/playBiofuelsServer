/*
 * File: app/view/PlantPopupNew.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.PlantPopupNew', {
//------------------------------------------------------------------------------

    extend: 'Ext.menu.Menu',
    alias: 'widget.plantPopupNew',

	floating: true,
	minWidth: 140,
	width: 140,
	showSeparator: false,
	
	//--------------------------------------------------------------------------
    initComponent: function() {
    	var me = this;        

    	Ext.applyIf(me, {
    		items: [{
				xtype: 'menuitem',
				icon: 'resources/corn_icon.png',
				text: 'Corn',
				itemId: 'corn'
			},
			{
				xtype: 'menuitem',
				icon: 'resources/grass_icon.png',
				text: 'Perennial Grass',
				itemId: 'grass'
			},
			{
				xtype: 'menuitem',
				icon: 'resources/cover_crop_icon.png',
				text: 'Cover Crop',
				itemId: 'cover'
			}],
    	});

    	this.delayHider = new Ext.util.DelayedTask(this.hide, this);
    	
    	this.on("click", this.clicked);
    	this.on("mouseleave", this.didLeave);
    	this.on("mouseenter", this.didEnter);
    	
    	me.callParent(arguments);
    },
    
	//--------------------------------------------------------------------------
    display: function(callback, scope, atX, atY) {
    	this.clickCallback = callback;
    	this.clickCallbackScope = scope;
    	this.show();
    	// basically position around mouse click
    	this.setPosition(atX - 25, atY  - this.getHeight() * 0.5);
    },
    
	//--------------------------------------------------------------------------
    clicked: function(menu, item, e, eOpts) {
		this.clickCallback.call(this.clickCallbackScope, item.getItemId());
    },
    
	//--------------------------------------------------------------------------
    didLeave: function(menu, e, eOpts) {
		menu.delayHider.delay(250);
	},
	
	//--------------------------------------------------------------------------
	didEnter: function(menu, e, eOpts) {
		menu.delayHider.cancel();	
	}

});

