var actionChooseSource = {
    // @param {Creep} creep /
    // 2Do: take parameters for which source to prioritize/ignore
    run: function(creep) {

        //2Do: decide between storage and container, maybe decide on distance  traveled

        // FIRST see if storage has enough energy
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ( structure.structureType == STRUCTURE_STORAGE) &&
                            (structure.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                            (structure.store[RESOURCE_ENERGY] > 0) ;
            }
        });
        
        if (storages.length > 0) {
            var storageUnit = creep.pos.findClosestByPath(storages);
            if(creep.withdraw(storageUnit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move there and get energy from there 
                creep.moveTo(storageUnit, {visualizePathStyle: {stroke: '#ffaa00'}});
                // get creep name
                // get container ID
                
            }
        } else {            
            // SECOND see if there are CONTAINERS that are not empty, PLUS have more enery than 250
            // making this bigger as 250 hopefully prevents creeps from turning back and forth because the container is always joggling between 0 and 30ish
            // also this would always leave 250 energy unused right?!?!
            // check if resource or container has enough energy to fill u up in one go
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ( structure.structureType == STRUCTURE_CONTAINER) &&
                                (structure.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                                (structure.store[RESOURCE_ENERGY] > 250) ;
                }
            });
            
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
    }   




};
module.exports = actionChooseSource;