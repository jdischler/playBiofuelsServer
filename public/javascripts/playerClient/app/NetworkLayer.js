/*
 * File: NetworkLayer.js
 */

 // TODO: would be nice if this could be shared between: player, moderator, global projects?
Ext.define('Biofuels.view.NetworkLayer', {
      
    //--------------------------------------------------------------------------
    constructor: function() {
    	
    	this.networkEvents = new Array();
    },
  
    //--------------------------------------------------------------------------
    registerListener: function(eventName, eventProcessor, scope) {
    	var event = {
    		name: eventName,
    		processor: eventProcessor,
    		scope: scope
    	};
    	
    	this.networkEvents.push(event);
    },

    //--------------------------------------------------------------------------
	openSocket: function(ipAddr,port,url) {
		
		var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
		
		var self = this;
		this.webSocket = new WS('ws://' + ipAddr + ':' + port + url);
		
		this.webSocket.onopen = function() {
		};
		this.webSocket.onclose = function() {
			console.log('websocket onClose!!');
		};
		this.webSocket.onmessage = function(message) {
			
			var json = JSON.parse(message.data);
			var index;
			for (index = 0; index < self.networkEvents.length; index++) {
				var ne = self.networkEvents[index];
				if (!json.event.localeCompare(ne.name)) {
					ne.processor.call(ne.scope, json);
				}
			}
		};
		this.webSocket.onerror = function() {
			console.log('websocket onError!!');
		};
	},
	
    //--------------------------------------------------------------------------
	send: function(json) {
		this.webSocket.send(json);
	}

});
