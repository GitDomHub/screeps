/*Delivers from containers to other places*/


/*2DO: make courier also deliver to towers when enemy is in room!*/
var actionsGlobal                       = require('actions.global');
var actionsSelectSource                 = require('actions.selectSource');

var roleCourier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log('creep with name <' + creep.name +'> has this container assigned: ' + creep.memory.servingContainer); 
        
        // Not getting energy and not having energy in creep
        // go and harvest/get energy
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('harvest');
        }
        // When creep is currently harvesting (TRUE) and energy is FULL
        // then stop harvesting and start delivering energy
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('deliver');
        }
        


        
        // If set to get energy, make creep move there
        if (creep.memory.harvesting) {
            // if drop assigned, go pickup
            if(creep.memory.assignedDropId){
                let dropObj                     = Game.getObjectById(creep.memory.assignedDropId);
                if(dropObj && dropObj.amount > 1 && dropObj.resourceType == RESOURCE_ENERGY){
                    if(creep.pickup(dropObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropObj);
                    }                    
                }
            }
            // if no drop , then look for container, withdraw
            if(creep.memory.assignedContainerId){
                let containerObj                     = Game.getObjectById(creep.memory.assignedContainerId);
                if(creep.withdraw(containerObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerObj);
                }
            }

        } else { // if creep has energy and should deliver...
            // find all structures that need energy, list only those structures 
            // of which energy is less than max
            
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         // 2Do: because storage has huge storage, maybe make own creep for it?
            //         return ( (  structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
            //                     structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
            //                     structure.structureType == STRUCTURE_TOWER       && structure.energy <= (structure.energyCapacity * 0.9) /*|| 
            //                     structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity*/)                                 
            //                 );
            //     }
            // });
            // //console.log(targets);
            // // if there is structures which need energy, move!
            // if(targets.length > 0) {
            //     let closestTarget = creep.pos.findClosestByRange(targets); // somehow one tower is not being served. maybe list by energy amount?
            //     // or maybe check if target is storage, then check if towers are full first.
            //     if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            //         console.log(closestTarget);
            //     }
            // } else { 
                
                var storages = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return ( (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)                                 
                            );}
                });

                if (storages.length > 0) {
                    if(creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    // if no storage there or maybe storage is full, then deliver to other facilities
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ( (  structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
                                        structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
                                        structure.structureType == STRUCTURE_TOWER       && structure.energy <= (structure.energyCapacity * 0.9))                                 
                                    );
                        }
                    });
                    // console.log(targets);
                    // if there is structures which need energy, move!
                    if(targets.length > 0) {
                        let closestTarget = creep.pos.findClosestByRange(targets); // somehow one tower is not being served. maybe list by energy amount?
                        // or maybe check if target is storage, then check if towers are full first.
                        if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestTarget);
                            console.log(closestTarget);
                        }
                    }else{// we dont even got any thing to fill then check if we have a DROPOFF POINT
                        // console.log(Memory.rooms[creep.memory.homeRoom].energyDropoffs, ' <-------- ###### found this in memory');
                        for (let memObj in Memory.rooms[creep.memory.homeRoom].energyDropoffs) {
                            // console.log(' <------------------------- loggin memObj -------------------->');
                            // console.log(memObj, ' <------------------------- got this object from memory');
                            let x = Memory.rooms[creep.memory.homeRoom].energyDropoffs[memObj].x;
                            let y = Memory.rooms[creep.memory.homeRoom].energyDropoffs[memObj].y;
                            
                            // let dropOffPos = new RoomPosition(x, y, creep.memory.homeRoom);
                            // console.log(dropOffPos, ' dropoffPos old');
                            // let possibleConstructionSite    = Game.rooms[creep.memory.homeRoom].lookForAt(LOOK_CONSTRUCTION_SITES, dropOffPos);
                            // console.log(possibleConstructionSite, ' construction site?');
                            // if (possibleConstructionSite){
                            //     dropOffPos = new RoomPosition(x, (y + 1),  creep.memory.homeRoom);
                            //     console.log(dropOffPos, ' dropoffPos new');
                            // }
                            // console.log (dropOffPos, ' <---- ############# dropoffPos from courier');
                            if(!creep.pos.isEqualTo(dropOffPos)) {
                                creep.moveTo(dropOffPos);
                            }else if (creep.pos.isEqualTo(dropOffPos)) {
                                creep.drop(RESOURCE_ENERGY);
                            }
                            break; // only look for first item
                        }

                            
                    }

                }                

            // }

        }


        

        

          
    }

    // assignDroppedEnergyToPickup : function (creep) {
    //     if(creep.memory.assignedDrop)
    //         return console.log('have drop assigned already');
    //     // find all sources 
    //     let allDrops = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'dropped_energy');
    //     // console.log(allDrops, ' <---------- allDrops');
    //     // find a source that no creep has assigned
    //     for (let dropID of allDrops) {
    //         let courierHasDropAssigned = _.filter(Game.creeps, (creep) => 
    //                 creep.memory.assignedDrop == dropID && 
    //                 creep.memory.role == 'courier' &&
    //                 creep.ticksToLive > 40);            
    //         // set this drop as my assigned source           
    //         if (courierHasDropAssigned.length == 0) {
    //             if (creep.memory.assignedDrop == null) {
    //                 creep.memory.assignedDrop = dropID;    
    //             }
    //         }            
    //     }         
        
    // }
};

module.exports = roleCourier;