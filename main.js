/*
This file is being edited by a local IDE, sublime.
DONT EDIT IN SCREEPS INGAME EDITOR
or changes will be lost


*/

// creep roles
var roleHarvester                       = require('role.harvester');
var roleTowerCourier                    = require('role.towerCourier');
var roleCourier                         = require('role.Courier');
var roleUpgrader                        = require('role.upgrader');
var roleBuilder                         = require('role.builder');
var roleRepairer                        = require('role.repairer');
var roleMiner                           = require('role.miner');
var roleDefender                        = require('role.defender');
// 2DO: need healers

// structure roles
var roleTower                           = require('role.tower');

// actions
var actionsGlobal                       = require('actions.global');
var actionsSelectSource                 = require('actions.selectSource');
var actionsSpawn                        = require('actions.Spawn');
var actionCreeps                        = require('actions.Creeps');



module.exports.loop = function () {

    // run memory 
    actionsGlobal.ClearMemory();
    
    
    // define vars for this room
    var room1                           = 'E83S21';
    var roomHasHostiles                 = Game.rooms[room1].find(FIND_HOSTILE_CREEPS);
    
    //console.log('any hostiles? -> ' + roomHasHostiles);
    
    
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

    console.log(allCreepsInRoom1.length);
    
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
    var minTowerCouriers                = 0;    // 2Do: replace maybe with normal couriers. just tell couriers to prioritize towers under certain circs
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
    if(harvesters.length == 0 && miners.length == 0 || harvesters.length == 0 && couriers.length == 0) {
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
    if(towerCourier.length < minTowerCouriers  && (harvesters.length >= minHarvesters) ) {
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

    
    
    
    // visuals for showing what is being spawned
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.9});
    }
    
    
    
    roleTower.runAllTowers(room1);
    
    
    
    // manually overwrite creeps
    if (Game.creeps['Builder23382954'] != undefined) {
        Game.creeps['Builder23382954'].memory.role = 'courier';
        console.log('Builder23382954 hat die Rolle: ' + Game.creeps['🔨 Builder23382954'].memory.role);    
    } 
    
    
    //console.log(Game.creeps['Repairer23189902'].owner.username);
    //Game.creeps['💎 Miner23242361'].memory.servingContainer = '5a437304ea2d2626ee07360f';
    //Game.creeps['💎 Miner23242361'].memory.servingContainer = '';
    //console.log('miner with name <💎 Miner23242361> is serving this continer:' + Game.creeps['💎 Miner23242361'].memory.servingContainer );
    
    
    //Console 
    var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    var maxspawncost = (extensions.length * 50) + 300;
    console.log('Extensions: ' + extensions.length);
    console.log("Energy: "+Game.spawns.Spawn1.room.energyAvailable);
    console.log("Energy Cap: "+Game.spawns.Spawn1.room.energyCapacityAvailable);
    //console.log('room.energyAvailable: ' + Game.creeps[1].Room.energyAvailable + ' | room.energyCapacityAvailable: ' + Game.creeps[1].Room.energyCapacityAvailable );
    

    // 2DO: auslagern!
    actionCreeps.DoWhatYouGottaDo();
    // // loop through all creeps
    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
    //     if(creep.memory.role == 'harvester') {
    //         roleHarvester.run(creep);
    //     }
    //     if(creep.memory.role == 'backupHarvester') {
    //         roleHarvester.run(creep);
    //     }
    //     if(creep.memory.role == 'courier') {
    //         roleCourier.run(creep);
    //     }
    //     if(creep.memory.role == 'upgrader') {
    //         roleUpgrader.run(creep);
    //     }
    //     if(creep.memory.role == 'builder') {
    //         roleBuilder.run(creep);
    //     }
    //     if(creep.memory.role == 'repairer') {
    //         roleRepairer.run(creep);
    //     }
    //     if(creep.memory.role == 'miner') {
    //         roleMiner.run(creep);
    //     }
    //     if(creep.memory.role == 'towerCourier') {
    //         roleTowerCourier.run(creep);
    //     }
    //     if(creep.memory.role == 'defender') {
    //         roleDefender.run(creep);
    //     }
        
    //     // Make creep drop energy if time to live is under certain ticks
        
    //     // check time to live
    //     var carryBodyparts = creep.getActiveBodyparts('carry');
    //     //console.log(creep + ' lives another ticks: ' + creep.ticksToLive + ' and has this carry load: ' + _.sum(creep.carry) + ' and so many carry bodyparts:' + carryBodyparts );
        
        
    //     // if creeps ticks to live under 50 (guess thats the longest route they'd take) and he has enough energy
    //     if (creep.ticksToLive < 40 && _.sum(creep.carry) > 50 && carryBodyparts > 1) {
    //         if(creep.ticksToLive < 40 ) creep.say('死 in ' + creep.ticksToLive);
            
    //         // then get best structure to drop off energy
    //         var targets = creep.room.find(FIND_STRUCTURES, {
    //             filter: (structure) => {
    //                 return (  (structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
    //                            structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
    //                            structure.structureType == STRUCTURE_CONTAINER   && structure.store[RESOURCE_ENERGY] <= structure.storeCapacity ||
    //                            structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
    //                         );
    //             }
    //         });
    //         // if there is structures which need energy, move!
    //         if(targets.length > 0) {
    //             // find closest target
    //             closestTarget = creep.pos.findClosestByPath(targets);
    //             // first cancel whatever the creep was doing before
    //             creep.cancelOrder('harvest');
    //             creep.cancelOrder('move');
    //             creep.cancelOrder('repair');
    //             creep.cancelOrder('withdraw');
    //             creep.cancelOrder('build');
                
    //             if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    //             }
    //         }
    //     // if not carrying much energy, just die now so we can get a new creep faster
    //     // checking for bodyparts is important, otherwise we kill wrong creeps
    //     } else if (creep.ticksToLive < 40 && _.sum(creep.carry) < 10 && carryBodyparts > 1) { 
    //         creep.say('死 in ' + creep.ticksToLive);
    //         creep.cancelOrder('harvest');
    //         creep.cancelOrder('move');
    //         creep.cancelOrder('repair');
    //         creep.cancelOrder('withdraw');
    //         creep.cancelOrder('build');
    //         creep.suicide();
    //     } else {
            
    //     }
    // }
};

