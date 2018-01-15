require('vars.global');

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

	initRoomMemory : function () {
		if (!Memory.rooms) {
			Memory.rooms = {};			
		}

		for (singleRoom in Game.rooms) {
			if (!Memory.rooms[singleRoom.name])
				Memory.rooms[singleRoom.name];
		}
			

			

	},

	writeSourcesIntoMem : function (room) {

		let allSources = Game.rooms[room].find(FIND_SOURCES);
		console.log(allSources);

		if(!Memory.rooms[room].EnergySources || Memory.rooms[room].EnergySources == 0) {
			for (singleSource of allSources) {
				Memory.rooms[room].EnergySources.push(singleSource.id); 				
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