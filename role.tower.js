/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */
require('vars.global');
//module.exports = {
var roleTower = {

    RunAllTowers: function(myRoomName) {
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

                if(hostileHealerBig) {
                    // only attack big healers when close enough
                    if(singleTower.pos.inRangeTo(hostileHealerBig, 15)) {                        
                        singleTower.attack(hostileHealerBig);                   
                    }    
                }

                if(hostileHealer) {
                    singleTower.attack(hostileHealer);
                }
                else if (hostileAttacker && !hostileHealerBig) {
                    // dont attack friends
                    //if(hostileAttacker.owner.username != "Odd") { 
                        //console.log('hostile is a friend, I am not attacking.');
                        // 2Do: loop through ALL hostiles and then see if any of hostiles in room is an enemy. then attack that one
                        singleTower.attack(hostileAttacker);
                    //};                
                }else if (closestHostile) {
                    // dont attack friends
                    //if(hostileAttacker.owner.username != "Odd") { 
                        //console.log('hostile is a friend, I am not attacking.');
                        // 2Do: loop through ALL hostiles and then see if any of hostiles in room is an enemy. then attack that one
                        singleTower.attack(closestHostile);
                    //};
                
                } else { // STEP 2: HEAL CREEPS
                    

                    roleTower.healCreeps(singleTower);
                    
                    // STEP 3: REPAIR
                    // - only repair if tower has enough energy left
                    // console.log(singleTower.energy);
                    if (singleTower.energy >= (singleTower.energyCapacity * 0.75) && Game.spawns.Spawn1.room.energyAvailable > 1000) {
                    
                        roleTower.repairStuff(myRoomName, singleTower);
                    }
                    
                }    
            }
        }
    },

    healCreeps : function (tower) {
        var weakCreeps          = _.filter(Game.creeps, (creep) => (creep.hits < creep.hitsMax));
        // question : can tower actuall heal more than one creep???
        // 2Do: focus on creep with lowest hit points?
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

        // find damaged structures with certain metrics
        // var allDamagedStructures = Game.rooms[room].find(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < Memory.room1.repairUntil &&
        //             structure.hits < (structure.hitsMax * 0.5)
        // });

        // allDamagedStructures = Memory.damagedStructuresR1; // use stuff from memory!
        allDamagedStructures = Memory.rooms[room].damagedStructures; // use stuff from memory!
        console.log('all damaged strucs' + allDamagedStructures);

        // turn all damaged structures into an array so we can easily find the one with lowest hits
        let damagedArr = Object.keys(allDamagedStructures).map(function(key) {
          return [String(key), allDamagedStructures[key]];
        });

        console.log('damagedArr:' + damagedArr[0]);

        for (s of damagedArr) {
            console.log(s[0]);
    // var lowestHitsStructure = _.min(damagedArr);
            let strucObj = Game.getObjectById(s[0]) ;
            console.log(strucObj.hits);

            if (strucObj.hits < Memory.roomOpts[myRoomName].repairUntil) {
                
            }

            // var lowestHitsStructure = damagedArr[0];
            // console.log('lowest hits:' + lowestHitsStructure);
            // // repair 
            // var lowestHitsStructure = Game.getObjectById(Object.keys(allDamagedStructures)[0]);
            // console.log('found this by structure id: ' + lowestHitsStructure);



            // if(lowestHitsStructure) {
            //     let result = tower.repair(lowestHitsStructure);
            //     console.log(result);
            // }else{
            //     console.log('nothing to repair for tower');
            // }
        }


        // var lowestHitsStructure = damagedArr[0];
        //     console.log('lowest hits:' + lowestHitsStructure);
        //     // repair 
        //     var lowestHitsStructure = Game.getObjectById(Object.keys(allDamagedStructures)[0]);
        //     console.log('found this by structure id: ' + lowestHitsStructure);



        //     if(lowestHitsStructure) {
        //         let result = tower.repair(lowestHitsStructure);
        //         console.log(result);
        //     }else{
        //         console.log('nothing to repair for tower');
        //     }
        

    }
        
};
module.exports = roleTower;