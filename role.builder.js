/*2Do: when nothing to build, assign upgrader role*/

var actionSelectSource = require('actions.selectSource');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // when building right now but no more energy, go harvest
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        // when not building but have full energy, start building
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }
        
        // when set to build stuff
        if(creep.memory.building) {
            // get all construction sites
            //var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // when full energy and building true and no construction sites in this room
                // move to waiting spot to not hinder other creeps
                // ############# BEGIN
                // ############# make a module or action out of this 
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( 
                            structure.structureType == STRUCTURE_TOWER  && structure.energy < structure.energyCapacity ||
                            structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity ||
                            structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity /*||
                            structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity*/);
                    }
                });                
                console.log('builder targets: ' + targets);
                // if there is structures which need energy, move!
                if(targets.length > 0) {
                    // move and transfer to closest target
                    var closestTarget = creep.pos.findClosestByPath(targets);
                    // 2Do: make them move to target before it gets empty
                    if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                // ############# 
                // ############# END


            }

            
        }
        else {
            //new alternative: use actions.selectSource routine to see if there are containers first
            if(actionSelectSource) {
                actionSelectSource.run(creep);
            } else {
                console.log('Builder cannot find suitable source!');
            }
            
            return; // test
            
            //var sources = creep.room.find(FIND_SOURCES);
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;