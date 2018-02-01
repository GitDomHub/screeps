/**

	TODO:
	- find all sources in room
	- see how many screeps are serving each source
	- calculate amount of WORK body parts per assigned source
	- if less than 5 work parts for mining plus one for repairing container, create new creep with as many work parts to reach 6

 */

/*----------  Globals  ----------*/
require('vars.global');
/*----------  Utils  ----------*/
var ProfileUtils = require('utils.Profiles'); 
/*----------  Actions  ----------*/
var actionsGlobal = require('actions.global');


var MiningManager = {
	findAllSourcesInRoom : function (roomName) {
		// get from memory
		let sources 						= actionsGlobal.ReturnEnergySourceIDs(roomName, 'source');

		
	},

	returnWorkPartsPerSource : function (sourceId) {
            let creepsServingSource = _.filter(Game.creeps, (creep) => 
                    creep.memory.assignedSource == sourceID && 
                    creep.memory.role == 'miner' &&
                    creep.ticksToLive > 40);            
            for (creep of creepsServingSource) {
            	
            	// calculate amount of WORK body parts per assigned source
            	let parts = ProfileUtils.CountBodyParts(creep.body, 'work'); // http://docs.screeps.com/api/#Creep.body
				

				// An array describing the creep’s body. Each element contains the following properties:

				// parameter	type	description
				// boost	string | undefined	
				// If the body part is boosted, this property specifies the mineral type which is used for boosting. One of the RESOURCE_* constants. Learn more

				// type	string	
				// One of the body part types constants.

				// hits	number	
				// The remaining amount of hit points of this body part.
            }

            // - if less than 5 work parts for mining plus one for repairing container, create new creep with as many work parts to reach 6

            // set this source as my assigned source           
            if (minerHasSourceAssigned.length == 0) {
                if (creep.memory.assignedSource == null) {                    
                    creep.memory.assignedSource = sourceID;    
                }
            }           
	}

}