/*Delivers from containers to other places*/

/*2DO: make courier also deliver to towers when enemy is in room!*/

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

            let currEnergyAvailable = Game.spawns.Spawn1.room.energyAvailable;
            // When available energy less than 500, then check for storages for energy and help distribute. dont go to containers. too slow!


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
            
            
            
            
            // if no containers assigned to me, then move to closest container 
            if (assignedContainer.length == 0) {
                // find closest container
                var closestContainer = creep.pos.findClosestByPath(allContainers);
                if(creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
                
                
                        
            } else {
                // when there is an assigned container
                // go withdraw energy
                if(creep.withdraw(assignedContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(assignedContainer[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
                
            }  
        } else { // if creep has energy and should deliver...
            // find all structures that need energy, list only those structures 
            // of which energy is less than max
            // 2Do: 
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // 2Do: because storage has huge storage, maybe make own creep for it?
                    return ( (  structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
                                structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
                                structure.structureType == STRUCTURE_TOWER       && structure.energy <= (structure.energyCapacity * 0.9) || 
                                structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)                                 
                            );
                }
            });
            //console.log(targets);
            // if there is structures which need energy, move!
            if(targets.length > 0) {
                let closestTarget = creep.pos.findClosestByPath(targets); // somehow one tower is not being served. maybe list by 
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }

          
    }
};

module.exports = roleCourier;