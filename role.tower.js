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
        var tower = Game.getObjectById('5a43240fd4598606955daf61');
        
        var towers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        console.log('All towers in room' + towers);
        
        if(tower.length > 0) {
            console.log('have a tower');
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
               // dont attack friends
               //if(closestHostile.owner.username == "Odd") { 
            //       break;
              // };
                    tower.attack(closestHostile);
            } else {
                
                //....first heal any damaged creeps
                var weakCreeps = _.filter(Game.creeps, (creep) => (creep.hits < creep.hitsMax));
                console.log('weak creeps:' + weakCreeps);
                if (weakCreeps.length > 0) {
                    for (let singleWeakCreep of weakCreeps) {
                        // get the creep object
                        //var creep = Game.creeps[name];
                        console.log(singleWeakCreep);
                        //towers.forEach(tower => tower.heal(creep));
                        tower.heal(singleWeakCreep);
                        console.log("Tower is healing Creeps.");
                    }    
                }
                
                
                // only repair if tower has 250 energy left
                 if (tower.energy > 500) {
                    // 2DO: differenciate between structures
                    // - ramparts 30k
                    // - roads ?
                    // ...
                    // find damaged structures with certain metrics
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        //filter: (structure) => structure.hits < structure.hitsMax
                        filter: (structure) => /*structure.hits < structure.hitsMax * 0.5 &&*/ structure.hits < 200000
                    });
                    // repair 
                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                 }
            }
            
    
            
        }
    }
};
module.exports = roleTower;
