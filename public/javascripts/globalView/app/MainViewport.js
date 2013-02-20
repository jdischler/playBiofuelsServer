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
    	'BiofuelsGlobal.view.NetworkLayer',
    	'BiofuelsGlobal.view.ProgressPanel'
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
        
        BiofuelsGlobal.activeView = this;

        BiofuelsGlobal.network = Ext.create('BiofuelsGlobal.view.NetworkLayer');
		// 192.168.1.101
        BiofuelsGlobal.network.openSocket('10.140.1.172', 9000, '/BiofuelsGame/serverConnect');

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
					xtype: 'progressPanel',
					x: 190,
					y: 10,
					width: 440,
					height: 100
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
    },
    
 	//--------------------------------------------------------------------------
    displayRoomNamePassword: function(roomName, password) {
    	
    	var roomNameCtrl = this.getComponent('panel1').getComponent('roomName');
    	var passwordCtrl = this.getComponent('panel1').getComponent('password');
    	
    	roomNameCtrl.setValue(roomName);
    	passwordCtrl.setValue(password);
    }
    
    
});
