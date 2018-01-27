/*
This file is being edited by a local IDE, sublime.
DONT EDIT IN SCREEPS INGAME EDITOR
or changes will be lost
*/

/*=============================================
=                   Includes                    =
=============================================*/
/*----------  Globals  ----------*/

require('vars.global');

/*----------  Utils  ----------*/
var ProfileUtils = require('utils.Profiles');


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


    // run memory 
    actionsGlobal.ClearMemory(); // clears dead creep memory
    
    actionsGlobal.InitRoomMemory(); // creates a new empty array for all rooms in memory if non existent


    var roomArray = [];
    // looooop through all rooms that I have creeps in
    for (let singleRoom in Game.rooms) {
        if (!singleRoom) {
            console.log(Game.rooms, '<----- cant loop through those');
            continue;
        }

        console.log('In loop for room: ' + singleRoom);
        
        roomArray.push(singleRoom);        

        actionsGlobal.WriteSourcesIntoMem(singleRoom); // put all energy sources into memory
        actionsSpawn.RunSpawnFactory(singleRoom);
        roleTower.RunAllTowers(singleRoom);
        
        // run all creeps
        actionCreeps.DoWhatYouGottaDo(singleRoom);

    }

    // console.log('Room Array: ' + roomArray);
    
    
    
        
    
    
    
    
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
    

    
};

