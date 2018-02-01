/**

	TODO:
	- Make this into a actions.Memory.js file
	- Second todo item

 */


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

	InitRoomMemory : function () {
		if (!Memory.rooms) {
			Memory.rooms = {};			
		}
	},

	/**
	 *
	 * Returning structure IDs of energy sources
	 * (param) : roomName (e.g. E11S22)
	 * (param) : structure_name (either: source/link/storage/container)
	 *
	 */
	
	ReturnEnergySourceIDs : function (roomName, structure_name) {
		if(!structure_name || !roomName) 
			return;
		let allSources = Memory.rooms[roomName].energySources;
        return _.filter(_.keys(allSources), value => allSources[value] === structure_name);        
	}


	


}