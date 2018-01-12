/*define variables on a global scale for every function in screeps available*/



global.repairUntilHitsEqual  			= 750000; // maybe put this into memory?  


// define vars for this room
global.room1                            = 'E83S21';
global.roomHasHostiles                  = Game.rooms[global.room1].find(FIND_HOSTILE_CREEPS);

//struc status
global.damagedStrucInRoom1             	= Game.rooms[global.room1].find(FIND_STRUCTURES,
		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
		                                             s.hits < global.repairUntilHitsEqual}); // 2Do: calculate the whole amount of missing hits until we reach our goal.

global.currEnergyAvailable 				= Game.rooms[room1].energyAvailable;
global.currEnergyCapAvailable 			= Game.rooms[room1].energyCapacityAvailable;



// store vars in memory, so we can manuall over console change them

Memory.room1.repairUntilHitsEqual 		= global.repairUntilHitsEqual;









// test to make sub-vars
global.room1.repairUntilHitsEqual  		= 650000; // maybe put this into memory?  
global.room1.hasHostiles 				= Game.rooms[global.room1].find(FIND_HOSTILE_CREEPS); // test
global.room1.damagedStructures 			= Game.rooms[global.room1].find(FIND_STRUCTURES,
		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
		                                             s.hits < global.repairUntilHitsEqual}); // 2Do: calculate the whole amount of missing hits until we reach our goal.
global.room1.currEnergyAvailable 		= Game.rooms[room1].energyAvailable;
global.room1.currEnergyCapAvailable 	= Game.rooms[room1].energyCapacityAvailable;