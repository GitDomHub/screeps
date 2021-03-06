/*define variables on a global scale for every function in screeps available*/

// Initiating room options
var InitMemRoomOpts = (function () {
	// only do this if object doesnt exists already
	if (!Memory.roomOpts) {
		// write all rooms into that part of  memory
		let roomNames = {};
		for (let room in Game.rooms) {
			roomNames[room] = {};
		};
		Memory.roomOpts = roomNames;
	}

	// check if standard values for each room exist
	for (let room in Memory.roomOpts) {
		if(!Memory.roomOpts[room].repairUntil)
			Memory.roomOpts[room].repairUntil = 1000;
		if(!Memory.roomOpts[room].repairUntilPercentage)
			Memory.roomOpts[room].repairUntilPercentage = 0.5;
		if(!Memory.roomOpts[room].minEnergyInStorage)
			Memory.roomOpts[room].minEnergyInStorage = 1000; // if more energy, then we will increase hits of structures
		if(!Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy)
			Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy = 1000;
	}	
}());

/**
 *
 * Checks whether Source is guarded. For early game we dont harvest this one
 *
 */

var checkIfSourceIsCloseToLair = function (source, room) {
	let isCloseToLair 				= false;
	let keeperLairObj 				= Game.rooms[room].find(FIND_STRUCTURES, {
		filter: { structureType: STRUCTURE_KEEPER_LAIR }
	});
	for (let lair of keeperLairObj) {
		if(source.pos.inRangeTo(lair, 5)){
			isCloseToLair = true;
		}     		
	}
	return isCloseToLair;
};


// store vars in memory, so we can change them manually over console 
// if (!Memory.room1) 
// 	Memory.room1 						= {};

// if (!Memory.room1.name) 	
//     Memory.room1.name 					= 'E83S21';

// if (!Memory.room1.repairUntil) 
// 	Memory.room1.repairUntil 			= 750000;


// 2Do: increase current repairUntil amount by 10.000 if: 1. no structures to repair 2. energy in storage is higher than a certain amount


// write all rooms into memory
var roomNames = {};
for (let room in Game.rooms) {
	roomNames[room] = {};
};
Memory.rooms = roomNames;


