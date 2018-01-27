var actionsGlobal = require('actions.global');
var roleMiner = {

    /**
    
        TODO:
        - make miner get an assigned SOURCE instead of container. look for container NEAR source. if 
    
     */
    

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.assignedSource == null || creep.memory.assignedSource == '')        
            roleMiner.assignSourceToHarvest(creep);

        if (creep.memory.servingContainer == null || creep.memory.servingContainer == '' )
            //roleMiner.assignContainer(creep);
            roleMiner.assignContainerAdjacentToSource(creep);
        
        
        
        //find CONTAINER that is being served by the creep
        let targetContainer = Game.getObjectById(creep.memory.servingContainer);
        let targetSource = Game.getObjectById(creep.memory.assignedSource);

        var container = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                        (structure.id == creep.memory.servingContainer) && 
                        (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
        
        if (!targetSource)
            return console.log(' ERROR: MINER HAS NO ASSIGNED SOURCE');

        // if container assigned(and source of course), first move to container
        if (targetContainer && targetSource) {
            if(creep.pos.getRangeTo(targetContainer) == 0) {
                creep.harvest(targetSource); 
                // if container full, then drop energy to floor
                if (_.sum(creep.carry) == creep.carryCapacity || targetSource.energy == 0) // also drop energy if source is empty (makes courier maybe go back earlier)                    
                    creep.drop(RESOURCE_ENERGY);                               
            }else{
                creep.moveTo(targetContainer);
            }
        }else if(!targetContainer && targetSource) { // if no container, just harvest source
            if(creep.harvest(targetSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource);
            }else{ // harvesting works
                if (_.sum(creep.carry) == creep.carryCapacity || targetSource.energy == 0) // also drop energy if source is empty (makes courier maybe go back earlier)                    
                    creep.drop(RESOURCE_ENERGY);                               
            }

        }        
        



        // // if nothing to do...
        // if (container.length == 0) {
        //     creep.say('idle(link?)');
        //     roleMiner.transferEnergyToAdjacentLink(creep);
        // }else {
        //     // when sitting on/near container
        //     if(creep.pos.getRangeTo(container[0]) == 0) {
        //         // now find closest ENERGY SOURCE
        //         //var source = creep.pos.findClosestByRange(FIND_SOURCES); // 2Do: write source into miners memory to save cpu
        //         let source = targetSource;
        //         creep.harvest(source);
        //         if (_.sum(creep.carry) == creep.carryCapacity || source.energy == 0) // also drop energy if source is empty (makes courier maybe go back earlier)                    
        //             creep.drop(RESOURCE_ENERGY);                
        //     } else { // when not sitting on/near container, then move there                
        //         creep.moveTo(container[0]);
        //     }
        // }   






    },



    assignContainer : function (creep) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        }); // 2Do: only look for containers, that have a source in range 1 to it

        for (let container of containers ) {            
            //var allMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            let minerHasContainerAssigned = _.filter(Game.creeps, (creep) => 
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

    assignContainerAdjacentToSource : function (creep) {
        let containers = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'container');
        console.log(containers, ' <-------------------------- container ids from memory');
        for (var containerID of containers ) { 
            let container = Game.getObjectById(containerID);      
            console.log(container, ' <-------------------------- container object');
            var minerHasContainerAssigned = _.filter(Game.creeps, (creep) => 
                    creep.memory.servingContainer == containerID && 
                    creep.memory.role == 'miner' &&
                    creep.ticksToLive > 40);            
           console.log(minerHasContainerAssigned, ' <-------------------------- container assigned to as many creeps');
            if (minerHasContainerAssigned.length == 0) {
                if (creep.memory.servingContainer == null) {
                    // get source object
                    let source = Game.getObjectById(creep.memory.assignedSource);
                    // look if container is close to my assigned source
                    let isClose = source.pos.isNearTo(container);
                    console.log(isClose, ' <-------------------------- container is close to source. assigning it now.');
                    creep.memory.servingContainer = containerID; 
                    console.log(creep.memory.servingContainer, ' <-------------------------- creep.memory.servingContainer');   
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