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
        console.log('in func');
        //var tower = Game.getObjectById('5a43240fd4598606955daf61');
        
        var allTowers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        console.log('All towers in room' + allTowers);
        
        if(allTowers.length > 0) {
            for (var singleTower of allTowers) {
                console.log('in func for this tower: ' + singleTower);
                // STEP 1: ATTACK
                var hostileHealer = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => (s.getActiveBodyparts(HEAL) > 0) });
                var hostileAttacker = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (s) => ( s.getActiveBodyparts(ATTACK) > 0  || s.getActiveBodyparts(RANGED_ATTACK) > 0) });
                var closestHostile = singleTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if(hostileHealer) {
                    singleTower.attack(hostileHealer);
                    console.log('Tower is attacking healers.');
                }
                else if (closestHostile) {
                    // dont attack friends
                    //if(closestHostile.owner.username != "Odd") { 
                        //console.log('hostile is a friend, I am not attacking.');
                        // 2Do: loop through ALL hostiles and then see if any of hostiles in room is an enemy. then attack that one
                        singleTower.attack(closestHostile);
                        console.log('Tower is attacking hostiles.');
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
                            console.log("Tower is healing Creeps.");
                        }    
                    }
                    
                    // STEP 3: REPAIR
                    // - only repair if tower has enough energy left
                    console.log(singleTower.energy);
                    if (singleTower.energy > singleTower.energyCapacity * 0.75) {
                        // 2DO: differenciate between structures
                        // - ramparts 300.000 begin from lowest hitpoints
                        // - roads ? until 2.500
                        // ...
                        
                        // find damaged structures with certain metrics
                        var closestDamagedStructure = singleTower.pos.findClosestByRange(FIND_STRUCTURES, {
                            //filter: (structure) => structure.hits < structure.hitsMax
                            /*structure.hits < structure.hitsMax * 0.5 &&*/
                            filter: (structure) => structure.hits < 450000 &&
                                    structure.hits < structure.hitsMax * 0.5
                        });
                        // 2Do: var lowestHitsStructure = _.min(allDamagedStructures, "hits");
                        console.log('closestDamagedStructure: ' + closestDamagedStructure);
                        // repair 
                        if(closestDamagedStructure) {
                            console.log('Tower is reparing...');
                            let result = singleTower.repair(closestDamagedStructure);
                            console.log (result);
                        }
                    }
                    
                }    
            }
        }
    }
};
module.exports = roleTower;