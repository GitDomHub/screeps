var actionSelectSource = require('actions.selectSource');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // When status of harvesting FALSE and energy is ZERO then start harvesting process
        // means that harvester either harvester was just created or
        // it means that the harvester is depleted and just finished his journey of delivering energy
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('harvest');
        }
        // When harvester is currently harvesting (TRUE) and energy is FULL
        // then stop harvesting and start delivering energy
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('deliver');
        }
        
        // When creep is set to harvesting but maybe not close to the energy source
        // make it move there
        if(creep.memory.harvesting) {
                
             //new alternative: use actions.selectSource routine to see if there are containers first
            if(actionSelectSource) {
                actionSelectSource.run(creep);
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
                        /*structure.structureType == STRUCTURE_TOWER  && structure.energy < structure.energyCapacity ||*/
                        structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity ||
                        structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity /*||
                        structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity */);
                }
            });
            
            
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