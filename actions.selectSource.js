var actionsGlobal = require('actions.global');
var actionChooseSource = {
    /**
    
        TODO:
        - take parameters for which source to prioritize/ignore
        - take parameter for target room(or maybe just get it from memory in creep)
        - only give back target ID, let creep move there. dont make creep move here!
    
     */
    
    run: function(creep, ignoreStrucs) {
        if(!ignoreStrucs) 
            var ignoreStrucs=[];


        /*----------  DROPOFF POINT  ----------*/
        // early game, when no storage yet
        // let dropOffPos                          = actionChooseSource.returnDropOffPoint(creep);
        let dropOff                             = actionChooseSource.returnEnergyDropOff(creep);
        
        console.log(dropOff, ' got this dropOff object');



        /*----------  DROPPED ENERGY  ----------*/
    
        //const droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES); 
        // let droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, 
        //                          {filter: (s) => s.amount > 100 && s.resourceType === RESOURCE_ENERGY});
        // let roomControlLevel = creep.room.controller.level;
        // console.log(roomControlLevel, ' <------------------------------------------------------------ RCL');
        // console.log(ignoreStrucs.includes('drops'), '<- will ignore drops?');
        // var droppedEnergyRes = actionChooseSource.returnDrops(creep);
        var droppedEnergyRes                    = 0;
        

        /*----------  STORAGE  ----------*/        
        let storages                            = actionChooseSource.returnStorage(creep);


        if(dropOff){
            console.log('going for dropOffsite');
            if(creep.pickup(dropOff) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropOff);
                creep.memory.targetId = dropOff.id;
                creep.memory.targetIdAction = 'pickup';
            }
        } else if (droppedEnergyRes /*&& !ignoreStrucs.includes('drops') */) { 
            // only go for that resource if no enemy creep is close by (otherwise I'll die u know)
            if(creep.pickup(droppedEnergyRes) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergyRes);
                // write target into memory (so that not all gathering creeps go there. especially if dropped energy is 
                // near room exit. will waste time.)
                // creep.memory.targetId = droppedEnergyRes.id;


            }
        }else if  (storages.length > 0) {
            // var storageUnit = creep.pos.findClosestByRange(storages); // can omit the search for closest, because in
            //  one room we only got 1 storage
            var storageUnit = storages[0];
            if(creep.withdraw(storageUnit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.targetId = storageUnit.id;
                creep.memory.targetIdAction = 'withdraw';
                // move there and get energy from there 
                creep.moveTo(storageUnit);    

            }
        } else {            
            /*----------  CONTAINERS  ----------*/
            
            // SECOND see if there are CONTAINERS that are not empty, PLUS have more enery than 250
            // making this bigger as 250 hopefully prevents creeps from turning back and forth because the container 
            // is always joggling between 0 and 30ish
            // also this would always leave 250 energy unused right?!?!
            // check if resource or container has enough energy to fill u up in one go
            
            var containers                         = actionChooseSource.returnContainers(creep);
            
            // if there are containers found that are not empty (and no storages)
            if(containers.length > 0 && storages.length == 0) {
                var container = creep.pos.findClosestByRange(containers);
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.memory.targetId = container.id;
                    creep.memory.targetIdAction = 'withdraw';
                    // move there and get energy from there 
                    creep.moveTo(container);                    
                }
            } else {
                /*----------  SOURCRES  ----------*/
                
                // THIRD: go to SOURCES
                // 2Do: when closest source doesnt have energy then creeps just sit there and wait. need to implement 
                // some routine to check if closest resource has energy. if not look for another
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.memory.targetId = source.id;
                    creep.memory.targetIdAction = 'harvest';
                    // make creep move and show its path
                    creep.moveTo(source);
                }
            }
        
        }
    },

    returnDrops: function (creep) {
        let droppedEnergyRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (s) =>  s.amount > 200 &&
                            s.resourceType === RESOURCE_ENERGY
        });
        // next only look in memory of there is dropped energy
        
        return droppedEnergyRes;

        
        // return all dropped energy from memory
        // for each look if 
    },


    returnStorage: function(creep) {
        // no need to FIND storage. can use room.storage
        let storages = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return ( s.structureType == STRUCTURE_STORAGE) &&
                            (s.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                            (s.store[RESOURCE_ENERGY] > 250);
            }
        });
        // just look at Room.storage
        var storage = creep.room.storage; // could also look at storage in HOME room?!
        // console.log(storage, ' <<<------- <<<----- having this storage in the room')
        return storages;
    },

    returnContainers: function(creep) {
        let containers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return ( s.structureType == STRUCTURE_CONTAINER) &&
                                (s.store[RESOURCE_ENERGY] >= creep.carryCapacity) && 
                                (s.store[RESOURCE_ENERGY] > 250) ;
                }
        }); 
        // get container ids from memory and then look for the amount of energy thats in there
        return containers;
    },

    returnEnergyDropOff : function (creep) {
        let dropOffId                          = actionsGlobal.ReturnEnergySourceIDs(creep.room.name, 'dropOff');
        console.log(dropOffId, '   ............. dropOffId');
        let dropOffObj                          = Game.getObjectById(dropOffId);
        return dropOffObj;
    }






};
module.exports = actionChooseSource;
