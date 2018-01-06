/*2Do: when nothing to build, assign upgrader role*/

var moduleSelectSource = require('module.selectSource');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // when building right now but no more energy, go harvest
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        // when not building but have full energy, start building
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
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
                
            }

            
        }
        else {
            //new alternative: use module.selectSource routine to see if there are containers first
            if(moduleSelectSource) {
                moduleSelectSource.run(creep);
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