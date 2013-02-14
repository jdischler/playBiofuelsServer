/*
 * File: app/view/ProgressPanel.js
 */
	
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ProgressPanel', {
//------------------------------------------------------------------------------

	extend: 'Ext.panel.Panel',
    alias: 'widget.progressPanel',

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
				height: 80,
				width: 500,
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
			this.stageBar.addToSurface(drawComp.surface, 0, 0);
			
			this.createStageMarker(drawComp);
			this.createYearLabel(drawComp);
			this.stageMarkerPos = 0;
		}
		
		// TODO: signal the stageBar to show or hide the contracts phase
		//	if needed
	},
	
	//--------------------------------------------------------------------------
	createStageMarker: function(drawComp) {
		
		this.stageMarker = drawComp.surface.add([{
			type: 'circle',
			radius: 12,
			fill: '#fa2',
			x: 80,
			y: 37
		}]);
		
		this.stageMarker[0].show(true);
	},
	
	//--------------------------------------------------------------------------
	createYearLabel: function(drawComp) {
		
		this.year = 1;
		this.yearLabel = drawComp.surface.add([{
    		type: 'text',
    		text: 'Year ' + this.year,
    		fill: '#000',
    		font: "16px monospace",
    		x: 222,
    		y: 12
    	},{
    		type: 'text',
    		text: 'Year ' + this.year,
    		fill: '#0a0',
    		font: "16px monospace",
    		x: 222,
    		y: 9
    	},{
    		type: 'text',
    		text: 'Year ' + this.year,
    		fill: '#ccc',
    		font: "16px monospace",
    		x: 222,
    		y: 10
    	}]);
    	
    	for (var index = 0; index < this.yearLabel.length; index++) {
    		this.yearLabel[index].show(true);
    	}
	},
	
	//--------------------------------------------------------------------------
	advanceYear: function() {
		
		this.year++;
    	for (var index = 0; index < this.yearLabel.length; index++) {
    		this.yearLabel[index].text = 'Year' + this.year;
    		this.yearLabel[index].show(true);
    	}		
	},
	
	//--------------------------------------------------------------------------
	advanceStage: function(drawComp) {
		
		this.stageMarkerPos++;
		
		if (this.stageMarkerPos > 2) {
			this.stageMarkerPos = 0;
			this.advanceYear();
			
			this.stageMarker[0].setAttributes({
				translate: {
					x: this.stageMarkerPos * 170,
					y: 0
				}
			}, true);
		}
		else {
			this.stageMarker[0].animate({
				duration: 500,
				to: {
					translate: {
						x: this.stageMarkerPos * 170,
						y: 0
					}
				}
			});
		}
	}
	
});

