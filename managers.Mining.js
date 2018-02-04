/**

	TODO:
	- find all sources in room
	- see how many screeps are serving each source
	- calculate amount of WORK body parts per assigned source
	- if less than 5 work parts for mining plus one for repairing container, create new creep with as many work parts to reach 6

 */


require('managers.Memory');
var ProfileUtils = require('utils.Profiles'); 
var actionsGlobal = require('actions.global');
var SpawnQueManager = require('managers.SpawnQue');


var MiningManager = {

	minWorkPartsPerSource : 6, // 5 to empty it, 1 extra to repair container


	run : function (room) {
		try {
			console.log('/*----------  MiningManager.run()  ----------*/');
			// do this every loop
			// get all sources from memory
			let sourceIds = actionsGlobal.ReturnEnergySourceIDs(room, 'source');
			console.log(sourceIds, ' <--- sourceIds');
			for (sourceId of sourceIds){
				console.log(sourceId, ' <--- sourceId loop');
				let workSpots = MiningManager.GetWorkSpotsAroundSource(sourceId);
				console.log(workSpots, ' < workSpots');
				
				// check how many workparts i got currently per source
				let workPartsCount 				= MiningManager.GetSourceWorkParts(sourceId); // maybe need to change 
				console.log(workPartsCount, ' <----- workPartsCount');
				// 2Do: 
				
				if (workPartsCount < MiningManager.minWorkPartsPerSource) {
					console.log(room, ' room');
					console.log(workPartsCount, ' workPartsCount');
					console.log(sourceId, ' sourceId');
					
					let result = MiningManager.OrderNewMiner(room, workPartsCount, sourceId);
					console.log(result, 'MiningManager.OrderNewMiner result');
				}

			}
		}catch(err){
			console.log(err);
		}
		
	},
	
	GetSourceWorkParts : function (sourceId) {
        try {
        	let creepsServingSource = _.filter(Game.creeps, (creep) => 
	                creep.memory.assignedSource == sourceId && 
	                creep.memory.role == 'miner' &&
	                creep.ticksToLive > 40);  
	        console.log(creepsServingSource, ' <<-- creeps serving source');
	        let parts 							= 0;          
	        for (creep of creepsServingSource) {
	        	// need to put all creep.body.type into new array
	        	let body = [];
	        	for (part of creep.body){
	        		body.push(part.type);

	        	}
	        	console.log(body, ' <<<<<<<<<<<<<<<<<<<<< body');
	        	// console.log(ProfileUtils.CountBodyParts(creep.body, 'work'), ' <---- CountBodyParts');
	        	parts += ProfileUtils.CountBodyParts(body, 'work'); // http://docs.screeps.com/api/#Creep.body
	        }  
	        return parts;
        }
        catch(err){
        	console.log(err);
        }
        
	},

	OrderNewMiner : function (room, partsCount, sourceId) {
		console.log('/*----------  OrderNewMiner()  ----------*/');
		try {
			let source 						= Game.getObjectById(sourceId);
			// console.log(sourceId, ' <<<---- source ID');
			let energyCap 					= source.room.energyCapacityAvailable;
			// console.log(energyCap, ' energyCap');			
			let missingWorkPartCount 		= MiningManager.minWorkPartsPerSource - partsCount;
			console.log(missingWorkPartCount, ' missingWorkPartCount');
			let minerMaxTier 				= ProfileUtils.GetMaxTier_Miner(energyCap);
			console.log(minerMaxTier, ' minerMaxTier oooooooooooooooooooo');
			// return;
			// HERE IS ERROR!!!
			let perfectBody 				= ProfileUtils.GetBodyByPartCount(energyCap, ProfileUtils.GetBody_Miner, 'work', missingWorkPartCount, minerMaxTier);
			console.log(perfectBody, ' <- perfectBody in OrderNewMiner()');
			
			if(perfectBody === undefined){ 
				return false;
			}else {
				// order new miner with perfectBody
				// set up order system to receive new orders
				// first see how many WORK body parts are ordered already
				let ordered = SpawnQueManager.GetTotalBodyPartsOrdered(room, 'miner', sourceId, 'work');
				console.log(ordered, ' <- ordered in OrderNewMiner()');
				console.log(missingWorkPartCount, ' <- missingWorkPartCount in OrderNewMiner()');
				if(ordered < missingWorkPartCount) {
					console.log('ordering new miner');
					//2Do: determine priority in external
					let result = SpawnQueManager.NewOrder(room, perfectBody, 'miner', sourceId, 'harvest', 1)
					console.log(result, ' <- result in OrderNewMiner()');
					return 'ordered new miner';
				}else{
					return 'order already in que';
				}

			}
		}catch(err){
			console.log(err);
		}
		
	},

	GetWorkSpotsAroundSource : function(sourceId) {
		let sourceObj 				= Game.getObjectById(sourceId);
		let x 						= sourceObj.pos.x;
		let y 						= sourceObj.pos.y;
		let top 					= y - 1;
		let bottom 					= y + 1;
		let left 					= x - 1;
		let right 					= x + 1;

		console.log(top + ' - ' + bottom + ' - ' + left + ' - ' + right );

		let terrain = sourceObj.room.lookForAtArea(LOOK_TERRAIN,top,left,bottom,right,true);
		// console.log(terrain, ' <- terrain');
		let workspots = _.filter(terrain, (t) => t.terrain == 'plain');
		// for(let spot of workspots) {
		// 	console.log(spot.terrain, 'terrain type');
		// }
		return Object.keys(workspots).length;
	}
	
};
module.exports = MiningManager;