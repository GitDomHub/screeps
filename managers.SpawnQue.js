require('managers.Memory');
var ProfileUtils 						= require('utils.Profiles'); 
var actionsGlobal 						= require('actions.global');

/**

	TODO:
	- create job que in every rooms memory
	- func for creating new que entry
		- priority 1: standard
		- priority 2: high (hostile creeps are in room, and need fast defenders or tower refiller)
	- maybe make a job reset?

 */

var SpawnQueManager = {

	resetSpawnQueTicks : 10,

	run : function(room) {
		SpawnQueManager.InitReset(room);

	},

	InitReset : function (room) {
		if(Game.rooms[room].memory.spawnQue == undefined || (Game.rooms[room].memory.spawnQueTimeStamp + SpawnQueManager.resetSpawnQueTicks) < Game.time){
			if (Game.rooms[room].memory.spawnQue) 
				delete Game.rooms[room].memory.spawnQue;
			Game.rooms[room].memory.spawnQue 			= [];
			Game.rooms[room].memory.spawnQueTimeStamp 	= Game.time;
		}
	},

	NewOrder : function (room, body, role, targetId, targetAction, priority) {
		try {
			let randomNum 			= Math.floor(Math.random() * 2000) + 1;
			let name 				= role + Game.time + room + '-' + randomNum;
			let entry 				= {
				'creepName' 		: name,
				'body'  			: body,
				'role' 				: role,
				'targetId' 			: targetId,
				'targetAction' 		: targetAction,
				'priority'			: priority
			}
			// save new order into memory
			Game.rooms[room].memory.spawnQue.push(entry);
			return true;
		}
		catch(err) {
		    return err;
		}		
	},

	GetEntries : function(room) {
		return Game.rooms[room].memory.spawnQue;
	},

	GetEntriesForTargetId : function (room, role, targetId) {
		console.log ('GetEntriesForTargetId');
		console.log (room, ' < room');
		console.log (role, ' < role');
		console.log (targetId, ' < targetId');
		let allJobs 					= Game.rooms[room].memory.spawnQue;
		console.log(allJobs, ' < allJobs');	
		let i = 0;
		// for (var singleJob in allJobs){
		// 	console.log(Object.keys(singleJob), ' singleJob');
		// 	console.log(singleJob.targetId, 'targetId');
		// 	console.log(singleJob.role, 'role');
		// }	
		let filteredJobs 				= _.filter(allJobs, (job) => job.targetId == targetId && 
																	  job.role == role);
		console.log(filteredJobs, ' < filteredJobs');
		
		return filteredJobs;
	},

	GetTotalBodyPartsOrdered : function (room, role, targetId, partName){
		let filteredJobs 				= SpawnQueManager.GetEntriesForTargetId(room, role, targetId);
		console.log(filteredJobs, ' <<<--- filteredJobs');
		let partCount 					= 0;
		for(let job of filteredJobs){
			console.log(job.body, ' <<<--- body');
			console.log(job.targetId, ' <<<--- targetId');
			partCount += ProfileUtils.CountBodyParts(job.body, partName); //maybe value['body']??
			console.log(partCount, ' <<<--- partCount');
		}
		// _.forEach(filteredJobs, function(value, key) {
		  
		// });
		console.log(partCount, ' <<<- totalPartCount');
		return partCount;
	}





}
module.exports = SpawnQueManager;
