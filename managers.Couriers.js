var ProfileUtils = require('utils.Profiles'); 
var actionsGlobal = require('actions.global');
var SpawnQueueManager = require('managers.SpawnQueue');
var SpawnManager = require('managers.Spawn');
var MemoryManager = require('managers.Memory');


/**

	TODO:
	- future: do this for remote rooms
	- find amount of sources in room
	- for each source
		- see if container is near source
		- see if drop is near source
		
		- calculate way from spawn.y+1 to container/dropoff point 
		- calculate necessary carry amount: 
			- best situation: 10E/tick
			- way time * 2 (back and there) + 2(for getting&dropoff) * 10E
			- future(calculate waytime for away rooms)
			- e.g.: 10ticks * 2 * 10 = 200E 
			- divide energy by 50 for finding carry parts
			- e.g. Math.ceil(200E/50) = 4
			- MAYBE STORE THIS IN MEMORY??
		- see how many carry parts are doing he job already
		- if less than what I need, order new courier creep 
		- if order is already in system, move on

		- save path into memory, because this wastes CPU!!!

 */


var CouriersManager = {
	
	/**
	 *
	 * Looks how many carry parts each source has
	 * 	- then it looks at close by containers and drops and assign them to creeps
	 *
	 */	
	run : function (roomName) {
		let droppedEnergyIds 			= MemoryManager.ReturnEnergySourceIDs(roomName, 'dropped_energy'); 
		let containerIds 				= MemoryManager.ReturnEnergySourceIDs(roomName, 'container');		
		let sourceIds 					= MemoryManager.ReturnEnergySourceIDs(roomName, 'source');		


		for (let sourceId of sourceIds){
			let carryPartsNeeded 		= CouriersManager.GetMinCarryPartsForObject(roomName, sourceId);
			let currentCarryPartsCount 	= CouriersManager.GetCurrentCarryPartsForObject(sourceId, 'source');
			let missingCarryPartsCount 	= carryPartsNeeded - currentCarryPartsCount;
			// make sourceId main assignment, never change this one
			// make container or drop id dynamic
			// that way creep will stay close to one source
			// not wasting way time
			if (missingCarryPartsCount > 0) {
				
			}
		}

		for (let dropId of droppedEnergyIds) {
			console.log(dropId, 'found a drop and have to assign this one now');
			let carryPartsNeeded 		= CouriersManager.GetMinCarryPartsForObject(roomName, dropId);
			let currentCarryPartsCount 	= CouriersManager.GetCurrentCarryPartsForObject(dropId, 'container');
			let missingCarryPartsCount 	= carryPartsNeeded - currentCarryPartsCount;
			if (missingCarryPartsCount > 0) {
				// first see if there are idle couriers
				let idleCouriers = _.filter(Game.creeps, (creep) =>
                            (creep.memory.targetId == '' ||
                            !creep.memory.targetId) &&
                            creep.memory.role == 'courier');
				if(idleCouriers){
					// idleCouriers[]
				}else{
					// if no idle couriers, then only order a new one
					let result = CouriersManager.OrderNewCourier(roomName, missingCarryPartsCount, dropId, 'container');
					console.log(result, ' <<<<<<<<<<<<<<<<<<<<<< order result in CouriersManager');	
				}
				
			}
		}
		
		for (let containerId of containerIds){
			let carryPartsNeeded 		= CouriersManager.GetMinCarryPartsForObject(roomName, containerId);
			console.log(carryPartsNeeded, ' <<<< carryPartsNeeded');
			let currentCarryPartsCount = CouriersManager.GetCurrentCarryPartsForObject(containerId, 'container');
			let missingCarryPartsCount = carryPartsNeeded - currentCarryPartsCount;
			if (missingCarryPartsCount > 0) {
				// first see if there are idle couriers
				// if not, then only order a new one
				let result = CouriersManager.OrderNewCourier(roomName, missingCarryPartsCount, containerId, 'container');
				console.log(result, ' <<<<<<<<<<<<<<<<<<<<<< order result in CouriersManager');
			}
		}
	},


	/**
	 *
	 * Calculates the path from storage/dropoff to object.
	 *  - later: also usable for distant couriers (getting energy from distant miners/containers)
	 *
	 */
	GetMinCarryPartsForObject: function(roomName, someObjectId){
		try {
			let someObj 				= Game.getObjectById(someObjectId);	
			if(!someObj) 				throw new Error('GetMinCarryPartsForObject() -> Object not existent anymore');
			if(roomName == '') 			throw new Error('GetMinCarryPartsForObject() -> roomName empty');
			// could use source, but source will also be south of first spawn, so we just use this dropoff point as center dropoff
			let dropOffCoordinates 		= Memory.rooms[roomName].energyDropoffs[Object.keys(Memory.rooms[roomName].energyDropoffs)[0]];
			// console.log(dropOff);
			let centerPos				= new RoomPosition(dropOffCoordinates.x, dropOffCoordinates.y, roomName);

			// let range 					= centerPos.pos.getRangeTo(someObj);
	// 2Do: save path into memory, because this wastes CPU!!!
			let path 					= centerPos.findPathTo(someObj);
			let stepsToWalk				= path.length;
			// console.log(stepsToWalk, ' <<<<<<<<<<<<<<<<<<<<< stepsToWalk');
			// simplify range (not taking creeps or walls etc into consideration. adding buffer though)
			let bothWays 				= (stepsToWalk * 2) + 5;


			// best situation: 10E/tick
			// 	- way time * 2 (back and there) + 2(for getting&dropoff) * 10E
			// 	- future(calculate waytime for away rooms)
			// 	- e.g.: 10ticks * 2 * 10 = 200E 
			// 	- divide energy by 50 for finding carry parts
			// 	- e.g. Math.ceil(200E/50) = 4
			let totalEnergy 			= (stepsToWalk + 2) * 10;
			// console.log(totalEnergy, ' <<<<<<< totalEnergy');
			let carryPartsNeeded 		= Math.ceil(totalEnergy / 50);

			return carryPartsNeeded;	
		}
		catch(err){
			console.log(err);
		}	
	},


	/**
	 *
	 * Gets amount of CARRY body parts of all creeps serving that object
	 *  -  (param) someObjectId : number an object ID
	 */	
	GetCurrentCarryPartsForObject : function(someObjectId) {
		try {        	
			var creepsServingObject 	= _.filter(Game.creeps, (creep) => 
							                creep.memory.targetId == someObjectId && 
							                creep.memory.role == 'courier' &&
							                creep.ticksToLive > 40);  	        
	        let parts 			 		= 0;          
	        for (creep of creepsServingObject) {
	        	let body = [];
	        	for (part of creep.body){
	        		body.push(part.type);
	        	}
	        	parts += ProfileUtils.CountBodyParts(body, 'carry'); // http://docs.screeps.com/api/#Creep.body
	        }  
	        return parts;
        }
        catch(err){
        	console.log(err);
        }
	},


	/**
	 *
	 * Sends a new order to SpawnQueueManager
	 *  - (param) objectTypeName : string 'container' or 'dropped_energy' 
	 *
	 */	
	OrderNewCourier : function (roomName, neededPartsCount, someObjectId, objectTypeName) {
		// console.log('/*----------  OrderNewCourier()  ----------*/');
		try {
			var targetAction 				= '';
			if(objectTypeName == 'container'){
				targetAction 				= 'withdraw';	
			}else if(objectTypeName == 'dropped_energy'){
				targetAction 				= 'pickup';	
			}else{
				throw new Error('OrderNewCourier() missing correct parameter: <objectTypeName>');
			}
			let container 					= Game.getObjectById(someObjectId);
			// console.log(someObjectId, ' <<<---- someObjectId');
			let energyCap 					= Game.rooms[roomName].energyCapacityAvailable;
			// console.log(energyCap, ' energyCap');			
			let maxTierCourier 				= ProfileUtils.GetMaxTier_Courier(energyCap);
			// console.log(maxTierCourier, ' maxTierCourier oooooooooooooooooooo');
			let perfectBody 				= ProfileUtils.GetBodyByPartCount(energyCap, ProfileUtils.GetBody_Courier, 'carry', neededPartsCount, maxTierCourier);
			// console.log(perfectBody, ' <- perfectBody in OrderNewMiner()');
			if(perfectBody === undefined){ 
				throw new Error('OrderNewCourier()');
			}else {
				// order new courier with perfectBody
				// set up order system to receive new orders
				// first see how many CARRY body parts are ordered already
				let ordered = SpawnQueueManager.GetTotalBodyPartsOrdered(roomName, 'courier', someObjectId, 'carry');
				// console.log(ordered, ' <- ordered in OrderNewMiner()');
				// console.log(neededPartsCount, ' <- neededPartsCount in OrderNewCourier()');
				if(ordered < neededPartsCount) {
					let result = SpawnQueueManager.NewOrder(roomName, perfectBody, 'courier', someObjectId, targetAction, SpawnManager.priorities.courier)
					// console.log(result, ' <- result in OrderNewCourier()');
					if(!result) throw new Error('function OrderNewCourier() calling SpawnQueueManager.NewOrder() result: false');
					return 'ordered new courier';
				}else{
					return 'courier order already in que';
				}

			}
		}catch(err){
			console.log(err);
		}
		
	},
}
module.exports = CouriersManager;