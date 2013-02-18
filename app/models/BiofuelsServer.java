package models;

import play.mvc.*;
import play.libs.*;
import play.libs.F.*;
import play.Logger;

/*import akka.util.*;
import akka.actor.*;
import akka.dispatch.*;
import static akka.pattern.Patterns.ask;
*/
import org.codehaus.jackson.*;
import org.codehaus.jackson.node.*;

import java.util.*;

//import static java.util.concurrent.TimeUnit.*;

//------------------------------------------------------------------------------
public class BiofuelsServer {
    
    public static void initializeConnection(WebSocket.In<JsonNode> in, 
    						final WebSocket.Out<JsonNode> out) throws Exception {
         
		// For each event received on the socket,
		in.onMessage(new Callback<JsonNode>() {
		   public void invoke(JsonNode event) {
			   
//		   	   Logger.info(event.toString());
		   	   Room.processMessage(out, event);
		   } 
		});
		
		// When the socket is closed.
		in.onClose(new Callback0() {
			public void invoke() {
			   
			}
		});
	}
}
