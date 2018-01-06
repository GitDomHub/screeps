var moduleSelectSource = require('module.selectSource');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            
             //new alternative: use module.selectSource routine to see if there are containers first
            if(moduleSelectSource) {
                moduleSelectSource.run(creep);
            } else {
                console.log('Harvester cannot find suitable source!');
            }
        
            
            var sources = creep.room.find(FIND_SOURCES);
            /*¶
            // 2Do: go to nearest CONTAINER or ENERGY SOURCE
            // if energy source then choose closest
            // if closest is empty go to next one
            // cycle through all energy sources in this room
            
            // upgrader go to left source
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            */
            /*
                                //test BEGIN make upgraders go to left container and left source only
                                var containers = creep.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_CONTAINER) && 
                                                (structure.store[RESOURCE_ENERGY] >= (creep.carryCapacity * 0.7) ) && 
                                                (structure.store[RESOURCE_ENERGY] >= 250) &&
                                                (structure.id == '5a47348a8f3dc80a6d80c71a') ;
                                    }
                                });
                                
                                // if no fitting containers ... wait.
                                if (containers.length == 0) {
                                    creep.say('source :(');
                                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                                    }
                                } else {
                                    creep.say('container :)');
                                    // when there is a fitting container
                                    // go withdraw energy
                                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                    }
                                } 
                                
                                //test END
            */
        }
    }
};

module.exports = roleUpgrader;