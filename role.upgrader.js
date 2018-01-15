var actionSelectSource = require('actions.selectSource');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            //Upgrader 2Do: check if controller is already set in memory!
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            
             //new alternative: use actions.selectSource routine to see if there are containers first
            if(actionSelectSource) {
                actionSelectSource.run(creep);
            } else {
                creep.say('error');
            }           
        }
    }
};

module.exports = roleUpgrader;