/*
 * File: app/view/MainViewport.js
 */

 Ext.onReady(function() {
	var createGame = Ext.create('Biofuels.view.JoinGamePopup');
	createGame.show();
});
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
    	'Biofuels.view.NetworkLayer',
    	'Biofuels.view.JoinGamePopup',
        'Biofuels.view.FarmHolderPanel',
        'Biofuels.view.FieldHealthPopup',
        'Biofuels.view.InformationPanel',
        'Biofuels.view.ContractPanel',
        'Biofuels.view.ContractOfferingPanel',
        'Biofuels.view.SustainabilityPanel',        
        'Biofuels.view.ContractHelpWindow',
        'Biofuels.view.ProgressPanel'
    ],

    title: 'My Window',
    autoScroll: true,
    layout: 'fit',

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;        
 
        Biofuels.network = Ext.create('Biofuels.view.NetworkLayer');

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					align: 'center'
				},
				bodyStyle: 'background-image: url(resources/site_bg.jpg); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center top;',
				items: [{
					xtype: 'panel',
					layout: 'column',
					width: 1000,
					items: [{
						xtype: 'panel',
						columnWidth: 0.5,
						layout: 'fit',
						items: [{
							xtype: 'progressPanel',
							height: 100
						},{
							xtype: 'farmHolderPanel',
							// width: 500,
							height: 700,
							layout: 'fit'
						}]
					},{
						xtype: 'informationPanel',
						columnWidth: 0.5,
						height: 700,
						layout: {
							type: 'accordion',
							multi: true
						}
					}]
				}]
			}]
        });

        me.callParent(arguments);
    }
    
});

