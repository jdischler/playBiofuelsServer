/*
 * File: BiofuelsGlobal/view/MainViewport.js
 */

Ext.onReady(function() {
	var createGame = Ext.create('BiofuelsGlobal.view.JoinGamePopup');
	createGame.show();
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsGlobal.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'BiofuelsGlobal.view.JoinGamePopup',
    	'BiofuelsGlobal.view.NetworkLayer'
    ],

    title: 'My Window',
    autoScroll: true,
    width: 800,
    height: 600,
//    layout: 'fit',

	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = BiofuelsGlobal;
    	
        app.network.registerListener('farmerList', this.updateFarmerList, this);
    },

	//--------------------------------------------------------------------------
    updateFarmerList: function(json) {

    	this.farmerListStore.loadRawData(json, false);
    	
		// FIXME: not the best place for this...needs to happen after login    	
    	var roomName = this.getComponent('panel1').getComponent('roomName');
    	var password = this.getComponent('panel1').getComponent('password');
    	
    	roomName.setValue(BiofuelsGlobal.roomInformation.roomName);
    	password.setValue(BiofuelsGlobal.roomInformation.password);
    },
    
	//--------------------------------------------------------------------------
    configFarmerStore: function() {
    	
    	this.farmerListStore = Ext.create('Ext.data.Store', {
    		storeId:'farmerListStore',
			fields:['name','ready'],
			proxy: {
				type: 'memory',
				reader: {
					type: 'json',
					root: 'farmers'
				}
			}
		});
	},
	
	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;        
        
        BiofuelsGlobal.network = Ext.create('BiofuelsGlobal.view.NetworkLayer');
        this.initNetworkEvents();
        
        this.configFarmerStore();
        
        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				itemId: 'panel1',
				width: 800,
				height: 600,
				layout: {
					type: 'absolute'
				},
				title: 'BioFarmerVille',
				titleAlign: 'center',
				items: [{
					xtype: 'gridpanel',
					itemId: 'farmerList',
					store:'farmerListStore',
					x: 10,
					y: 10,
					height: 550,
					width: 170,
					title: 'Farmers',
					titleAlign: 'center',
					columns: [{
						xtype: 'gridcolumn',
						width: 120,
						resizable: false,
						dataIndex: 'name',
						hideable: false,
						text: 'Name'
					},
					{
						xtype: 'booleancolumn',
						width: 48,
						resizable: false,
						dataIndex: 'ready',
						hideable: false,
						text: 'Ready',
						falseText: 'no',
						trueText: 'yes'
					}],
					viewConfig: {
					}
				},
				{
					xtype: 'panel',
					x: 190,
					y: 10,
					height: 80,
					width: 440,
					title: 'Round Progress',
					titleAlign: 'center'
				},
				{
					xtype: 'textfield',
					itemId: 'roomName',
					x: 630,
					y: 10,
					width: 160,
					fieldLabel: 'Room',
					labelAlign: 'right',
					labelWidth: 80
				},
				{
					xtype: 'textfield',
					itemId: 'password',
					x: 630,
					y: 40,
					width: 160,
					fieldLabel: 'Password',
					labelAlign: 'right',
					labelWidth: 80
				}]
			}]
        });
        
        me.callParent(arguments);
    }
    
});
