var SpawnQueueManager 					= require('managers.SpawnQueue');
var ProfileUtils 						= require('utils.Profiles'); 

var SpawnManager = {
	run : function(room) {

		// if room is being attacked, then stop spawning what ever I am spawning
		let attackmode = false;
		// and add info to new order for spawnQueue(2Do)

		// loop through all spawn that are not spawning
		let spawns = _.filter(Game.spawns, (s) => s.room.name == room);
		// console.log(spawns, ' <<< spawns');
		for (let spawn of spawns) {
			if(!spawn.spawning === null){

			}else{
				
			}
			// get whole spawn que
			// console.log(spawn, ' <<< spawn');
			let spawnQueue = Game.rooms[room].memory.spawnQueue;
			console.log(spawnQueue, ' << spawnQueue');
			for(let order of spawnQueue) {
				console.log(order.creepName, ' order');
				Game.spawns['Spawn1'].spawnCreep(order.body, order.creepName, 
			    {memory: {role: order.role, homeRoom: room, targetId: order.targetId, targetAction: order.targetAction}});
			}
		}
		
		// sort by prio (later)
		
		// for each spawn 
			// get first item from spawn que
			// make spawn spawn
			// delete item from spawn que
	}
}
module.exports = SpawnManager;