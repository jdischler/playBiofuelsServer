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

import models.Farmer;

import static java.util.concurrent.TimeUnit.*;

//---------------------------------------------------
public class Room {
//---------------------------------------------------


	
	// For fast Room lookup by Name
    private static Map<String,Room> mNameToRoom = new HashMap<String,Room>();
    
    // For fast Socket (player) to Room lookup
    private static Map<WebSocket.Out<JsonNode>,Room> mSocketToRoom = 
    		new HashMap<WebSocket.Out<JsonNode>,Room>();
    
	private String 	mName;
	private String 	mPassword;
	private Integer mMaxPlayers;
//	private Object	mWorld;
	private Map<String,Farmer>	mFarmers; // put on world?
	private List<WebSocket.Out<JsonNode>> mGlobalViewers; 

	
	//TEMP Move into a settings object?
	private Integer mFieldCount;
	private boolean mContractsEnabled;
	private boolean mManagementOptionsEnabled;

	//---------------------------------------------------
	public Room(String name, String password, Integer maxPlayers) {
		mName = name;
		mPassword = password;
		mMaxPlayers = maxPlayers;
		mFarmers = new HashMap<String,Farmer>();
		mGlobalViewers = new ArrayList<WebSocket.Out<JsonNode>>();

		//TEMP Move into a settings object?
		mFieldCount = 2;
		mContractsEnabled = false;
		mManagementOptionsEnabled = false;
	}

	//---------------------------------------------------
	private static Room getRoom(String name) {
		return mNameToRoom.get(name);
	}
	
	//---------------------------------------------------
	private static boolean doesRoomExist(String name) {
		
		return mNameToRoom.containsKey(name);
	}
	
	// Validates a room name, typically for creation
	//---------------------------------------------------
	private static boolean isRoomNameValid(String name) {
		
		if (name.length() < 1) {
			return false;
		}
		
		return !doesRoomExist(name);
	}
	
	//---------------------------------------------------
	private synchronized static boolean createRoom(String name, 
						String password, 
						Integer maxPlayers, 
						final WebSocket.Out<JsonNode> out) {
	
		if (!isRoomNameValid(name)) {
			return false;
		}
	
		Room room = new Room(name, password, maxPlayers);
		mNameToRoom.put(name, room);
		
		// TODO: this is a moderator socket, not a player socket...store that separately?
		// TODO: also validate that the given socket isn't already in there...
		mSocketToRoom.put(out, room);

		return true;
	}
	
	// TODO: check password?
	//---------------------------------------------------
	private static boolean isFarmerNameValid(String roomName, String farmerName) {
		
		if (roomName.length() < 1 || !doesRoomExist(roomName)) {
			return false;
		}
	
		if (farmerName.length() < 1) return false;
		
		Room room = getRoom(roomName);
		if (room == null) {
			return false;
		}
		if (room.mFarmers.containsKey(farmerName)) {
			return false;
		}
		
		// TODO: check for and invalidate swear or other unacceptable words?
		
		return true;
	}
	
	// TODO: check password?
	// TODO: ensure room size doesn't overflow
	//---------------------------------------------------
	private synchronized static boolean createFarmer(String roomName, 
			String farmerName, 
			final WebSocket.Out<JsonNode> out) {
		
		if (!isFarmerNameValid(roomName, farmerName)) {
			return false;
		}
		
		Room room = getRoom(roomName);
		if (room == null) {
			return false;
		}
		
		// TODO: validate that socket (player) isn't already in map
		mSocketToRoom.put(out, room);
		
		Farmer newFarmer = new Farmer(farmerName);
		// TODO: do this as a member func...and the member func can send an update
		//	to the global view to show the current list of all players...
		room.mFarmers.put(farmerName, newFarmer); 
		room.broadcastFarmerList();
	
		return true;
	}

	// TODO: check password?
	// TODO: ensure room size doesn't overflow
	//---------------------------------------------------
	private synchronized static boolean joinGlobalViewer(String roomName, String password,
			final WebSocket.Out<JsonNode> out) {
	
		Room room = getRoom(roomName);
		if (room == null) {
			return false;
		}
		
		// TODO: do this as a member func...and the member func can send an update
		//	to the global view to show the current list of all players...
		room.mGlobalViewers.add(out); 
		room.broadcastFarmerList();
		return true;
	}
	
	//---------------------------------------------------
	private void broadcastFarmerList() {
		
		ObjectNode res = Json.newObject();
		res.put("event", "farmerList");
		ArrayNode ar = res.putArray("farmers");
		for (String name : mFarmers.keySet()) {
			ObjectNode nameMap = Json.newObject();
			nameMap.put("name", name);
			ar.add(nameMap);
		}
		
		for (WebSocket.Out<JsonNode> out : mGlobalViewers) {
			out.write(res);
		}
	}
	
	// TODO: possibly keep a Map<Room,Array<WebSocket.Out<JsonNode>>>?
	//---------------------------------------------------
	public void broadcastMessage(JsonNode json, boolean sendToGlobalViewers) {
		
		for (Map.Entry<WebSocket.Out<JsonNode>,Room> entry : mSocketToRoom.entrySet()) {
			WebSocket.Out<JsonNode> key = entry.getKey();
			Room value = entry.getValue();
			if (value == this) {
				key.write(json);
			}
		}
		if (sendToGlobalViewers) {
			for (WebSocket.Out<JsonNode> out : mGlobalViewers) {
				out.write(json);
			}
		}
	}

