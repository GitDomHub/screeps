var moduleSelectSource = require('module.selectSource');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // When status of harvesting FALSE and energy is ZERO then start harvesting process
        // means that harvester either harvester was just created or
        // it means that the harvester is depleted and just finished his journey of delivering energy
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        // When harvester is currently harvesting (TRUE) and energy is FULL
        // then stop harvesting and start delivering energy
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('⚡ deliver');
        }
        
        // When creep is set to harvesting but maybe not close to the energy source
        // make it move there
        if(creep.memory.harvesting) {
            
            // 2Do: move this SOURCE SELECTION SCRIPT INTO MODULE CALLED module.selectsource
            /*// MOVE BEGIN          
            // first see if there are CONTAINERS that are not empty
            // alternative: get energy from container instead from source
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 250);
                }
            });
            // if there are containers found that are not empty
            if(containers.length > 0) {
                var container = creep.pos.findClosestByPath(containers);
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move there and get energy from there 
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    // get creep name
                    // get container ID
                    
                }
            } else {
                // NO CONTAINERS HAVE ENERGY
                // find closest SOURCE to the creeps current position
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // make creep move and show its path
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // MOVE END
            */

            
             //new alternative: use module.selectSource routine to see if there are containers first
            if(moduleSelectSource) {
                moduleSelectSource.run(creep);
            } else {
                console.log('Harvester cannot find suitable source!');
            }
            
            
            
            //return; // test
            
            
            
        }
        // not harvesting, delivering energy to structures
        else {
            // find all structures that need energy, list only those structures 
            // of which energy is less than max
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ( 
                        structure.structureType == STRUCTURE_TOWER  && structure.energy < structure.energyCapacity ||
                        structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity ||
                        structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity /*||
                        structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity */);
                }
            });
            /*
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE && 
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                }
            });
            */
            
            console.log('harvester targets: ' + targets);
        
            
            // if there is structures which need energy, move!
            if(targets.length > 0) {
                // move and transfer to closest target
                var closestTarget = creep.pos.findClosestByPath(targets);
                // 2Do: make them move to target before it gets empty
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;