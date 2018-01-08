module.exports = {

	// Clear memory function
	// - saves memory
	ClearMemory : function() {
		// loop through all creep we have in memory
		for(var name in Memory.creeps) {
			// if creep is not existent in Game, but only in memory...
	        if(!Game.creeps[name]) {
	        	// delete this entry
	            delete Memory.creeps[name];
	            console.log('Clearing non-existing creep memory:', name);
	        }
	    }
	}


}