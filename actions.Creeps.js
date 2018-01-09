// creep roles
var roleHarvester                       = require('role.harvester');
var roleTowerCourier                    = require('role.towerCourier');
var roleCourier                         = require('role.Courier');
var roleUpgrader                        = require('role.upgrader');
var roleBuilder                         = require('role.builder');
var roleRepairer                        = require('role.repairer');
var roleMiner                           = require('role.miner');
var roleDefender                        = require('role.defender');

var actForAllCreeps = {
	DoWhatYouGottaDo : function() {
		// loop through all creeps
	    for(var name in Game.creeps) {
	        var creep = Game.creeps[name];
	        if(creep.memory.role == 'harvester') {
	            roleHarvester.run(creep);
	        }
	        if(creep.memory.role == 'backupHarvester') {
	            roleHarvester.run(creep);
	        }
	        if(creep.memory.role == 'courier') {
	            roleCourier.run(creep);
	        }
	        if(creep.memory.role == 'upgrader') {
	            roleUpgrader.run(creep);
	        }
	        if(creep.memory.role == 'builder') {
	            roleBuilder.run(creep);
	        }
	        if(creep.memory.role == 'repairer') {
	            roleRepairer.run(creep);
	        }
	        if(creep.memory.role == 'miner') {
	            roleMiner.run(creep);
	        }
	        if(creep.memory.role == 'towerCourier') {
	            roleTowerCourier.run(creep);
	        }
	        if(creep.memory.role == 'defender') {
	            roleDefender.run(creep);
	        }

	        actForAllCreeps.DropOffEnergyIfDying(creep);
	        
	        // // Make creep drop energy if time to live is under certain ticks
	        
	        // // check time to live
	        // var carryBodyparts = creep.getActiveBodyparts('carry');
	        // //console.log(creep + ' lives another ticks: ' + creep.ticksToLive + ' and has this carry load: ' + _.sum(creep.carry) + ' and so many carry bodyparts:' + carryBodyparts );
	        
	        
	        // // if creeps ticks to live under 50 (guess thats the longest route they'd take) and he has enough energy
	        // if (creep.ticksToLive < 40 && _.sum(creep.carry) > 50 && carryBodyparts > 1) {
	        //     if(creep.ticksToLive < 40 ) creep.say('死 in ' + creep.ticksToLive);
	            
	        //     // then get best structure to drop off energy
	        //     var targets = creep.room.find(FIND_STRUCTURES, {
	        //         filter: (structure) => {
	        //             return (  (structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
	        //                        structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
	        //                        structure.structureType == STRUCTURE_CONTAINER   && structure.store[RESOURCE_ENERGY] <= structure.storeCapacity ||
	        //                        structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
	        //                     );
	        //         }
	        //     });
	        //     // if there is structures which need energy, move!
	        //     if(targets.length > 0) {
	        //         // find closest target
	        //         closestTarget = creep.pos.findClosestByPath(targets);
	        //         // first cancel whatever the creep was doing before
	        //         creep.cancelOrder('harvest');
	        //         creep.cancelOrder('move');
	        //         creep.cancelOrder('repair');
	        //         creep.cancelOrder('withdraw');
	        //         creep.cancelOrder('build');
	                
	        //         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        //             creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
	        //         }
	        //     }
	        // // if not carrying much energy, just die now so we can get a new creep faster
	        // // checking for bodyparts is important, otherwise we kill wrong creeps
	        // } else if (creep.ticksToLive < 40 && _.sum(creep.carry) < 10 && carryBodyparts > 1) { 
	        //     creep.say('死 in ' + creep.ticksToLive);
	        //     creep.cancelOrder('harvest');
	        //     creep.cancelOrder('move');
	        //     creep.cancelOrder('repair');
	        //     creep.cancelOrder('withdraw');
	        //     creep.cancelOrder('build');
	        //     creep.suicide();
	        // } else {
	            
	        // }
	    }
	},

	DropOffEnergyIfDying : function (creep) {
		// Make creep drop energy if time to live is under certain ticks
	        
        // check time to live
        var carryBodyparts = creep.getActiveBodyparts('carry');
        console.log(creep + ' lives another ticks: ' + creep.ticksToLive + ' and has this carry load: ' + _.sum(creep.carry) + ' and so many carry bodyparts:' + carryBodyparts );
        
        
        // if creeps ticks to live under 50 (guess thats the longest route they'd take) and he has enough energy
        if (creep.ticksToLive < 40 && _.sum(creep.carry) > 50 && carryBodyparts > 1) {
            if(creep.ticksToLive < 40 ) creep.say('-.- in ' + creep.ticksToLive);
            
            // then get best structure to drop off energy
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (  (structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
                               structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
                               structure.structureType == STRUCTURE_CONTAINER   && structure.store[RESOURCE_ENERGY] <= structure.storeCapacity ||
                               structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                            );
                }
            });
            // if there is structures which need energy, move!
            if(targets.length > 0) {
                // find closest target
                closestTarget = creep.pos.findClosestByPath(targets);
                // first cancel whatever the creep was doing before
                creep.cancelOrder('harvest');
                creep.cancelOrder('move');
                creep.cancelOrder('repair');
                creep.cancelOrder('withdraw');
                creep.cancelOrder('build');
                
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        // if not carrying much energy, just die now so we can get a new creep faster
        // checking for bodyparts s important, otherwise we kill wrong creeps
        } else if (creep.ticksToLive < 40 && _.sum(creep.carry) < 10 && carryBodyparts > 1) { 
            creep.say('-.- in ' + creep.ticksToLive);
            creep.cancelOrder('harvest');
            creep.cancelOrder('move');
            creep.cancelOrder('repair');
            creep.cancelOrder('withdraw');
            creep.cancelOrder('build');
            creep.suicide();
        } else {
            
        }
	}
};

module.exports = actForAllCreeps;