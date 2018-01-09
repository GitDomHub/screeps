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
    runAllTowers: function(myRoomName) {
        // make tower do stuff
        var allTowers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        
        if(allTowers.length > 0) {
            for (var singleTower of allTowers) {
                // STEP 1: ATTACK
                // 2Do: maybe change to not only get closest hostile, but rather get all and then sort them out one by one
                var hostileHealer = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => (s.getActiveBodyparts(HEAL) > 0 && s.getActiveBodyparts(HEAL) < 15) });
                var hostileHealerBig = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => (s.getActiveBodyparts(HEAL) > 15) });
                var hostileAttacker = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => ( s.getActiveBodyparts(ATTACK) > 0  || s.getActiveBodyparts(RANGED_ATTACK) > 0) });
                var closestHostile = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                // 
                // console.log('tower range to big healer: ' + singleTower.pos.getRangeTo(hostileHealerBig));

                if(hostileHealerBig){
                    if(singleTower.pos.inRangeTo(hostileHealerBig, 15) ) {
                        // only attack big healers when close enough
                        singleTower.attack(hostileHealerBig);
                    }                    
                }else if(hostileHealer) {
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
                    
                    // //....first heal any damaged creeps
                    // var weakCreeps          = _.filter(Game.creeps, (creep) => (creep.hits < creep.hitsMax));
                    // //console.log('weak creeps:' + weakCreeps);
                    // // question : can tower actuall heal more than one creep???
                    // if (weakCreeps.length > 0) {
                    //     for (let singleWeakCreep of weakCreeps) {
                    //         //console.log(singleWeakCreep);
                    //         singleTower.heal(singleWeakCreep);
                    //     }    
                    // }
                    roleTower.healCreeps(singleTower);
                    
                    // STEP 3: REPAIR
                    // - only repair if tower has enough energy left
                    // console.log(singleTower.energy);
                    if (singleTower.energy > singleTower.energyCapacity * 0.80 && Game.spawns.Spawn1.room.energyAvailable > 1000) {
                        

                        roleTower.repairStuff(myRoomName, singleTower);
                    }
                    
                }    
            }
        }
    },

    healCreeps : function (tower) {
        var weakCreeps          = _.filter(Game.creeps, (creep) => (creep.hits < creep.hitsMax));
        // question : can tower actuall heal more than one creep???
        if (weakCreeps.length > 0) {
            for (let singleWeakCreep of weakCreeps) {
                tower.heal(singleWeakCreep);
            }    
        }
    },

    repairStuff : function (room, tower) {

        // maybe repair only on every 2nd tick?
        // 2DO: differenciate between structures
        // - ramparts 300.000 begin from lowest hitpoints
        // - roads ? until 2.500
        // ...        
        // 2Do: tower only repair close structures, let a repairer handle the rest
        // 2Do: First repair ramparts, then roads.

        // only repair if room has more energy than we need
        // 2Do: set this into memory
        
        if (Game.rooms[room].energyAvailable > (Game.rooms[room].energyCapacityAvailable * 0.7)) {
            // find damaged structures with certain metrics
            var allDamagedStructures = Game.rooms[room].find(FIND_STRUCTURES, {
                //filter: (structure) => structure.hits < structure.hitsMax
                /*structure.hits < structure.hitsMax * 0.5 &&*/
                filter: (structure) => structure.hits < 450000 &&
                        structure.hits < (structure.hitsMax * 0.5)
            });
            // 2Do: only repair structures that are further away when enemy creep is in proximity of 5-7
            var lowestHitsStructure = _.min(allDamagedStructures, "hits");
            // repair 
            if(lowestHitsStructure) {
                let result = tower.repair(lowestHitsStructure);
            }else{
                tower.say('err88');
            }
        }
    }
        
};
module.exports = roleTower;