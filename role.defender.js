var roleDefender = {
    // @param {Creep} creep /
    run: function(creep) {
        var flag = creep.pos.findClosestByRange(FIND_FLAGS, {
            filter: (s) => {!s.color === 6} // yellow is for mining
        });
        //console.log(flag);
        // if there is a close flag in this room (even with enemies)
        // only move close to the flag and start attacking
        // 2Do: set var in memory that this creep did arrive at target flag 
        if(flag && !creep.pos.inRangeTo(flag, 8)) {
            //then first move there
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff9999'}});
            // exit and dont do anything else (like attack)
            // return;
        }
        
        // first move to a flag if there is one in the room, THEN attack
        
        // check if creeps or structures exist that are not mine
        // 2Do, check if creeps or structures belong to a friend        


        if(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) != null || creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES) != null) {
            // find closest hostile creep
            var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            // 2Do: attack 
            var hostileHealer = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => (s.getActiveBodyparts(HEAL) > 0) });
            var hostileAttacker = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => ( s.getActiveBodyparts(ATTACK) > 0  || s.getActiveBodyparts(RANGED_ATTACK) > 0) });
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            //console.log('Hostiles: ' + hostile.length);
            // if no hostile creep found
            if(hostile==null) {
                // find hostile structures
                var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_STORAGE);
                }
                });
            }

            if(hostileHealer) {
                if(creep.attack(hostileHealer)== ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostileHealer, {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say("Healer!");
                    } else {
                        creep.attack(hostileHealer);
                    }  
            }else if (hostile) {// if there are any hostile creeps or structures
                var isFriend = false;
                // check if belongs to friend
                if(hostile.owner.username == "Odd") {isFriend = true};
                
                // only move and attack if not a friend
                if (!isFriend) {
                    if(creep.attack(hostile)== ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say("Kill!");
                    } else {
                        creep.attack(hostile);
                    }    
                }
                
            }
            
        }
        // if no hostiles found
        else {
            // move to flag
            var flag = creep.pos.findClosestByRange(FIND_FLAGS);
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff9999'}})
        }
    }
};
module.exports = roleDefender;