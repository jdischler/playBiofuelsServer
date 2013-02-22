package models;

import java.util.*;

import org.codehaus.jackson.*;
import org.codehaus.jackson.node.*;

//------------------------------------------------------------------------------
public class RoundManager {

	private List<GameStage> 	mGameStageSequence;
	private Iterator<GameStage>	mGameStageIterator;
	private GameStage			mCurrentGameStage;
	
	//--------------------------------------------------------------------------
	public void Init() {
		mGameStageSequence = new ArrayList<GameStage>();
		
		// Ordered by how we want them to play out, naturally.
		mGameStageSequence.add(new GameStage_Contracts());
		mGameStageSequence.add(new GameStage_Plant());
		mGameStageSequence.add(new GameStage_Manage());
		mGameStageSequence.add(new GameStage_Grow());
		mGameStageSequence.add(new GameStage_RoundWrapUp());
		mGameStageSequence.add(new GameStage_FinalWrapUp());

		mGameStageIterator = mGameStageSequence.iterator();
		mCurrentGameStage = mGameStageSequence.get(0);
	}
	
	//--------------------------------------------------------------------------
	public void AdvanceStage() {
	
		GameStage nextStage;
		if (mGameStageIterator.hasNext()) {
			nextStage = mGameStageIterator.next();
		}
		else {
			// wrap around to the start
			mGameStageIterator = mGameStageSequence.iterator();
			nextStage = mGameStageSequence.get(0);
		}
		
		if (nextStage.ShouldEnter()) {
			// exit old, set new, enter new
			mCurrentGameStage.Exit();
			mCurrentGameStage = nextStage;
			mCurrentGameStage.Enter();
		}
		else {
			// FIXME: prevent chance of endless recursion....
			this.AdvanceStage();
		}
	}
	
	//--------------------------------------------------------------------------
	public void RouteClientData(JsonNode data) {
		
		// TODO: could give the RoundManager a chance to sniff out the data to
		//	see if there is anything it should handle? E.g., AdvancingStages, etc?
		
		mCurrentGameStage.HandleClientData(data);
	}
}
