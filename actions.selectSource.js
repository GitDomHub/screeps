var actionChooseSource = {
    // @param {Creep} creep /
    // 2Do: take parameters for which source to prioritize/ignore
    // 2Do: take parameter for target room(or maybe just get it from memory in creep)
    run: function(creep) {

        //2Do: decide between storage and container, maybe decide on distance  traveled
        //const droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES); // replace with DROPPED_RESOURCES??
        // let droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (s) => s.amount > 100 && s.resourceType === RESOURCE_ENERGY});
        // var droppedEnergyRes = returnDrops(creep);
        // FIRST see if storage has enough energy
        // var storages = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return ( structure.structureType == STRUCTURE_STORAGE) &&
        //                     (structure.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
        //                     (structure.store[RESOURCE_ENERGY] > 250);
        //     }
        // });
        var storages = actionChooseSource.returnStorages(creep);

        
        if(droppedEnergyRes) { // only go for that resource if no enemy creep is close by (otherwise I'll die u know)
            if(creep.pickup(droppedEnergyRes) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergyRes, {visualizePathStyle: {stroke: '#ffaa00'}});
                // write target into memory (so that not all gathering creeps go there. especially if dropped energy is near room exit. will waste time.)
                creep.memory.targetId = droppedEnergyRes.id;


            }
        }else if  (storages.length > 0) {
            var storageUnit = creep.pos.findClosestByPath(storages);
            if(creep.withdraw(storageUnit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move there and get energy from there 
                creep.moveTo(storageUnit, {visualizePathStyle: {stroke: '#ffaa00'}});                
            }
        } else {            
            // SECOND see if there are CONTAINERS that are not empty, PLUS have more enery than 250
            // making this bigger as 250 hopefully prevents creeps from turning back and forth because the container is always joggling between 0 and 30ish
            // also this would always leave 250 energy unused right?!?!
            // check if resource or container has enough energy to fill u up in one go
            // var containers = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return ( structure.structureType == STRUCTURE_CONTAINER) &&
            //                     (structure.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
            //                     (structure.store[RESOURCE_ENERGY] > 250) ;
            //     }
            // });
            var containers = returnContainers(creep);
            
            // if there are containers found that are not empty (and no storages)
            if(containers.length > 0 && storages.length == 0) {
                var container = creep.pos.findClosestByPath(containers);
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move there and get energy from there 
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});                    
                }
            } else {
                // THIRD: go to SOURCES
                // 2Do: when closest source doesnt have energy then creeps just sit there and wait. need to implement some routine to check if closest resource has energy. if not look for another
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // make creep move and show its path
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        
        }
        // MOVE END
    },

    returnDrops: function (creep) {
        return droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (s) =>  s.amount > 100 &&
                            s.resourceType === RESOURCE_ENERGY
        });
    },


    returnStorages: function(creep) {
        return storages = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return ( s.structureType == STRUCTURE_STORAGE) &&
                            (s.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                            (s.store[RESOURCE_ENERGY] > 250);
            }
        });
    },

    returnContainers: function(creep) {
        return containers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return ( s.structureType == STRUCTURE_CONTAINER) &&
                                (s.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                                (s.store[RESOURCE_ENERGY] > 250) ;
                }
        }); 
    },

    goToSource: function (destination) {
        // dropped: pickup
        // if(destination.structureType == )
        // storage: withdraw
        // container: withdraw
        // source: harvest

    },






};
module.exports = actionChooseSource;
