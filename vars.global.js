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

Memory.rooms = Object.keys(Game.rooms);

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
 		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
 		                                             s.hits < Memory.room1.repairUntil});

 var damage 				= Game.rooms[global.room1].find(FIND_STRUCTURES,
 		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
 		                                             s.hits < Memory.room1.repairUntil}); 
console.log(damage);
 // var testvar = _.map(damage, 'id');
 var testvar = _(damage).map(s => {id:s.id,hits:s.hits};
console.log(testvar);

// for (s of Memory.damagedStructuresR1) {
// 	console.log(s.id);
// }




