require('vars.global');
var actionSelectSource = require('actions.selectSource');
var roleRepairer = {
    run: function(creep) {
        // Repair structures until a certain value
        // 2Do: make this dependend on how much energy we have?
        //var repairUntilHitsEqual = 450000; put this into main file outside scope

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('repair');
        }

        if(creep.memory.repairing) {
            var structuresNeedingRepair = creep.room.find(FIND_STRUCTURES,
                {filter: (s) => s.hits < (s.hitsMax * Memory.room[creep.room].repairUntilPercentage) && 
                                        s.hits < Memory.room[creep.room].repairUntil});
            if (structuresNeedingRepair.length > 0) {
                // find structure with lowest hitpoints
                // 2Do: right now if there is a rampart with 270k hitpoints, then the repairer will move there. 
                //      once it hits the same amount of hits as other ramparts, the creep will leave.
                //      If the creep is right now already a structure that has lower than threshold hitpoints, MAYBE: first repair that one
                //      only if there is a hostile in room, go for lowest structure, because that one might be under attack
                //
                // Solution: store current target in memory.
                // if already a target in memory...
                // check if hits are already as high as I want -> repairUntilHitsEqual
                // if not, keep repairing
                // if already as high, delete target from memory
                // write new target

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
            if(actionSelectSource) {
                actionSelectSource.run(creep);
            } else {
                console.log('Repairer cannot find suitable source!');
            }
        }
    }
};
module.exports = roleRepairer;