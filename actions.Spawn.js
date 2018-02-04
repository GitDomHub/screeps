/**

	TODO:
	- Calcualte for each creep how much spawn time there is. then spawn a new creep accordingly
	- also calc way to target ticks(how long does it take to reach target?)
	- only get orders from different managers: mining, courier, upgrading, building etc
	- if invader is coming, stop all unimportant spawning and spawn defender!
	- make tickbuffer depend on time to travel to target

 */

/*----------  Globals  ----------*/
require('managers.Memory');
/*----------  Utils  ----------*/
var ProfileUtils = require('utils.Profiles');
/*----------  Actions  ----------*/
var actionsGlobal = require('actions.global');


var roleSpawn = {

	RunSpawnFactory : function (myRoom) {

		console.log('<------------ starting spawn loop for ------------------->');

		console.log('room name in spawn factory:' + myRoom);
		/*----------  Defining max bodies for all creeps  ----------*/
		let energy 						= Game.rooms[myRoom].energyCapacityAvailable;
		console.log(energy, '<------------ energy CAP available');

		let tickBuffer					= 8; // time to add to spawning

		let maxTier 					= ProfileUtils.GetMaxTier_Miner(energy);
		let minerBody					= ProfileUtils.GetBody_Miner(maxTier);
		// console.log('Maxtier for Miner ' + maxTier);
		// console.log('MaxBody for Miner ' + minerBody);
		// console.log(minerBody.length, ' body length');
		let minerSpawnTime 				= ((minerBody.length *3) + tickBuffer);
		// console.log(minerSpawnTime, ' : minerSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_BackupHarvester(energy);
		let backupHarvesterBody			= ProfileUtils.GetBody_BackupHarvester(maxTier);
		// console.log('Maxtier for BackupHarvester ' + maxTier);
		// console.log('MaxBody for BackupHarvester ' + backupHarvesterBody);
		let backupHarvesterSpawnTime 	= ((backupHarvesterBody.length *3) + tickBuffer);
		// console.log(backupHarvesterSpawnTime, ' : backupHarvesterSpawnTime');
		

		maxTier 						= ProfileUtils.GetMaxTier_Upgrader(energy);
		let upgraderBody 				= ProfileUtils.GetBody_Upgrader(maxTier);
		let upgraderSpawnTime 			= ((upgraderBody.length *3)+ tickBuffer);
		// console.log('Maxtier for Upgrader ' + maxTier);
		// console.log('MaxBody for Upgrader (Spawn t = ' + upgraderSpawnTime + ' ticks) ' + upgraderBody);

		maxTier 						= ProfileUtils.GetMaxTier_Defender(energy);
		let defenderBody 				= ProfileUtils.GetBody_Defender(maxTier);
		// console.log('Maxtier for Defender ' + maxTier);
		// console.log('MaxBody for Defender ' + defenderBody);
		let defenderSpawnTime 			= ((defenderBody.length *3) + tickBuffer);
		// console.log(defenderSpawnTime, ' : defenderSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_Courier(energy);
		let courierBody 				= ProfileUtils.GetBody_Courier(maxTier);
		// console.log('Maxtier for Courier ' + maxTier);
		// console.log('MaxBody for Courier' + courierBody);
		let courierSpawnTime 			= ((courierBody.length *3) + tickBuffer);
		// console.log(courierSpawnTime, ' : courierSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_TowerCourier(energy);
		let towerCourierBody 			= ProfileUtils.GetBody_TowerCourier(maxTier);
		// console.log('Maxtier for TowerCourier ' + maxTier);
		// console.log('MaxBody for TowerCourier' + towerCourierBody);
		let towerCourierSpawnTime 		= ((towerCourierBody.length *3) + tickBuffer);
		// console.log(towerCourierSpawnTime, ' : towerCourierSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_Harvester(energy);
		let harvesterBody 				= ProfileUtils.GetBody_Harvester(maxTier);
		// console.log('Maxtier for Harvester ' + maxTier);
		// console.log('MaxBody for Harvester' + harvesterBody);
		let harvesterSpawnTime 			= ((harvesterBody.length *3) + tickBuffer);
		// console.log(harvesterSpawnTime, ' : harvesterSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_Refiller(energy);
		let refillerBody 				= ProfileUtils.GetBody_Refiller(maxTier);
		// console.log('Maxtier for Refiller ' + maxTier);
		// console.log('MaxBody for Refiller' + refillerBody);
		let refillerSpawnTime 			= ((refillerBody.length *3) + tickBuffer);
		// console.log(refillerSpawnTime, ' : refillerSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_Builder(energy);
		let builderBody 				= ProfileUtils.GetBody_Builder(maxTier);
		// console.log('Maxtier for Builder ' + maxTier);
		// console.log('MaxBody for Builder' + builderBody);
		let builderSpawnTime 			= ((builderBody.length *3) + tickBuffer);
		// console.log(builderSpawnTime, ' : builderSpawnTime');

		maxTier 						= ProfileUtils.GetMaxTier_Repairer(energy);
		let repairerBody 				= ProfileUtils.GetBody_Repairer(maxTier);
		// console.log('Maxtier for Repairer ' + maxTier);
		// console.log('MaxBody for Repairer' + repairerBody);
		let repairerSpawnTime 			= ((repairerBody.length *3) + tickBuffer);
		// console.log(repairerSpawnTime, ' : repairerSpawnTime');
		

		

		let storageInRoom				= Game.rooms[myRoom].storage;
		// let hasStorage = Object.values(Memory.rooms[myRoom].energySources).indexOf('storage');
		// console.log(storageInRoom, '<------------ has storage ??')
        
        // if we have storage, make harvester into refiller
		if(storageInRoom) 
			harvesterBody = refillerBody; 
		 
		// have always 1 or two backup harvesters so the colony doesnt die
		// load all creeps in to vars so we can work with them
		var backupHarvesters                = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > backupHarvesterSpawnTime && creep.memory.role == 'backupHarvester' );
		var harvesters                      = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > harvesterSpawnTime && creep.memory.role == 'harvester' );
		var couriers                        = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > courierSpawnTime && creep.memory.role == 'courier' );
		var towerCouriers                   = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > towerCourierSpawnTime && creep.memory.role == 'towerCourier' );
		var miners                          = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > minerSpawnTime && creep.memory.role == 'miner' );
		var repairers                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > repairerSpawnTime && creep.memory.role == 'repairer' );
		var upgraders                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > upgraderSpawnTime && creep.memory.role == 'upgrader' );
		var builders                        = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > builderSpawnTime && creep.memory.role == 'builder' );
		var defenders                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > defenderSpawnTime && creep.memory.role == 'defender' );
		var allCreepsInRoom                 = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom);
		// console.log('allcreepsinroom: ' + allCreepsInRoom);
		
		// check for things in room
		var amountDamgedStruc 				= 0;
		if (Memory.rooms[myRoom].damagedStructures){
			amountDamgedStruc = Object.keys(Memory.rooms[myRoom].damagedStructures).length;
		}
		// console.log('all damaged struc in room[' + myRoom + '] : ' + amountDamgedStruc);
		var baustellen 						= Game.rooms[myRoom].find(FIND_CONSTRUCTION_SITES); 
		console.log('baustellen in room: [' + myRoom + '] : ' +  baustellen.length);

		var amountHostiles                 	= Game.rooms[myRoom].find(FIND_HOSTILE_CREEPS).length;

		let amountSourcesInRoom 			= actionsGlobal.ReturnEnergySourceIDs(myRoom, 'source'); 
		console.log(amountSourcesInRoom.length, ' <----------------- found this many sources in room');
		
		// 2Do: instead of making min values static, calculate them depending on room situation
		// MINERS: (2E/T per WORK. At 10E/T energy source get minded alright. Means we need at least 5 WORK parts.
		// 			in early game get as many creep until WORK parts >= 5) plus 1 work part to repair container? later.)
		// COURIERS: (getting 10E/T from source, plus calc how many ticks it takes me to get from SPAWN to SOURCE)
		// UPGRADERS: maybe set different upgrade goals. One WORK upgrades 1E/T. 
		// BUILDERS: ?
		// DEFENDERS: check how many attack/heal parts the hostiles have. Make creeps that are like 1.3 as big(having the towers also)
		 
		 
		//2DO define mininum of creeps in vars
		var minBackupHarvesters             = 2;
		var minHarvesters                   = 1;    // delivering energy
		var minCouriers                     = amountSourcesInRoom.length;    // 2Do: only make couriers, when miners are there or containers are half full
		var minTowerCouriers                = 1;    
		var minMiners                       = amountSourcesInRoom.length;    // 2Do: make enough miners as containers we have
		var minRepairers                    = 0;    // cheaper than tower repairing things
		var minUpgraders                    = 3;    // only spawn new ones if overall energy amount is over certain number
		var minBuilders                     = 2;    // only make builders when construction sites in room. Make more builders when there are more than  
		var minDefenders                    = 0;    // Only spawn rest if hostile in room.
		                                         // Just produce a new one to be ready when old one dies
		
		if (storageInRoom && storageInRoom.store[RESOURCE_ENERGY] < Memory.roomOpts[myRoom].minEnergyInStorage) {
			minUpgraders 					= 1; // reduce upgraders so we have enough energy to defend in case of emergency
		}     

		let roomLevel 						= Game.rooms[myRoom].controller.level;
		let minHostilesToSpawnDefender		= 2;
		if(roomLevel < 4)
			minHostilesToSpawnDefender 		= 1;



		/*----------  React to when there is an attack  ----------*/
		
		if (amountHostiles >= minHostilesToSpawnDefender) { // 2Do: make this only for this current room!
		 console.log('ATTACK MODE LIVE');
		 var minBackupHarvesters         = 2;    
		 var minHarvesters               = 1;    // +1 for urgent delivery of energy to towers, spawn, extensions 
		 // var minCouriers                 = 2;    
		 var minTowerCouriers            = 2;    // Tower couriers will block the way. Just need to prioritize towers
		 // var minMiners                   = 2;    
		 var minRepairers                = 0;    
		 var minUpgraders                = 1;    // -2
		 var minBuilders                 = 0;    
		 var minDefenders                = 2;   // +8  // always spawn as many attack body parts as needed for conquering
		}

		/*----------  Console logging  ----------*/
		
		console.log('##################################');
		console.log('BackupHarvesters: '    + backupHarvesters.length + '/' + minBackupHarvesters);
		console.log('Harvesters: '          + harvesters.length + '/' + minHarvesters);
		console.log('Couriers: '            + couriers.length + '/' + minCouriers);
		console.log('TowerCouriers: '       + towerCouriers.length + '/' + minTowerCouriers);
		console.log('Miners: '              + miners.length + '/' + minMiners);
		console.log('Repairers: '           + repairers.length + '/' + minRepairers);
		console.log('Upgraders: '           + upgraders.length + '/' + minUpgraders);
		console.log('Builders: '            + builders.length + '/' + minBuilders);
		console.log('Defenders: '           + defenders.length + '/' + minDefenders);
		console.log('##################################');


		// 2DO: healers?

		// define all wanted and needed emojis:

		


		// spawn backup BACKUPHARVESTER 
		// spawn only if nothing goes
		if(harvesters.length == 0 && miners.length == 0 || 
			harvesters.length == 0 && couriers.length == 0 || 
			harvesters.length == 0 && allCreepsInRoom.length <= 2 ) {
			if(backupHarvesters.length < minBackupHarvesters) {
			var newName = 'BackupHarvester' + Game.time + myRoom;
			// console.log('Spawning new BackupHarvester: ' + newName);
			let result = Game.spawns['Spawn1'].spawnCreep(backupHarvesterBody, newName,  
			 	{memory: {role: 'backupHarvester', homeRoom: myRoom}});
			console.log('spawn result backup harvester: ' + result);
			}
		}

		// spawn DEFENDERS 
		// tower couriers help heal me so tehy are important
		if(defenders.length < minDefenders && towerCouriers.length < minTowerCouriers) {
		    var newName = 'Defender' + Game.time + myRoom;
		    let result = Game.spawns['Spawn1'].spawnCreep(defenderBody, newName, 
		        {memory: {role: 'defender', homeRoom: myRoom}});
		    console.log('spawn result defender: ' + result);
		}

		 
		// spawn normal HARVESTERS 
		if(harvesters.length < minHarvesters) {
		var newName = 'Harvester' + Game.time + myRoom;
		let result = Game.spawns['Spawn1'].spawnCreep(harvesterBody, newName, 
	    	{memory: {role: 'harvester', homeRoom: myRoom}});
		console.log('spawn result harvester: ' + result);
		}
		 
		 // spawn COURIERS 
		if(couriers.length < minCouriers  && (miners.length >= minMiners)) {
		    var newName = 'Courier' + Game.time + myRoom;
		    let result = Game.spawns['Spawn1'].spawnCreep(courierBody, newName, 
		        {memory: {role: 'courier', homeRoom: myRoom}});
		    console.log('spawn result courier: ' + result);
		}
		 
		// spawn MINERS 
		// only if harvesters are there already - otherwise we don't have anyone delivering energy to spawn & extensions
		if(miners.length < minMiners && (harvesters.length >= minHarvesters)) {
			var newName = 'Miner' + Game.time + myRoom;
			let result = Game.spawns['Spawn1'].spawnCreep(minerBody, newName, 
			    {memory: {role: 'miner', homeRoom: myRoom}});
			console.log('spawn result miner: ' + result);
		}
		

		// spawn TOWERCOURIER 
		if(towerCouriers.length < minTowerCouriers  && miners.length >= minMiners && harvesters.length >= minHarvesters && Object.keys(Memory.rooms[myRoom].damagedStructures).length > 15) {
		    var newName = 'TowerCourier' + Game.time + myRoom;
		    let result = Game.spawns['Spawn1'].spawnCreep(towerCourierBody, newName, 
		        {memory: {role: 'towerCourier', homeRoom: myRoom}});
		    console.log('spawn result tower courier: ' + result);
		}
		 
		//spawn REPAIRERS 
		if(repairers.length < minRepairers) {
		    var newName = 'Repairer' + Game.time + myRoom;
		    /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, //9
		         {memory: {role: 'repairer'}});*/		         
		    Game.spawns['Spawn1'].spawnCreep(repairerBody, newName, 
		        {memory: {role: 'repairer', homeRoom: myRoom}});    
		}
		 
		 //2Do: spawn backup upgrader to avoid being downgraded
		 
		 
		// spawn UPGRADERS 
		// but spawn only when enough harvesters are there. Keeps the colony from dying
		if(upgraders.length < minUpgraders && harvesters.length >= minHarvesters && miners.length >= minMiners && couriers.length >= minCouriers ) {
		    var newName = 'Upgrader' + Game.time + myRoom;
		     /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], newName, // cost 1100E; MOVE*6,WORK*5,CARRY*6; 1.700K health; carry 300
		         {memory: {role: 'upgrader'}});*/
		    let result = Game.spawns['Spawn1'].spawnCreep(upgraderBody, newName, 
		        {memory: {role: 'upgrader', homeRoom: myRoom}});
	        console.log('spawn result upgrader: ' + result);      
		 }
		 
		// spawn BUILDERS 
		// 2Do! only build new builders when currently construction sites unfinished!
		// 2Do! build another mini builder for when there is low energy		
		if(builders.length < minBuilders && (baustellen.length > 0) && harvesters.length >= minHarvesters && miners.length >= minMiners && couriers.length >= minCouriers) {
		    var newName = 'Builder' + Game.time + myRoom;
		    let result = Game.spawns['Spawn1'].spawnCreep(builderBody, newName, // cost 1050E; MOVE*6,WORK*3,CARRY*9 ; 1800 health carry 450
		        {memory: {role: 'builder', homeRoom: myRoom}});
		    console.log('spawn result builder: ' + result);
		}
		 
		



		roleSpawn.showWhatsSpawning();
		 
		 
	},

	showWhatsSpawning : function () {
		// 2Do: for each room, then for each spawn, show what ur spawning
		let spawn = Game.spawns['Spawn1'];
		// visuals for showing what is being spawned
		if(spawn.spawning) {		 	 
		 	let remainingTime = spawn.spawning.remainingTime;
		    var spawningCreep = Game.creeps[spawn.spawning.name];
		    spawn.room.visual.text(
		        '' + spawningCreep.memory.role + ' (-' + remainingTime + ')',
		        Game.spawns['Spawn1'].pos.x + 1,
		        Game.spawns['Spawn1'].pos.y,
		        {align: 'left', opacity: 0.9});
		}
	}

	
};

module.exports = roleSpawn;