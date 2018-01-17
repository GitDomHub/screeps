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

// find all strcutures that need construction and put them into the rooms memory
for (let room in Memory.rooms) {
	let damagedStruc 				= Game.rooms[room].find(FIND_STRUCTURES,
 		                                         {filter: (s) => s.hits < (s.hitsMax * 0.5) && 
 		                                             s.hits < Memory.room1.repairUntil});
	let strucs = {};
	for (let struc of damagedStruc) {
		strucs[struc.id] = struc.hits;	
	}
	Memory.rooms[room].damagedStructures = strucs;

	let containers 					= Game.rooms[room].find(FIND_STRUCTURES, 
										{filter: (s) => s.structureType == STRUCTURE_CONTAINER});
	console.log('containers: ' + containers);

	let containersObj = {};
	let i = 0;
	for (let struc of containers) {		
		containersObj[i] = struc.id;	
		i++;
	}
	Memory.rooms[room].containers = containersObj;

}



// // put all construction sites that need repair into Memory
// for (let room of Memory.rooms) {
// 	let damaged 						= Game.rooms[room].find(FIND_STRUCTURES,
// 	                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
// 	                                             s.hits < Memory.room1.repairUntil});
// 	console.log(damaged);
// 	Memory.rooms[room].damagedStructures= damaged;
// } 




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
Memory.test = damagedStructures;

// _.sortBy(test, function(s) {return s.hits});





