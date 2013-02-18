/*
 * File: NetworkLayer.js
 */

Ext.define('BiofuelsModerator.view.NetworkLayer', {
      
    //--------------------------------------------------------------------------
    constructor: function() {
    	
    	console.log('constructor happening!');
    	this.networkEvents = new Array();
    	this.openSocket();
    },
  
    //--------------------------------------------------------------------------
    registerListener: function(eventName, eventProcessor, scope) {
    	var event = {
    		name: eventName,
    		processor: eventProcessor,
    		scope: scope
    	};
    	
    	console.log("Adding log event: ");
    	console.log(event);
    	this.networkEvents.push(event);
    },

    //--------------------------------------------------------------------------
	openSocket: function() {
		
		var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
		
		var self = this;
//		this.webSocket = new WS('ws://192.168.1.101:9000/BiofuelsGame/serverConnect');
		this.webSocket = new WS('ws://10.140.2.208:9000/BiofuelsGame/serverConnect');
		this.webSocket.onopen = function() {
			console.log('websocket onOpen!!');
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
		this.socket = this.webSocket;
	},
	
    //--------------------------------------------------------------------------
	send: function(json) {
		this.socket.send(json);
	}

});
