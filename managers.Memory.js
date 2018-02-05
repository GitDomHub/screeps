/**

	TODO:
	- Write only every so often into memory and put a timestamp there
	- write damaged structures more often when hostiles are in room so we can repair those hurt structures
	- not include containers that are close to source since they get repaired by miners
	- make tower and/or repairer check not only for energy in storage, but also in early game at dropoff site
	- only do this for rooms where I have a controller / spawn
	

 */



// Initiating room options
var InitMemRoomOpts = (function () {
	// only do this if object doesnt exists already
	// if (!Memory.roomOpts)
	// 	Memory.roomOpts = {};	

	// // write all rooms into that part of  memory
	// let roomNames = {};
	// for (let room in ) {
		
	// };

	// // check if standard values for each room exist
	// for (let room in Game.rooms) {
	// 	if(!Game.rooms[room].contoller) // ignore rooms I don't own
	// 		continue
	// 	if(!Memory.roomOpts[room])
	// 		Memory.roomOpts[room] = {};
	// 	if(_.size(Memory.roomOpts[room]) == 0) {
	// 			Memory.roomOpts[room].repairUntil = 1000;
	// 			Memory.roomOpts[room].repairUntilPercentage = 0.5;
	// 			Memory.roomOpts[room].minEnergyInStorage = 1000; // if more energy, then we will increase hits of structures
	// 			Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy = 1000;	
	// 	}
	// 	// if(!Memory.roomOpts[room].repairUntil)
	// 	// 	Memory.roomOpts[room].repairUntil = 1000;
	// 	// if(!Memory.roomOpts[room].repairUntilPercentage)
	// 	// 	Memory.roomOpts[room].repairUntilPercentage = 0.5;
	// 	// if(!Memory.roomOpts[room].minEnergyInStorage)
	// 	// 	Memory.roomOpts[room].minEnergyInStorage = 1000; // if more energy, then we will increase hits of structures
	// 	// if(!Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy)
	// 	// 	Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy = 1000;
	// }	
}());







