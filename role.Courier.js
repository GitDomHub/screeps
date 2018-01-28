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

            // backup for when there is no energy available. then let couriers do the job quicker
            // future: if storage has no energy, then just go back to containers
                    // let currEnergyAvailable = Game.spawns.Spawn1.room.energyAvailable;
                    // let currEnergyCapAvailable = Game.spawns.Spawn1.room.energyCapacityAvailable;

                    // if(currEnergyAvailable <= (currEnergyCapAvailable * 0.75) ) {
                    //    // go take energy from storage if energy in extensions and spawns is critical
                    //    var storages = actionsSelectSource.returnStorages(creep);
                    //    // only go to storage, if there is enough energy
                    //    if (storages.length > 0 && storages[0].store[RESOURCE_ENERGY] > creep.carryCapacity){
                    //         if(creep.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //             creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    //         }
                    //         return; // just go to source, nowhere else
                    //    }
                    // }

            
            // When available energy less than 1000, then check for storages for energy and help distribute. dont go to containers. too slow!
            

            // when not already close to a container if(!creep.pos.isNearTo(target)) {
            // find CONTAINERS in the room that:
            // - have at least 30% as much energy as creep can carry (makes it go early enough)
            // - have at least 250 energy 
            var allContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && 
                            (structure.store[RESOURCE_ENERGY] >= (creep.carryCapacity * 0.3) ) && 
                            (structure.store[RESOURCE_ENERGY] >= 250) ;
                }
            });
            var allContainerIDsFromMem = actionsGlobal.ReturnEnergySourceIDs(creep.memory.homeRoom, 'container');
            var allDroppedEnergyIDsFromMem = actionsGlobal.ReturnEnergySourceIDs(creep.memory.homeRoom, 'dropped_energy');

            //console.log('starting courier routine');
                        
                        // 2Do: do this at spawn only once
                        // for each container...
                        for (var container of allContainers ) {
                            var containerId = container.id;
                            var allCouriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier');
                            var couriersHavingContainerAssigned = _.filter(Game.creeps, (creep) =>
                                        creep.memory.servingContainer == containerId &&
                                        creep.memory.role == 'courier');
                            if (couriersHavingContainerAssigned.length == 0) {
                                if (creep.memory.servingContainer == null || creep.memory.servingContainer == '') {
                                    creep.memory.servingContainer = containerId;    
                                }
                            } 
                        }
                        
                        //find CONTAINER that is being served by the creep
                        var targetContainer = Game.getObjectById[creep.memory.servingContainer];// maybe useless?
                        var assignedContainer = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER) && (structure.id == creep.memory.servingContainer);
                            }
                        });
            
            
            
            
            // if no containers assigned to me, then pickup dropped energy and drop it into spawn.
            if (assignedContainer.length == 0) {
                // check if creep has dropped energy resource written into memory
                if(creep.memory.assignedDrop){
                    let dropObj = Game.getObjectById(creep.memory.assignedDrop);
                    if(dropObj && dropObj.amount > 200 && dropObj.resourceType == RESOURCE_ENERGY){
                        if(creep.pickup(dropObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropObj);
                        }    
                    }else if(!dropObj || dropObj.amount < 50){
                        delete creep.memory.assignedDrop;
                        creep.say('deleted drop');
                    }
                    

                }else{
                    roleCourier.assignDroppedEnergyToPickup(creep);
                }
                
                // // find closest container
                // var closestContainer = creep.pos.findClosestByRange(allContainers);
                
                // if(creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(closestContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                // }
                
                
                
                        
            } else {
                // when there is an assigned container
                // go withdraw energy
                if(creep.withdraw(assignedContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(assignedContainer[0]);
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
                        console.log(Memory.rooms[creep.memory.homeRoom].energyDropoffs, ' <-------- ###### found this in memory');
                        if (Object.keys(Memory.rooms[creep.memory.homeRoom].energyDropoffs).length > 0) {
                            for (let memObj in Memory.rooms[creep.memory.homeRoom].energyDropoffs) {
                                console.log(memObj, ' <------------------------- got this object from memory');
                                let dropOffPos = new RoomPosition(memObj['x'], memObj['y'], creep.memory.homeRoom);
                                console.log (dropOffPos, ' <---- ############# dropoffPos from courier');
                                break; // only look for first item
                            }
                            
                        }

                    }
                }

            // }

        }

          
    },

    assignDroppedEnergyToPickup : function (creep) {
        if(creep.memory.assignedDrop)
            return console.log('have drop assigned already');
        // find all sources 
        let allDrops = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'dropped_energy');
        console.log(allDrops, ' <---------- allDrops')
        // find a source that no creep has assigned
        for (let dropID of allDrops) {
            let courierHasDropAssigned = _.filter(Game.creeps, (creep) => 
                    creep.memory.assignedDrop == dropID && 
                    creep.memory.role == 'courier' &&
                    creep.ticksToLive > 40);            
            // set this drop as my assigned source           
            if (courierHasDropAssigned.length == 0) {
                if (creep.memory.assignedDrop == null) {
                    creep.memory.assignedDrop = dropID;    
                }
            }            
        }         
        
    }
};

module.exports = roleCourier;