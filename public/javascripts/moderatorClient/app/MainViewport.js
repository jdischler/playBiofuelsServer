/*
 * File: BiofuelsModerator/view/MainViewport.js
 */

Ext.onReady(function() {
	var createGame = Ext.create('BiofuelsModerator.view.CreateGamePopup');
	createGame.show();
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'BiofuelsModerator.view.CreateGamePopup',
    	'BiofuelsModerator.view.NetworkLayer'
    ],

    title: 'My Window',
    autoScroll: true,
    layout: 'fit',

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;        
        
        BiofuelsModerator.activeView = this;

        BiofuelsModerator.network = Ext.create('BiofuelsModerator.view.NetworkLayer');
		// 192.168.1.101
        BiofuelsModerator.network.openSocket('10.140.2.115', 9000, '/BiofuelsGame/serverConnect');

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				itemId: 'panel1',
				layout: {
					type: 'vbox',
					align: 'center'
				},
				items: [{
                    xtype: 'panel',
                    itemId: 'panel2',
                    height: 480,
                    width: 320,
                    layout: {
                        type: 'absolute'
                    },
                    title: 'Game Settings',
                    titleAlign: 'center',
                    items: [{
						xtype: 'textfield',
						itemId: 'roomName',
						x: 20,
						y: 20,
						width: 120,
						fieldLabel: 'Room',
						labelAlign: 'right',
						labelWidth: 40,
						disabled: true
					},{
						xtype: 'textfield',
						itemId: 'password',
						x: 130,
						y: 20,
						width: 160,
						fieldLabel: 'Password',
						labelAlign: 'right',
						labelWidth: 80,
						disabled: true
					},{
						xtype: 'numberfield',
						itemId: 'fieldCount',
						x: 20,
						y: 60,
						value: 2,
						fieldLabel: '# of Fields',
						labelAlign: 'right',
						labelWidth: 125,
						allowBlank: false,
						allowDecimals: false,
						maxValue: 6,
						minValue: 2,
						step: 2,
						width: 225
					},{
						xtype: 'checkboxfield',
						itemId: 'contracts',
						x: 20,
						y: 90,
						fieldLabel: 'Contracts Enabled',
						labelAlign: 'right',
						labelWidth: 125
					},{
						xtype: 'checkboxfield',
						itemId: 'managementOptions',
						x: 20,
						y: 120,
						fieldLabel: 'Management Options Enabled',
						labelAlign: 'right',
						labelWidth: 125
					},{
						xtype: 'button',
						x: 30,
						y: 180,
						scale: 'medium',
						width: 260,
						text: 'Apply Settings!',
						scope: this,
						handler: function() {
							this.applySettingsChange();
						}
					},{
						xtype: 'button',
						x: 80,
						y: 240,
						enableToggle: true,
						scale: 'large',
						text: 'Pause'
					},{
						xtype: 'button',
						x: 140,
						y: 240,
						enableToggle: true,
						scale: 'large',
						text: 'Final Round'
					}]
				}]
			}]
        });

        me.callParent(arguments);
    },
    
 	//--------------------------------------------------------------------------
    displayRoomNamePassword: function(roomName, password) {
    	
 		var container = this.getComponent('panel1').getComponent('panel2');
    	var roomNameCtrl = container.getComponent('roomName');
    	var passwordCtrl = container.getComponent('password');
    	
    	roomNameCtrl.setValue(roomName);
    	passwordCtrl.setValue(password);
    },
    
 	//--------------------------------------------------------------------------
 	applySettingsChange: function() {

 		var container = this.getComponent('panel1').getComponent('panel2');
 		var fieldCount = container.getComponent('fieldCount').value;
 		var contractsOn = container.getComponent('contracts').value;
 		var mgmtOptsOn = container.getComponent('managementOptions').value;
 		
 		var message = {
    		event: 'changeSettings',
    		fieldCount: fieldCount,
    		contractsOn: contractsOn,
    		mgmtOptsOn: mgmtOptsOn
    	};
    	BiofuelsModerator.network.send(JSON.stringify(message));
 	}
 	
});
