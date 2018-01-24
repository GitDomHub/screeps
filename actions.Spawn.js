/**

	TODO:
	- Calcualte for each creep how much spawn time there is. then spawn a new creep accordingly
	- also calc way to target ticks

 */

/*----------  Globals  ----------*/
require('vars.global');
/*----------  Utils  ----------*/
var ProfileUtils = require('utils.Profiles');

var roleSpawn = {

	RunSpawnFactory : function (myRoom) {

		// console.log('room name in spawn factory:' + myRoom);
		/*----------  Defining max bodies for all creeps  ----------*/
		let energy 						= Game.rooms[myRoom].energyAvailable

		let maxTier 					= ProfileUtils.GetMaxTier_Miner(energy);
		let minerBody					= ProfileUtils.GetBody_Miner(maxTier);
		console.log('Maxtier for Miner ' + maxTier);
		console.log('MaxBody for Miner ' + minerBody);

		maxTier 						= ProfileUtils.GetMaxTier_BackupHarvester(energy);
		let backupHarvesterBody			= ProfileUtils.GetBody_BackupHarvester(maxTier);
		console.log('Maxtier for BackupHarvester ' + maxTier);
		console.log('MaxBody for BackupHarvester ' + backupHarvesterBody);

		maxTier 						= ProfileUtils.GetMaxTier_Upgrader(energy);
		let upgraderBody 				= ProfileUtils.GetBody_Upgrader(maxTier);
		let upgraderSpawnTime 			= (upgraderBody.length *3);
		console.log('Maxtier for Upgrader ' + maxTier);
		console.log('MaxBody for Upgrader (Spawn t = ' + upgraderSpawnTime + ' ticks) ' + upgraderBody);

		maxTier 						= ProfileUtils.GetMaxTier_Defender(energy);
		let defenderBody 				= ProfileUtils.GetBody_Defender(maxTier);
		console.log('Maxtier for Defender ' + maxTier);
		console.log('MaxBody for Defender ' + defenderBody);

		maxTier 						= ProfileUtils.GetMaxTier_Courier(energy);
		let courierBody 				= ProfileUtils.GetBody_Courier(maxTier);
		console.log('Maxtier for Courier ' + maxTier);
		console.log('MaxBody for Courier' + courierBody);
		 
		// have always 1 or two backup harvesters so the colony doesnt die
		// load all creeps in to vars so we can work with them
		var backupHarvesters                = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'backupHarvester' );
		var harvesters                      = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'harvester' );
		var couriers                        = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'courier' );
		var towerCouriers                   = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'towerCourier' );
		var miners                          = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'miner' );
		var repairers                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'repairer' );
		var upgraders                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 80 && creep.memory.role == 'upgrader' );
		var builders                        = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'builder' );
		var defenders                       = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == myRoom && creep.ticksToLive > 60 && creep.memory.role == 'defender' );
		var allCreepsInRoom                 = Game.rooms[myRoom].find(FIND_CREEPS);
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
		 
		//2DO define mininum of creeps in vars
		var minBackupHarvesters             = 2;
		var minHarvesters                   = 1;    // delivering energy
		var minCouriers                     = 2;    // 2Do: only make couriers, when miners are there or containers are half full
		var minTowerCouriers                = 1;    // 2Do: replace maybe with normal couriers. just tell couriers to prioritize towers under certain circs
		var minMiners                       = 2;    // 2Do: make enough miners as containers we have
		var minRepairers                    = 0;    // cheaper than tower repairing things
		var minUpgraders                    = 2;    // only spawn more/bigger Upgraders than harvesters enough; only spawn new ones if overall energy amount is over certain number
		var minBuilders                     = 2;    // only make builders when construction sites in room. Make more builders when there are more than  
		var minDefenders                    = 0;    // Only spawn rest if hostile in room.
		                                         // Just produce a new one to be ready when old one dies
		let storageInRoom					= Game.rooms[myRoom].storage;
		if (storageInRoom && storageInRoom.store[RESOURCE_ENERGY] < Memory.roomOpts[myRoom].minEnergyInStorage) {
			minUpgraders 					= 1; // reduce upgraders so we have enough energy to defend in case of emergency
		}     



		/*----------  React to when there is an attack  ----------*/
		
		if (amountHostiles > 1) { // 2Do: make this only for this current room!
		 console.log('ATTACK MODE LIVE');
		 var minBackupHarvesters         = 2;    
		 var minHarvesters               = 1;    // +1 for urgent delivery of energy to towers, spawn, extensions 
		 var minCouriers                 = 2;    
		 var minTowerCouriers            = 2;    // Tower couriers will block the way. Just need to prioritize towers
		 var minMiners                   = 2;    
		 var minRepairers                = 0;    
		 var minUpgraders                = 1;    // -2
		 var minBuilders                 = 0;    
		 var minDefenders                = 1;   // +8  // 2DO: always spawn defenders first before anything else
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
			Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,WORK,CARRY,CARRY], newName,  // cost 300E; MOVE*2,WORK*1,CARRY*2; 
			 	{memory: {role: 'backupHarvester', homeRoom: myRoom}});
			}
		}

		// spawn DEFENDERS 
		if(defenders.length < minDefenders ) {
		    var newName = 'Defender' + Game.time + myRoom;
		    Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], newName, // cost 2.130E; TOUGH*3,MOVE*18,ATTACK*15; 3.600K health; attack	450.000/T	315.000K/1500T	756.000K/H	18.144M/D
		        {memory: {role: 'defender', homeRoom: myRoom}});
		}

		 
		// spawn normal HARVESTERS 
		// if(harvesters.length < minHarvesters) {
		//     var newName = 'Harvester' + Game.time;
		//     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY], newName, // cost 550E; MOVE*3,WORK*2,CARRY*4; 900K health; carry 200(4 extensions)
		//         {memory: {role: 'harvester'}});
		// }
		// spawn normal HARVESTERS 
		if(harvesters.length < minHarvesters) {
		var newName = 'Harvester' + Game.time + myRoom;
		Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, // cost 450E; MOVE*3,CARRY*6; 900K health; carry 300(6 extensions)
	    	{memory: {role: 'harvester', homeRoom: myRoom}});
		}
		 
		 // spawn COURIERS 
		if(couriers.length < minCouriers  && (miners.length >= minMiners)) {
		    var newName = 'Courier' + Game.time + myRoom;
		    Game.spawns['Spawn1'].spawnCreep(courierBody, newName, // cost 600E;carry400
		        {memory: {role: 'courier', homeRoom: myRoom}});
		}
		 
		// spawn MINERS 
		// only if harvesters are there already - otherwise we don't have anyone delivering energy to spawn & extensions
		// 2Do, create mini and MAX miner
		// 2DO: only create as many miners as containers are near to source
		if(miners.length < minMiners && (harvesters.length >= minHarvesters)) {
			var newName = 'Miner' + Game.time + myRoom;
			Game.spawns['Spawn1'].spawnCreep(minerBody, newName, //MOVE*3,WORK*6,Carry*1 
			    {memory: {role: 'miner', homeRoom: myRoom}});
		}
		

		// spawn TOWERCOURIER 
		if(towerCouriers.length < minTowerCouriers  && miners.length >= minMiners && harvesters.length >= minHarvesters && Object.keys(Memory.rooms[myRoom].damagedStructures).length > 15) {
		    var newName = 'TowerCourier' + Game.time + myRoom;
		    Game.spawns['Spawn1'].spawnCreep([MOVE,WORK,CARRY], newName, // cost 550E; MOVE*3,WORK*2,CARRY*4; 900K health; carry 200
		        {memory: {role: 'towerCourier', homeRoom: myRoom}});
		}
		 
		//spawn REPAIRERS 
		if(repairers.length < minRepairers) {
		    var newName = 'Repairer' + Game.time + myRoom;
		    /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, //9
		         {memory: {role: 'repairer'}});*/
		         
		    Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], newName, //9
		        {memory: {role: 'repairer', homeRoom: myRoom}});    
		}
		 
		 //2Do: spawn backup upgrader to avoid being downgraded
		 
		 
		// spawn UPGRADERS 
		// but spawn only when enough harvesters are there. Keeps the colony from dying
		if(upgraders.length < minUpgraders && harvesters.length >= minHarvesters && miners.length >= minMiners ) {
		    var newName = 'Upgrader' + Game.time + myRoom;
		     /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], newName, // cost 1100E; MOVE*6,WORK*5,CARRY*6; 1.700K health; carry 300
		         {memory: {role: 'upgrader'}});*/
		    Game.spawns['Spawn1'].spawnCreep(upgraderBody, newName, // cost 1100E; MOVE*6,WORK*5,CARRY*6; 1.700K health; carry 300
		        {memory: {role: 'upgrader', homeRoom: myRoom}})      
		 }
		 
		// spawn BUILDERS 
		// 2Do! only build new builders when currently construction sites unfinished!
		// 2Do! build another mini builder for when there is low energy		
		if(builders.length < minBuilders && (baustellen.length > 0) && harvesters.length >= minHarvesters && miners.length >= minMiners && couriers.length >= minCouriers) {
		    var newName = 'Builder' + Game.time + myRoom;
		    Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], newName, // cost 1050E; MOVE*6,WORK*3,CARRY*9 ; 1800 health carry 450
		        {memory: {role: 'builder', homeRoom: myRoom}});
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