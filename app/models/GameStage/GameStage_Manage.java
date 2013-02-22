package models;

import org.codehaus.jackson.*;
import org.codehaus.jackson.node.*;

//------------------------------------------------------------------------------
public class GameStage_Manage implements GameStage {

	public boolean ShouldEnter() {return true; }
	public void Enter() {}
	public void Exit() {}
	public void HandleClientData(JsonNode data) {}
}

