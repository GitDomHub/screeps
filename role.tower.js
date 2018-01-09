/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

//module.exports = {
var roleTower = {
    run: function(myRoomName) {

        // make tower do stuff
        var allTowers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        
        if(allTowers.length > 0) {
            for (var singleTower of allTowers) {
                // STEP 1: ATTACK
                var hostileHealer = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => (s.getActiveBodyparts(HEAL) > 0) });
                var hostileAttacker = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => ( s.getActiveBodyparts(ATTACK) > 0  || s.getActiveBodyparts(RANGED_ATTACK) > 0) });
                var closestHostile = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if(hostileHealer) {
                    singleTower.attack(hostileHealer);
                }
                else if (closestHostile) {
                    // dont attack friends
                    //if(closestHostile.owner.username != "Odd") { 
                        //console.log('hostile is a friend, I am not attacking.');
                        // 2Do: loop through ALL hostiles and then see if any of hostiles in room is an enemy. then attack that one
                        singleTower.attack(closestHostile);
                    //};
                // STEP 2: HEAL CREEPS
                } else { 
                    
                    //....first heal any damaged creeps
                    var weakCreeps          = _.filter(Game.creeps, (creep) => (creep.hits < creep.hitsMax));
                    //console.log('weak creeps:' + weakCreeps);
                    // question : can tower actuall heal more than one creep???
                    if (weakCreeps.length > 0) {
                        for (let singleWeakCreep of weakCreeps) {
                            //console.log(singleWeakCreep);
                            singleTower.heal(singleWeakCreep);
                        }    
                    }
                    
                    // STEP 3: REPAIR
                    // - only repair if tower has enough energy left
                    // console.log(singleTower.energy);
                    if (singleTower.energy > singleTower.energyCapacity * 0.25) {
                        // 2DO: differenciate between structures
                        // - ramparts 300.000 begin from lowest hitpoints
                        // - roads ? until 2.500
                        // ...
                        
                        // find damaged structures with certain metrics
                        var closestDamagedStructure = singleTower.pos.findClosestByRange(FIND_STRUCTURES, {
                            //filter: (structure) => structure.hits < structure.hitsMax
                            /*structure.hits < structure.hitsMax * 0.5 &&*/
                            filter: (structure) => structure.hits < 350000 &&
                                    structure.hits < structure.hitsMax * 0.5
                        });
                        // 2Do: var lowestHitsStructure = _.min(allDamagedStructures, "hits");
                        // repair 
                        if(closestDamagedStructure) {
                            let result = singleTower.repair(closestDamagedStructure);
                        }
                    }
                    
                }    
            }
        }
    },

    healCreeps : function () {

    },

    repairStuff : function () {
        
};
module.exports = roleTower;