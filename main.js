/*
This file is being edited by a local IDE, sublime.
DONT EDIT IN SCREEPS INGAME EDITOR
or changes will be lost
*/

/**
 *
 * CURRENT BRANCH: 180131-remote-mining
 *
 */


/*=============================================
=                   Includes                    =
=============================================*/

var MemoryManager = require('managers.Memory');
var MiningManager = require('managers.Mining');
var SpawnQueueManager = require('managers.SpawnQueue');
var SpawnManager = require('managers.Spawn');
var ProfileUtils = require('utils.Profiles');

/*----------  Managers  ----------*/





/*----------  Creep Roles  ----------*/
var roleHarvester                       = require('role.harvester');
var roleTowerCourier                    = require('role.towerCourier');
var roleCourier                         = require('role.Courier');
var roleUpgrader                        = require('role.upgrader');
var roleBuilder                         = require('role.builder');
var roleRepairer                        = require('role.repairer');
var roleMiner                           = require('role.miner');
var roleDefender                        = require('role.defender');
// 2DO: need healers

/*----------  Structure Roles  ----------*/

var roleTower                           = require('role.tower');


/*----------  Actions  ----------*/

var actionsGlobal                       = require('actions.global');
var actionsSelectSource                 = require('actions.selectSource');
var actionsSpawn                        = require('actions.Spawn');
var actionCreeps                        = require('actions.Creeps');

/*=====  End of Section Includes  ======*/



module.exports.loop = function () {
    console.log('/*----------  STARTING NEW TICK  ----------*/');
    

    // run memory 
    // actionsGlobal.ClearMemory(); // clears dead creep memory
    MemoryManager.ClearDeadCreeps();

    MemoryManager.write();
    
    // looooop through all rooms that I have creeps in
    for (let singleRoom in Game.rooms) {
        if (!singleRoom) {
            console.log(Game.rooms, '<----- cant loop through those');
            continue;
        }

        // console.log('In loop for room: ' + singleRoom);
               

        actionsSpawn.RunSpawnFactory(singleRoom);
        roleTower.RunAllTowers(singleRoom);
        SpawnQueueManager.run(singleRoom);
        // run all managers
        // harvester Manager
        MiningManager.run(singleRoom);
        // courier manager
        // upgrader manager
        // builder mnager
        // defender manager
        

        
        SpawnManager.run(singleRoom);

        
        
        // run all creeps
        actionCreeps.DoWhatYouGottaDo(singleRoom);

    }
    
    
    
        
    
    
    
    
    // manually overwrite creeps
    if (Game.creeps['Builder23382954'] != undefined) {
        Game.creeps['Builder23382954'].memory.role = 'courier';
        console.log('Builder23382954 hat die Rolle: ' + Game.creeps['Builder23382954'].memory.role);    
    } 
    

    
    
    //Console 
    // var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
    //   filter: { structureType: STRUCTURE_EXTENSION }
    // });
    // console.log('Extensions: ' + extensions.length);
    console.log("Energy: "+Game.spawns.Spawn1.room.energyAvailable);
    console.log("Energy Cap: "+Game.spawns.Spawn1.room.energyCapacityAvailable);
    //console.log('room.energyAvailable: ' + Game.creeps[1].Room.energyAvailable + ' | room.energyCapacityAvailable: ' + Game.creeps[1].Room.energyCapacityAvailable );
    

    
};



