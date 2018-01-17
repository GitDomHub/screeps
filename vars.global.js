/*define variables on a global scale for every function in screeps available*/



global.repairUntilHitsEqual  			= 750000; // maybe put this into memory?  


// define vars for this room
global.room1                            = 'E83S21';
global.roomHasHostiles                  = Game.rooms[global.room1].find(FIND_HOSTILE_CREEPS).length;

//struc status
global.damagedStrucInRoom1             	= Game.rooms[global.room1].find(FIND_STRUCTURES,
		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
		                                             s.hits < global.repairUntilHitsEqual}); // 2Do: calculate the whole amount of missing hits until we reach our goal.



// store vars in memory, so we can change them manually over console 
if (!Memory.room1) 
	Memory.room1 						= {};

if (!Memory.room1.name) 	
    Memory.room1.name 					= 'E83S21';

if (!Memory.room1.repairUntil) 
	Memory.room1.repairUntil 			= 750000;



// var roomArray = [];
// for (singleRoom in Game.rooms) {
//     roomArray.push(singleRoom);
// }

// Memory.rooms = Object.keys(Game.rooms);

// write all rooms into memory
var roomObject = {};
for (let room in Game.rooms) {
	roomObject[room] = {};
};
Memory.rooms = roomObject;


for (let room in Memory.rooms) {
	// find all STRUCTURES that need REPAIR and put them into the rooms memory
	let damagedStruc 				= Game.rooms[room].find(FIND_STRUCTURES,
 		                            {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
 		                                            s.hits < Memory.room1.repairUntil});
	let strucs = {};
	for (let struc of damagedStruc) {
		strucs[struc.id] = struc.hits;	
	}
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
	let droppedEnergyRes 			= Game.rooms[room].find(FIND_DROPPED_RESOURCES, 
									{filter: (s) => s.amount > 100 && 
													s.resourceType === RESOURCE_ENERGY });
	for (let drop of droppedEnergyRes) {		
		energySources[drop.id] = 'dropped_energy';
	}
	// ENERGY SOURCES
	var sources 					= Game.rooms[room].find(FIND_SOURCES);
	for (let source of sources) {		
		energySources[source.id] = 'source';
	}
	Memory.rooms[room].energySources = energySources;
}




// testing storing paths
let sto 							= Game.getObjectById('5a51fe37060f9f3135cb7bab');
let source1 						= Game.getObjectById('5873be2911e3e4361b4da571'); 
let source2 						= Game.getObjectById('5873be2911e3e4361b4da572'); 

let testpath 						= PathFinder.search(source1, sto);

Memory.testpath 					= testpath;



//



//Memory.damagedStructuresR1 = [];
Memory.damagedStructuresR1 				= Game.rooms[global.room1].find(FIND_STRUCTURES,
 		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
 		                                             s.hits < Memory.room1.repairUntil});

var damagedStruc 				= Game.rooms[global.room1].find(FIND_STRUCTURES,
 		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
 		                                             s.hits < Memory.room1.repairUntil});

var damagedStructures = {};
for (let struc of damagedStruc) {
	damagedStructures[struc.id] = struc.hits;	
}
// Memory.test = damagedStructures;

// _.sortBy(test, function(s) {return s.hits});





