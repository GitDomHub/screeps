var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.servingContainer == null)
            roleMiner.assignContainer(creep);
        
        //find CONTAINER that is being served by the creep
        var targetContainer = Game.getObjectById[creep.memory.servingContainer];
        var container = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                        (structure.id == creep.memory.servingContainer) && 
                        (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
        
        // if nothing to do...
        if (container.length == 0) {
            creep.say('idle');
        }else {
            // when sitting on/near container
            if(creep.pos.getRangeTo(container[0]) == 0) {
                // now find closest ENERGY SOURCE
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                creep.harvest(source);
            } else { // when not sitting on/near container, then move there                
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }    
    },



    assignContainer : function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        }); // 2Do: only look for containers, that have a source in range 1 to it

        for (var container of containers ) {            
            //var allMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var minerHasContainerAssigned = _.filter(Game.creeps, (creep) => 
                    creep.memory.servingContainer == container.id && 
                    creep.memory.role == 'miner' &&
                    creep.ticksToLive > 40);            
           
            if (minerHasContainerAssigned.length == 0) {
                if (creep.memory.servingContainer == null) {
                    creep.memory.servingContainer = container.id;    
                }
            }            
        }   
    }



};

module.exports = roleMiner;