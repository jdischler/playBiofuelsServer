package models;

import play.mvc.*;
import play.libs.*;
import play.libs.F.*;
import play.Logger;

import akka.util.*;
import akka.actor.*;
import akka.dispatch.*;
import static akka.pattern.Patterns.ask;

import org.codehaus.jackson.*;
import org.codehaus.jackson.node.*;

import java.util.*;

import static java.util.concurrent.TimeUnit.*;

/**
 * A chat room is an Actor.
 */
public class BiofuelsServer {
    
    public static void initializeConnection(WebSocket.In<JsonNode> in, 
    						final WebSocket.Out<JsonNode> out) throws Exception {
         
        Logger.info("on the biofuels server...join!!!!!");
		// For each event received on the socket,
		in.onMessage(new Callback<JsonNode>() {
		   public void invoke(JsonNode event) {
			   
		   	   Logger.info(event.toString());
		   	   
		   	   Room.processMessage(out, event);
		   } 
		});
		
		// When the socket is closed.
		in.onClose(new Callback0() {
		   public void invoke() {
			   
		   }
		});
	}

    // Send a Json event to all members
    public void notifyAll(String kind, String user, String text) {
     
  /*  	for(WebSocket.Out<JsonNode> channel: members.values()) {
            
            ObjectNode event = Json.newObject();
            event.put("kind", kind);
            event.put("user", user);
            event.put("message", text);
            
            ArrayNode m = event.putArray("members");
            for(String u: members.keySet()) {
                m.add(u);
            }
            
            channel.write(event);
        }
 */
    }
}