for (let room in Memory.rooms) {
	// find all STRUCTURES that need REPAIR and put them into the rooms memory
	let damagedStruc 				= Game.rooms[room].find(FIND_STRUCTURES,
 		                            {filter: (s) => s.hits < (s.hitsMax * Memory.roomOpts[room].repairUntilPercentage) && 
 		                                            s.hits < Memory.roomOpts[room].repairUntil});
	// sort all structures from lowest to highest hits (that way ramparts that just have been built will not die immediately)
	damagedStruc.sort(function(a,b){return a.hits - b.hits});
	// console.log(Object.values(damagedStruc));

	let strucs = {};
	for (let struc of damagedStruc) {
		strucs[struc.id] = struc.hits;	
	}
	Memory.rooms[room].damagedStructures = {}; // empty to see if memory gets renewed quicker
	Memory.rooms[room].damagedStructures = strucs;

	// CONTAINERS & STORAGES & links
	let cont_stor_link 					= Game.rooms[room].find(FIND_STRUCTURES, 
										{filter: (s) => s.structureType == STRUCTURE_CONTAINER ||
														s.structureType == STRUCTURE_STORAGE ||
														s.structureType == STRUCTURE_LINK });
	let energySources = {};
	let i = 0;
	for (let struc of cont_stor_link) {		
		energySources[struc.id] = struc.structureType;	
		i++;
	}
	// ENERGY SOURCES
	var sources 						= Game.rooms[room].find(FIND_SOURCES);
	for (let source of sources) {		
		// if source has a keeper close by the for now dont put it in memory
   //   	var keeperLairObj 				= Game.rooms[room].find(FIND_STRUCTURES, {
			//    filter: { structureType: STRUCTURE_KEEPER_LAIR }
			// });
   //   	// console.log(keeperLairObj, ' <------- keeper lair objects in room');
   //   	let isCloseToLair = false;
   //   	for (let lair of keeperLairObj) {
   //   		if(source.pos.inRangeTo(lair, 8)){
   //   			isCloseToLair = true;
   //   		}     		
   //   	}
     	let sourceIsCloseToLair = checkIfSourceIsCloseToLair(source, room);
     	if (!sourceIsCloseToLair) {
 			energySources[source.id] = 'source';	
 		}		
	}
	// DROPPED ENERGY
	let droppedEnergyRes 				= Game.rooms[room].find(FIND_DROPPED_RESOURCES, 
										{filter: (s) => s.amount > 100 && 
														s.resourceType === RESOURCE_ENERGY });
	for (let drop of droppedEnergyRes) {	
		// only log drops from close to sources/containers/spawn
		let isCloseToSource = false;
		console.log(drop.pos, ' <---------------- drop.pos');
		for (let source of sources){
			if(source.pos.inRangeTo(drop, 2)){
     			isCloseToSource = true;
     		} 
		}	
		if(isCloseToSource) {
			energySources[drop.id] = 'dropped_energy';
		}	
	}


	Memory.rooms[room].energySources = energySources;

	//DROP OFF POINTS FOR EARLY GAME
	let dropOffPoints = {};
	// make a dropoff for each a spawn (and a controller later)
	let spawnObj = Game.rooms[room].find(FIND_MY_SPAWNS);
	// for(let singleSpawn of spawnObj) {
	let dropOffPos = new RoomPosition((spawnObj[0].pos.x), (spawnObj[0].pos.y+1), room);
	console.log(dropOffPos, ' <-------------------- roompos for dropoff');
	Memory.rooms[room].energyDropoffs = {};
	Memory.rooms[room].energyDropoffs[spawnObj[0].name] = {
		x : dropOffPos.x,
		y : dropOffPos.y
	};
	// } 


	// testing storing paths
	//
	//
	
	// let cont1 							= Game.getObjectById('5a47348a8f3dc80a6d80c71a'); 
	// let cont2 							= Game.getObjectById('5a4992387cefde22d046c0a3'); 
	

	// To do list for storing path for upgraders:
	// (later: if no storage, then use container. if not container, then use closest source.)
	// If storage exists in room: 
	let storage 						= Game.rooms[room].storage;
	let controller 						= Game.rooms[room].controller;
	// // - get path STORAGE to CONTROLLER
	// let pathStorageToController 		= Game.rooms[room].findPath(storage.pos, controller.pos);
	// // - get path CONTROLLER to STORAGE
	// let pathControllerToStorage 		= Game.rooms[room].findPath(controller.pos, storage.pos);

	// Memory.pathToController 			= Room.serializePath(pathStorageToController);
	// Memory.pathToStorage 			 	= Room.serializePath(pathControllerToStorage);


	// get all creeps that are upgraders, and set these paths into memory
	// later, we do this only once when creeps are spawned, not every tick
	// creep.memory.pathToController = pathStorageToController;
	// creep.memory.pathToStorage = pathControllerToStorage;

	if (Game.creeps['Upgrad23577459'] != undefined) {
        Game.creeps['Upgrader23577459'].memory.pathToController = Room.serializePath(pathStorageToController);
        Game.creeps['Upgrader23577459'].memory.pathToStorage = Room.serializePath(pathControllerToStorage);
    } 


	//
	//
	//
	console.log('anzahl an damages struc in room ' + room + ' : ' + Object.keys(Memory.rooms[room].damagedStructures).length);

	// increase max hits for everything when we have enough energy
	if(storage && Object.keys(Memory.rooms[room].damagedStructures).length == 0) {
		console.log('store energy is: ' + storage.store[RESOURCE_ENERGY] + ' and min energy is: ' + Memory.roomOpts[room].minEnergyInStorage);
		if (storage.store[RESOURCE_ENERGY] > Memory.roomOpts[room].minEnergyInStorage) {
			console.log('should increase hits now!');
			Memory.roomOpts[room].repairUntil += Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy;
		}
	}
}