	//---------------------------------------------------
	public ObjectNode generateSettingsEvent() {
		
		ObjectNode res = Json.newObject();
		
		res = Json.newObject();
		res.put("event", "changeSettings");
		res.put("fieldCount", this.mFieldCount);
		res.put("contractsOn", this.mContractsEnabled);
		res.put("mgmtOptsOn", this.mManagementOptionsEnabled);
		
		return res;
	}			

	//---------------------------------------------------
	public synchronized static boolean processMessage(final WebSocket.Out<JsonNode> out,
    						JsonNode event) {
    
    	String eventName = event.get("event").asText();
		if (eventName == null) {
			// TODO: Error if no event name
			return false;
		}

		if (eventName.equals("validateRoom")) {
			
			String roomName = event.get("roomName").asText();
			
			ObjectNode res = Json.newObject();
			res.put("event", "validateRoom");
			res.put("result", Room.isRoomNameValid(roomName));
			out.write(res);
			return true;
		}
		else if (eventName.equals("createRoom")) {
			
			String roomName = event.get("roomName").asText();
			String password = event.get("password").asText();
    		Integer playerCount = event.get("playerCount").asInt();
    	
    		boolean result = Room.createRoom(roomName, password, playerCount, out);
    		
			ObjectNode res = Json.newObject();
			res.put("event", "createRoom");
			res.put("result", result);
			if (result == false) {
				// TODO: better error feedback from the server
				res.put("errorMessage", "Room creation failed. Most likely cause " +
					"is not entering a room name or a room already exists with the " + 
					"same name. Please try entering a unique name."); 
			}
			out.write(res);
			return result;
    	}
		else if (eventName.equals("validateUserName")) {
			
			String roomName = event.get("roomName").asText();
			String password = event.get("password").asText();
			String userName = event.get("userName").asText();
			
			ObjectNode res = Json.newObject();
			res.put("event", "validateUserName");
			res.put("roomResult", Room.doesRoomExist(roomName));
			// TODO: password processing
			res.put("needsPassword", false);
			res.put("passwordResult", true);
			res.put("userNameResult", Room.isFarmerNameValid(roomName,userName));
			out.write(res);
			return true;
		}
		else if (eventName.equals("joinRoom")) {
    		
			String roomName = event.get("roomName").asText();
			String password = event.get("password").asText();
			String userName = event.get("userName").asText();
			
			boolean result = Room.createFarmer(roomName, userName, out);
			
			ObjectNode res = Json.newObject();
			res.put("event", "joinRoom");
			res.put("result", result);
			res.put("userName", userName);
			if (result == false) {
				// TODO: better error feedback from the server
				res.put("errorMessage", "Joining the game failed. Most likely cause " +
					"is not entering a valid room name or the user name already exists."); 
			}
			out.write(res);

			// Send initial settings state
			// TODO: encapsulate
			Room room = mSocketToRoom.get(out);
			if (room == null) {
				// TODO: probably an error?
				return result;
			}
			
			res = room.generateSettingsEvent();
			out.write(res);			

			return result;
    	}
    	else if (eventName.equals("globalValidateRoom")) {
  			String roomName = event.get("roomName").asText();
			String password = event.get("password").asText();
			
			ObjectNode res = Json.newObject();
			res.put("event", "globalValidateRoom");
			res.put("roomResult", Room.doesRoomExist(roomName));
			// TODO: password processing
			res.put("needsPassword", false);
			res.put("passwordResult", true);
			out.write(res);
			return true;
  		}
  		else if (eventName.equals("globalJoinRoom")) {
  			String roomName = event.get("roomName").asText();
			String password = event.get("password").asText();
			
			boolean result = Room.joinGlobalViewer(roomName, password, out);
			
			ObjectNode res = Json.newObject();
			res.put("event", "globalJoinRoom");
			res.put("result", result);
			if (result == false) {
				// TODO: better error feedback from the server
				res.put("errorMessage", "Joining the game failed. Most likely cause " +
					"is not entering a valid room name or the password did not match."); 
			}
			out.write(res);
			
			Room room = Room.getRoom(roomName);
			if (room == null) {
				// TODO: probably an error?
				return result;
			}

			// send farmer list...send settings 
			room.broadcastFarmerList();
			res = room.generateSettingsEvent();
			out.write(res);			

			return result;
  		}

    	Room room = mSocketToRoom.get(out);
    	if (room == null) {
    	// TODO: error if NULL
    		return false;
    	}
    				
    	if (eventName.equals("changeSettings")) {
    		
    		Integer fieldCt = event.get("fieldCount").asInt();
    		boolean contractsOn = event.get("contractsOn").asBoolean();
    		boolean mgmtOptsOn = event.get("mgmtOptsOn").asBoolean();
    		
    		room.mFieldCount = fieldCt;
    		room.mContractsEnabled = contractsOn;
    		room.mManagementOptionsEnabled = mgmtOptsOn;
    		
    		// pass the incoming JsonNode event back out to the clients in the room
    		//	...and any global viewers
    		room.broadcastMessage(event, true);
    		return true;
    	}
	
		return true;
	}
}
