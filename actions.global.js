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
	        }
	    }
	},

	writeSourcesIntoMem : function (room) {
		if(!Memory.EnergySources || Memory.EnergySources.length == 0) {
			Memory.EnergySources = {};
			let allSources = room.find(FIND_SOURCES);
			for (singleSource of allSources) {
				Memory.EnergySources.push(singleSource.id); 
				
			}
		}

	},

	writePathSpawnToSources : function (room) {
		//find all sources 
		// let allSources = room.find(FIND_SOURCES);

		// // for each source get path there
		// let path = spawn.room.findPath(spawn, source);
		// let path = room.findPathTo(x, y, opts)
		// creep.moveByPath(path);
	},

	writePathSourcesToSpawn : function () {

	}


	


}