/*
 * File: app/view/ProgressPanel.js
 */
	
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ProgressPanel', {
//------------------------------------------------------------------------------

	extend: 'Ext.panel.Panel',
    alias: 'widget.progressPanel',
    requires: [
        'Biofuels.view.RoundStageBar',
        'Biofuels.view.RoundStageMarker'
    ],

	title: 'Round Stage',
	titleAlign: 'center',
	viewbox: true,

	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;
    	
        app.network.registerListener('changeSettings', this.changeSettings, this);
    },

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        this.initNetworkEvents();
        
        Ext.applyIf(me, {
            items: [{
				xtype: 'draw',
				width: 500,
				height: 80,
				layout: 'absolute',
				items: [{
					type: 'rect',
					width: 500,
					height: 80,
					fill: '#163020'
				}]
			}]
		});
	
		me.callParent(arguments);
	},
	
	//--------------------------------------------------------------------------
	changeSettings: function(json) {
		
		if (!this.stageBar) {
			var drawComp = this.child('draw');
			
			this.stageBar = Ext.create('Biofuels.view.RoundStageBar');
			this.stageBar.addToSurface(drawComp.surface, 60, 35, 380);
			this.setSeasonStage(1);		
		}

		var markerLabels = new Array();
		// TODO: or labels could could just be sent by the server...
		if (json.contractsOn) {
			markerLabels.push('Contract');
		}
		markerLabels.push('Plant');
		if (json.mgmtOptsOn) {
			markerLabels.push('Manage');
		}
		markerLabels.push('Grow','Year End');
			
		this.stageBar.setMarkers(markerLabels);
	},
	
	//--------------------------------------------------------------------------
	setYear: function(year) {
		
		this.stageBar.setYear(year);
	},
	
	//--------------------------------------------------------------------------
	setSeasonStage: function(stage) {

		this.stageBar.setStage(stage, 500);		
	}
	
});

