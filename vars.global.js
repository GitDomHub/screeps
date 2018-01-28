/*define variables on a global scale for every function in screeps available*/



// global.repairUntilHitsEqual  			= 750000; // maybe put this into memory?  


// define vars for this room
// global.room1                            = 'E83S21';
// global.roomHasHostiles                  = Game.rooms[global.room1].find(FIND_HOSTILE_CREEPS).length;

//struc status
// global.damagedStrucInRoom1             	= Game.rooms[global.room1].find(FIND_STRUCTURES,
// 		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
// 		                                             s.hits < global.repairUntilHitsEqual}); // 2Do: calculate the whole amount of missing hits until we reach our goal.


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
			Memory.roomOpts[room].repairUntil = 5000;
		if(!Memory.roomOpts[room].repairUntilPercentage)
			Memory.roomOpts[room].repairUntilPercentage = 0.5;
		if(!Memory.roomOpts[room].minEnergyInStorage)
			Memory.roomOpts[room].minEnergyInStorage = 1000; // if more energy, then we will increase hits of structures
		if(!Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy)
			Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy = 1000;
		// 2Do: maybe put minimum of creeps in here too?
	}	
}());


//InitMemRoomOpts();


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
	console.log(Object.values(damagedStruc));

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
	// DROPPED ENERGY
	let droppedEnergyRes 				= Game.rooms[room].find(FIND_DROPPED_RESOURCES, 
										{filter: (s) => s.amount > 100 && 
														s.resourceType === RESOURCE_ENERGY });
	for (let drop of droppedEnergyRes) {		
		energySources[drop.id] = 'dropped_energy';
	}
	// ENERGY SOURCES
	var sources 						= Game.rooms[room].find(FIND_SOURCES);
	for (let source of sources) {		
		// if source has a keeper close by the for now dont put it in memory
     	var keeperLairObj 				= Game.rooms[room].find(FIND_STRUCTURES, {
			   filter: { structureType: STRUCTURE_KEEPER_LAIR }
			});;
     	console.log(keeperLairObj, ' <------- keeper lair objects in room');
        // find all keeper lairs
		energySources[source.id] = 'source';
	}
	Memory.rooms[room].energySources = energySources;



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





delete Memory.damagedStructuresR1;
delete Memory.pathToStorage;
delete Memory.pathToController;
delete Memory.room1;


//



//Memory.damagedStructuresR1 = [];
// Memory.damagedStructuresR1 				= Game.rooms[global.room1].find(FIND_STRUCTURES,
//  		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
//  		                                             s.hits < Memory.room1.repairUntil});

// var damagedStruc 				= Game.rooms[global.room1].find(FIND_STRUCTURES,
//  		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
//  		                                             s.hits < Memory.room1.repairUntil});

// var damagedStructures = {};
// for (let struc of damagedStruc) {
// 	damagedStructures[struc.id] = struc.hits;	
// }
// Memory.test = damagedStructures;

// _.sortBy(test, function(s) {return s.hits});





