
var DepositStructures = {
    'sp' : 'STRUCTURE_SPAWN',
    'ex' : 'STRUCTURE_EXTENSION',
    'co' : 'STRUCTURE_CONTAINER',
    'to' : 'STRUCTURE_TOWER',
    'st' : 'STRUCTURE_STORAGE'
}

var actionFindDepositStruc = {

	returnDepositStruc : function (creep, abbreviation_array, closest = false) {
		var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (  (structure.structureType == STRUCTURE_EXTENSION   && structure.energy < structure.energyCapacity ||
                           structure.structureType == STRUCTURE_SPAWN       && structure.energy < structure.energyCapacity ||
                           structure.structureType == STRUCTURE_CONTAINER   && structure.store[RESOURCE_ENERGY] <= structure.storeCapacity ||
                           structure.structureType == STRUCTURE_STORAGE     && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                        );
            }
        });
        return targets;
	}
};

modules.exports = actionFindDepositStruc;





// returnTowers : function (closestByPath = false) {

// },

// returnContainers : function (closestByPath = false) {

// },

// returnSpawnsAndExtensions : function (closestByPath =false) {

// },
// returnStorages : function (closestByPath = false) {

// }