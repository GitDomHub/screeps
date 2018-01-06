var moduleSelectSource = require('module.selectSource');
var roleRepairer = {
    run: function(creep) {
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('⛏harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('⚙ repair');
        }
        if(creep.memory.repairing) {
            // 2Do: go for structure that has lowest hits
            var repairneeded = creep.room.find(FIND_STRUCTURES,{filter: (structure) => structure.hits < structure.hitsMax * 0.5 && structure.hits < 300000});
            if (repairneeded.length > 0) {
                var lowestHitsStructure = _.min(repairneeded, "hits");
                if(creep.repair(lowestHitsStructure) == ERR_NOT_IN_RANGE){
                    creep.moveTo(lowestHitsStructure, {visualizePathStyle: {stroke: '#00ff00'}});
                }
                else {
                    creep.repair(lowestHitsStructure);
                }
            }
            
        }
        else {
            //var sources = creep.room.find(FIND_SOURCES);
            /*var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
            
            //new alternative: use module.selectSource routine to see if there are containers first
            if(moduleSelectSource) {
                moduleSelectSource.run(creep);
            } else {
                console.log('Harvester cannot find suitable source!');
            }
        }
    }
};
module.exports = roleRepairer;