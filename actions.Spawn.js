module.exports = {

	runSpawnFactory : function () {
		 var repairUntilHitsEqual  = 500000; // maybe put this into memory?  
		 // define vars for this room
		 var room1                           = 'E83S21';
		 var roomHasHostiles                 = Game.rooms[room1].find(FIND_HOSTILE_CREEPS);


		 //struc status
		 var damagedStrucInRoom1             = Game.rooms['E83S21'].find(FIND_STRUCTURES,
		                                         {filter: (s) => s.hits < s.hitsMax * 0.5 && 
		                                             s.hits < repairUntilHitsEqual}); // 2Do: calculate the whole amount of missing hits until we reach our goal.
		 

		 
		 // have always 1 or two backup harvesters so the colony doesnt die
		 // load all creeps in to vars so we can work with them
		 var backupHarvesters                = _.filter(Game.creeps, (creep) => creep.memory.role == 'backupHarvester');
		 var harvesters                      = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		 var couriers                        = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier');
		 var towerCourier                    = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerCourier');
		 var miners                          = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
		 var repairers                       = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
		 var upgraders                       = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
		 var builders                        = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
		 var defenders                       = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
		 var allCreepsInRoom1                = Game.rooms[room1].find(FIND_CREEPS);

		 
		 console.log('##################################');
		 console.log('BackupHarvesters: '    + backupHarvesters.length);
		 console.log('Harvesters: '          + harvesters.length);
		 console.log('Couriers: '            + couriers.length);
		 console.log('TowerCouriers: '       + towerCourier.length);
		 console.log('Miners: '              + miners.length);
		 console.log('Repairers: '           + repairers.length);
		 console.log('Upgraders: '           + upgraders.length);
		 console.log('Builders: '            + builders.length);
		 console.log('Defenders: '           + defenders.length);
		 console.log('##################################');
		 
		 //2DO define mininum of creeps in vars
		 var minBackupHarvesters             = 2;
		 var minHarvesters                   = 0;    // 2Do: do i still need harvesters, when i got miners and couriers?!?!
		 var minCouriers                     = 2;    // 2Do: only make couriers, when miners are there or containers are half full
		 var minTowerCouriers                = 1;    // 2Do: replace maybe with normal couriers. just tell couriers to prioritize towers under certain circs
		 var minMiners                       = 2;    // 2Do: make enough miners as containers we have
		 var minRepairers                    = 0;    // cheaper than tower repairing things
		 var minUpgraders                    = 2;    // 2Do: only spawn more/bigger Upgraders than harvesters enough; only spawn new ones if overall energy amount is over certain number
		 var minBuilders                     = 2;    // 2Do only make builders when construction sites in room. Make more builders when there are more than  
		 var minDefenders                    = 0;    // 2Do: 1 always on hand. Only spawn rest if hostile in room.
		                                             // Just produce a new one to be ready when old one dies
		 
		 //react to when there is an attack
		 if (roomHasHostiles.length > 0) {
		     console.log('ATTACK MODE LIVE');
		     var minBackupHarvesters         = 2;    
		     var minHarvesters               = 1;    // +1 for urgent delivery of energy to towers, spawn, extensions 
		     var minCouriers                 = 4;    // +1
		     var minTowerCouriers            = 0;    // Tower couriers will block the way. Just need to prioritize towers
		     var minMiners                   = 1;    // -1
		     var minRepairers                = 0;    
		     var minUpgraders                = 1;    // -2
		     var minBuilders                 = 0;    
		     var minDefenders                = 10;   // +8  // 2DO: always spawn defenders first before anything else
		 }
		 
		 // 2DO: healers?

		 // define all wanted and needed emojis:


		 
		 // spawn backup BACKUPHARVESTER 
		 // spawn only if nothing goes
		 if(harvesters.length == 0 && miners.length == 0 || 
		     harvesters.length == 0 && couriers.length == 0 || 
		     harvesters.length == 0 && allCreepsInRoom1.length <= 2 ) {
		     if(backupHarvesters.length < minBackupHarvesters) {
		         var newName = 'BackupHarvester' + Game.time;
		         // console.log('Spawning new BackupHarvester: ' + newName);
		         Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,WORK,CARRY,CARRY], newName,  // cost 300E; MOVE*2,WORK*1,CARRY*2; 
		             {memory: {role: 'backupHarvester'}});
		     }
		 }

		 
		 // spawn normal HARVESTERS 
		 // if(harvesters.length < minHarvesters) {
		 //     var newName = 'Harvester' + Game.time;
		 //     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY], newName, // cost 550E; MOVE*3,WORK*2,CARRY*4; 900K health; carry 200(4 extensions)
		 //         {memory: {role: 'harvester'}});
		 // }
		 // spawn normal HARVESTERS 
		 if(harvesters.length < minHarvesters) {
		     var newName = 'Harvester' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY], newName, // cost 550E; MOVE*3,WORK*2,CARRY*4; 900K health; carry 200(4 extensions)
		         {memory: {role: 'harvester'}});
		 }
		 
		 // spawn COURIERS 
		 if(couriers.length < minCouriers  && (miners.length >= minMiners)) {
		     var newName = 'Courier' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, // cost 600E;carry400
		         {memory: {role: 'courier'}});
		 }
		 
		 // spawn MINERS 
		 // only if harvesters are there already - otherwise we don't have anyone delivering energy to spawn & extensions
		 // 2Do, create mini and MAX miner
		 // 2DO: only create as many miners as containers are near to source
		 if(miners.length < minMiners && (harvesters.length >= minHarvesters)) {
		     var newName = 'Miner' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK], newName, //MOVE*3,WORK*6 
		         {memory: {role: 'miner'}});
		 }
		 
		// spawn TOWERCOURIER 
		 if(towerCourier.length < minTowerCouriers  && (harvesters.length >= minHarvesters) && damagedStrucInRoom1.length > 15) {
		     var newName = 'TowerCourier' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY], newName, // cost 550E; MOVE*3,WORK*2,CARRY*4; 900K health; carry 200
		         {memory: {role: 'towerCourier'}});
		 }
		 
		 //spawn REPAIRERS 
		 if(repairers.length < minRepairers) {
		     var newName = 'Repairer' + Game.time;
		     /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, //9
		         {memory: {role: 'repairer'}});*/
		         
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], newName, //9
		         {memory: {role: 'repairer'}});    
		     
		 }
		 
		 //2Do: spawn backup upgrader to avoid being downgraded
		 
		 
		 // spawn UPGRADERS 
		 // bu spawn only when enough harvesters are there. Keeps the colony from dying
		 if(upgraders.length < minUpgraders && harvesters.length >= minHarvesters && miners.length >= minMiners ) {
		     var newName = 'Upgrader' + Game.time;
		     /*Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], newName, // cost 1100E; MOVE*6,WORK*5,CARRY*6; 1.700K health; carry 300
		         {memory: {role: 'upgrader'}});*/
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, // cost 1100E; MOVE*6,WORK*5,CARRY*6; 1.700K health; carry 300
		         {memory: {role: 'upgrader'}});
		         
		 }
		 
		 // spawn BUILDERS 
		 // 2Do! only build new builders when currently construction sites unfinished!
		 // 2Do! build another mini builder for when there is low energy
		 var baustellen = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_CONSTRUCTION_SITES); // only works for this spawn!!! 
		 if(builders.length < minBuilders && (baustellen) && harvesters.length >= minHarvesters && miners.length >= minMiners ) {
		     var newName = 'Builder' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], newName, // cost 1050E; MOVE*6,WORK*3,CARRY*9 ; 1800 health carry 450
		         {memory: {role: 'builder'}});
		 }
		 
		 // spawn DEFENDERS 
		 if(defenders.length < minDefenders) {
		     var newName = 'Defender' + Game.time;
		     Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], newName, // cost 910E; MOVE*7,ATTACK*7; 2.100K health; attack	210.000/T	315.000K/1500T	756.000K/H	18.144M/D
		         {memory: {role: 'defender'}});
		 }

		 
		 
		 // 2Do: for each room, then for each spawn, show what ur spawning
		 // visuals for showing what is being spawned
		 if(Game.spawns['Spawn1'].spawning) {
		     var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
		     Game.spawns['Spawn1'].room.visual.text(
		         '' + spawningCreep.memory.role,
		         Game.spawns['Spawn1'].pos.x + 1,
		         Game.spawns['Spawn1'].pos.y,
		         {align: 'left', opacity: 0.9});
		 }
	}
	
}