var MemoryManager = {

	InitRooms : function () {
		if (!Memory.rooms)
			Memory.rooms = {};			
	},

	InitRoomOpts : function() {
		// only do this if object doesnt exists already
		if (!Memory.roomOpts)
			Memory.roomOpts = {};	

		// check if standard values for each room exist
		for (let room in Game.rooms) {
			if(!Game.rooms[room].contoller) // ignore rooms I don't own
				continue;
			if(!Memory.roomOpts[room])
				Memory.roomOpts[room] = {};
			if(_.size(Memory.roomOpts[room]) == 0) {
					Memory.roomOpts[room].repairUntil = 1000;
					Memory.roomOpts[room].repairUntilPercentage = 0.5;
					Memory.roomOpts[room].minEnergyInStorage = 1000; // if more energy, then we will increase hits of structures
					Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy = 1000;	
			}
		}	
	},

	write : function() {
		MemoryManager.InitRooms(); 
		MemoryManager.InitRoomOpts();

		/*----------  CHECK ONLY EVERY XX TICKS  ----------*/
		if (Memory.roomsTimeStamp === undefined || (Memory.roomsTimeStamp + 50) < Game.time) {
			Memory.roomsTimeStamp = Game.time;
			
			/*----------  ROOM NAME INTO MEM  ----------*/

			var roomNames = {};
			for (let room in Game.rooms) {
				roomNames[room] = {};
			};
			Memory.rooms = roomNames;


			for (let room in Memory.rooms) {


				/*----------  DAMAGED STRUCTURES NEEDING REPAIR  ----------*/


				// every ticks when no enemy is there
				// when enemy is there every 5 ticks
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


				/*----------  CONTAINERS & STORAGES & links  ----------*/
				
				// every 50 ticks
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


				/*----------  ENERGY SOURCES  ----------*/
				// every 1500 ticks or even only once!
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


				/*----------  DROPPED ENERGY NEAR TO SOURCE  ----------*/

				// every 5 ticks
				let droppedEnergyRes 				= Game.rooms[room].find(FIND_DROPPED_RESOURCES, 
													{filter: (s) => s.amount > 100 && 
																	s.resourceType === RESOURCE_ENERGY });
				for (let drop of droppedEnergyRes) {	
					// only log drops from close to sources/containers/spawn
					let isCloseToSource = false;
					// console.log(drop.pos, ' <---------------- drop.pos');
					for (let source of sources){
						if(source.pos.inRangeTo(drop, 2)){
			     			isCloseToSource = true;
			     		} 
					}	
					if(isCloseToSource) {
						energySources[drop.id] = 'dropped_energy';
					}	
				}

				/*----------  DROP OFF POINT  ----------*/
				var dropOffObj 						= GetEnergyDropOff(room);
				// console.log('helloooooooooooooo');
				// console.log(dropOffObj[0].amount);
				if (dropOffObj[0])
					energySources[dropOffObj[0].id] = 'dropOff';


				Memory.rooms[room].energySources = energySources;



				/*----------  DROP OFF POSITION only  ----------*/
				
				//DROP OFF POINTS FOR EARLY GAME
				let dropOffPoints = {};
				// make a dropoff for each a spawn (and a controller later)
				let spawnObj = Game.rooms[room].find(FIND_MY_SPAWNS);
				// for(let singleSpawn of spawnObj) {
				let dropOffPos = new RoomPosition((spawnObj[0].pos.x), (spawnObj[0].pos.y+1), room);

				let possibleConstructionSite    = Game.rooms[room].lookForAt(LOOK_CONSTRUCTION_SITES, dropOffPos);
                console.log(possibleConstructionSite, ' construction site?');
                if (possibleConstructionSite){
                    dropOffPos = new RoomPosition((spawnObj[0].pos.x), (spawnObj[0].pos.y+2), room);
                    console.log(dropOffPos, ' dropoffPos new');
                }

				// console.log(dropOffPos, ' <-------------------- roompos for dropoff');
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
				// console.log('anzahl an damages struc in room ' + room + ' : ' + Object.keys(Memory.rooms[room].damagedStructures).length);

				// increase max hits for everything when we have enough energy
				if(storage && Object.keys(Memory.rooms[room].damagedStructures).length == 0) {
					// console.log('store energy is: ' + storage.store[RESOURCE_ENERGY] + ' and min energy is: ' + Memory.roomOpts[room].minEnergyInStorage);
					if (storage.store[RESOURCE_ENERGY] > Memory.roomOpts[room].minEnergyInStorage) {
						// console.log('should increase hits now!');
						Memory.roomOpts[room].repairUntil += Memory.roomOpts[room].aboveMinEnergyIncreaseHitsBy;
					}
				}
			}
		}
	},

	ClearDeadCreeps : function() {
		for(var name in Memory.creeps) {
	        if(!Game.creeps[name]) {
	            delete Memory.creeps[name];
	        }
	    }
	},

	/**
	 *
	 * Returning structure IDs of energy sources
	 * (param) : roomName (e.g. E11S22)
	 * (param) : structure_name (either: source/link/storage/container)
	 *
	 */
	
	ReturnEnergySourceIDs : function (roomName, structure_name) {
		if(!structure_name || !roomName) 
			return;
		let allSources = Memory.rooms[roomName].energySources;
        return _.filter(_.keys(allSources), value => allSources[value] === structure_name);        
	}
};


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

/**
 *
 * Returns a position for getting dropped off energy if its close to spawn
 *
 */

var GetEnergyDropOff = function(room) {

	let spawns                          = Game.rooms[room].find(FIND_MY_SPAWNS);
    // console.log(spawns, '<<------<<<<<<-<-<-<-<-<-<-<-<-<-<- spawns');
    if(spawns.length > 0){
        let dropOffPos                  = new RoomPosition(spawns[0].pos.x, (spawns[0].pos.y + 1),  room);
        let possibleConstructionSite 	= Game.rooms[room].lookForAt(LOOK_CONSTRUCTION_SITES, dropOffPos);
        if (possibleConstructionSite){
        	dropoffPos = new RoomPosition(spawns[0].pos.x, (spawns[0].pos.y + 2),  room);
        }
        // console.log(dropOffPos, '<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<- dropOffPos');
        let foundEnergyObj                 = Game.rooms[room].lookForAt(LOOK_ENERGY, dropOffPos);
        // console.log(foundEnergyObj, '<------<-<-<--<<--< energy!');
        // console.log(foundEnergyObj[0].amount, '<------<-<-<--<<--< amount!');
        if (foundEnergyObj) {
        	return foundEnergyObj;	
        } else {
        	return false;
        }   
    }
};


module.exports = MemoryManager;




