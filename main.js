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
    actionsGlobal.ClearMemory(); // clears dead creep memory
    
    actionsGlobal.InitRoomMemory(); // creates a new empty array for all rooms in memory if non existent


    var roomArray = [];
    // looooop through all rooms that I have creeps in
    for (singleRoom in Game.rooms) {

        // console.log('In loop for room: ' + singleRoom);
        
        roomArray.push(singleRoom);        

        actionsGlobal.WriteSourcesIntoMem(singleRoom); // put all energy sources into memory
        

    }

    // console.log('Room Array: ' + roomArray);
    
    
    actionsSpawn.runSpawnFactory();
        
    roleTower.runAllTowers(global.room1);
    
    
    
    // manually overwrite creeps
    if (Game.creeps['Builder23382954'] != undefined) {
        Game.creeps['Builder23382954'].memory.role = 'courier';
        console.log('Builder23382954 hat die Rolle: ' + Game.creeps['Builder23382954'].memory.role);    
    } 
    

    
    
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

