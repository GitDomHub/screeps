/*
This file is being edited by a local IDE, sublime.
DONT EDIT IN SCREEPS INGAME EDITOR
or changes will be lost
*/

//Global vars - put at very beginning
require('vars.global');


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

    

    // for (singleRoom of Game.rooms) {
        // actionsGlobal.writeSourcesIntoMem(singleRoom);    
    // }
    
    
    actionsSpawn.runSpawnFactory();
        
    roleTower.runAllTowers(global.room1);
    
    
    
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
    console.log('Extensions: ' + extensions.length);
    console.log("Energy: "+Game.spawns.Spawn1.room.energyAvailable);
    console.log("Energy Cap: "+Game.spawns.Spawn1.room.energyCapacityAvailable);
    //console.log('room.energyAvailable: ' + Game.creeps[1].Room.energyAvailable + ' | room.energyCapacityAvailable: ' + Game.creeps[1].Room.energyCapacityAvailable );
    

    // run all creeps
    actionCreeps.DoWhatYouGottaDo();
};

