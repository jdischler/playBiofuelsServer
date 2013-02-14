/*
 * File: app/view/ContractHelpWindow.js
 */
	
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.InformationPanel', {
//------------------------------------------------------------------------------

	extend: 'Ext.panel.Panel',
    alias: 'widget.informationPanel',

    
	title: 'Information About Your Farm',
	titleAlign: 'center',
   
	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;
    	
        app.network.registerListener('joinRoom', this.joinedRoom, this);
    },

    //--------------------------------------------------------------------------
    joinedRoom: function(json) {
    	this.setTitle("Information About " + json.userName + "'s Farm");
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
    	
        var me = this;

        this.initNetworkEvents();
        
        Ext.applyIf(me, {
            items: [{
				xtype: 'contractPanel'
			},
			{
				xtype: 'sustainabilityPanel'
			},
			{
				xtype: 'panel',
				title: 'Yields',
				titleAlign: 'center',
				layout: {
					type: 'vbox',
					padding: 8,
				},
				items: [{
					xtype: 'label',
					text: 'Some Label Text'
				},{
					xtype: 'label',
					text: 'Some Label Text'
				}],
				collapsed: true
			}, 
			{
				xtype: 'panel',
				title: 'Other Metrics',
				titleAlign: 'center',
				collapsed: true
			}]
		});
		
        me.callParent(arguments);
    }

});
