/**

	TODO:
	- Make this into a actions.Memory.js file
	- Second todo item

 */


require('managers.Memory');

module.exports = {


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