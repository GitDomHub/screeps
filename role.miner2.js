var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // find CONTAINERS in the room that have not full energy
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        
        // for each container...
        for (var container of containers ) {
            // get container ID
            var containerId = container.id;
                //console.log('container id: ' + containerId);
            
            var allMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var minerHasContainerAssigned = _.filter(Game.creeps, (creep) => 
                    creep.memory.servingContainer == containerId && 
                    creep.memory.role == 'miner');
                //console.log('container assigned to: ' + minerHasContainerAssigned);
            
            // if this container isnt assigned to any creep yet
            if (minerHasContainerAssigned.length == 0) {
                //console.log('found unassigned container');
                //first check if creep already serving a container
                if (creep.memory.servingContainer == null) {
                    //console.log('assigning container to miner creep');
                    // assign it to this current creep if he isnt serving a container yet
                    creep.memory.servingContainer = containerId;    
                }
            }
        }
        
        //find CONTAINER that is being served by the creep
        var targetContainer = Game.getObjectById[creep.memory.servingContainer];
        var container = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && (structure.id == creep.memory.servingContainer) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
        
        // if nothing to do...
        if (container.length == 0) {
            creep.say('idle');
        }else {
            // when there is a container not full
            // when sitting on/near container
            if(creep.pos.getRangeTo(container[0]) == 0) {
                // now find closest ENERGY SOURCE
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                // start harvesting from there
                creep.harvest(source);
            } else {
                // when not sitting on/near container, then move there
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }    
    }
};

module.exports = roleMiner;