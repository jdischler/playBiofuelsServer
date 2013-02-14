package controllers;

import play.*;
import play.mvc.*;
import play.libs.F.*;

import org.codehaus.jackson.*;

import views.html.*;
import models.*;

public class Application extends Controller {
  
	public static Result index() {
		return ok(index.render());
	}
  
	public static Result moderator() {
		return ok(moderator.render());
	}
	
	public static Result global() {
		return ok(global.render());
	}
	
	public static WebSocket<JsonNode> connectToServer() {
		return new WebSocket<JsonNode>() {
			
			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
				
				try {
					BiofuelsServer.initializeConnection(in, out);
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		};
	}
}