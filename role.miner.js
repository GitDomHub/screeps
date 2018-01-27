var actionsGlobal = require('actions.global');
var roleMiner = {

    /**
    
        TODO:
        - make miner get an assigned SOURCE instead of container. look for container NEAR source. if 
    
     */
    

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.assignedSource == null)        
            roleMiner.assignSourceToHarvest(creep);

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
            creep.say('link');
            roleMiner.transferEnergyToAdjacentLink(creep);
        }else {
            // when sitting on/near container
            if(creep.pos.getRangeTo(container[0]) == 0) {
                // now find closest ENERGY SOURCE
                var source = creep.pos.findClosestByRange(FIND_SOURCES); // 2Do: write source into miners memory to save cpu
                creep.harvest(source);
                if (_.sum(creep.carry) == creep.carryCapacity || source.energy == 0) // also drop energy if source is empty (makes courier maybe go back earlier)                    
                    creep.drop(RESOURCE_ENERGY);                
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
    },
    
    assignSourceToHarvest : function (creep) {
        // find all sources
        let allSources = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'source');
        console.log(allSources, ' <--- allSources')
        // find a source that no creep has assigned
        for (sourceID of allSources) {
            //var allMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var minerHasSourceAssigned = _.filter(Game.creeps, (creep) => 
                    creep.memory.assignedSource == sourceID && 
                    creep.memory.role == 'miner' &&
                    creep.ticksToLive > 40);            
            // set this source as my assigned source           
            if (minerHasSourceAssigned.length == 0) {
                if (creep.memory.assignedSource == null) {
                    creep.memory.assignedSource = sourceID;    
                }
            }            
        }         
        
    },

    transferEnergyToAdjacentLink : function (creep) {
        //first look in memory
        if(creep.memory.servingLink) {
            let linkObj = Game.getObjectById(creep.memory.servingLink);
            if(linkObj && creep.pos.isNearTo(linkObj)) {
                let result = creep.transfer(linkObj, RESOURCE_ENERGY);
                console.log(result, '   <---  tranfer to link result')
            }
        }else {
            // write all links from memory into array
            let allLinks = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'link');
            for (linkID of allLinks){
                let linkObj = Game.getObjectById(linkID);
                // first look for link within range next to me
                if(linkObj && creep.pos.isNearTo(linkObj)) {
                    //write closest link in memory so we dont have to look for it next time
                    creep.memory.servingLink = linkID;
                    let result = creep.transfer(linkObj, RESOURCE_ENERGY);
                    console.log(result, '   <---  tranfer to link result')
                }
            }
        }
        
    }



};

module.exports = roleMiner;