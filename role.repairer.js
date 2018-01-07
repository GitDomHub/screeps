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
            var structuresNeedingRepair = creep.room.find(FIND_STRUCTURES,
                {filter: (s) => s.hits < s.hitsMax * 0.5 && 
                                        s.hits < 450000});
            if (structuresNeedingRepair.length > 0) {
                // find structure with lowest hitpoints
                // 2Do: right now if there is a rampart with 270k hitpoints, then the repairer will move there. 
                //      once it hits the same amount of hits as other ramparts, the creep will leave.
                //      If the creep is right now already a structure that has lower than threshold hitpoints, MAYBE: first repair that one
                //      only if there is a hostile in room, go for lowest structure, because that one might be under attack

                /*var lowestHitsStructure = _.min(structuresNeedingRepair, "hits");
                if(creep.repair(lowestHitsStructure) == ERR_NOT_IN_RANGE){
                    creep.moveTo(lowestHitsStructure, {visualizePathStyle: {stroke: '#00ff00'}});
                }*/
                // so far just go to the one structure that is first in list
                if(creep.repair(structuresNeedingRepair[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(structuresNeedingRepair[0], {visualizePathStyle: {stroke: '#00ff00'}});
                }
                else {
                    creep.repair(structuresNeedingRepair[0]);
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