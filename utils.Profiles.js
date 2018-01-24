/*======================================
=            Creep Profiles            =
======================================*/

/**
  *
  * Miner - handling the pickup of energy and getting it to storages
  * 
  *	  	T1: MOVE*1,WORK*2,CARRY*1 ; 300E ; plain=2,3   road=1,2   swamp=10,15  
  *		T2: MOVE*2,WORK*4,CARRY*1 ; 550E ; plain=2,3   road=1,2   swamp=10,13  
  *		T3: MOVE*3,WORK*6,CARRY*1 ; 800E ; plain=2,3   road=1,2   swamp=10,12
  *
  */
exports.GetBody_Miner = GetBody_Miner;
function GetBody_Miner(tier) {
	if (tier > 3) tier = 3;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 1);
			body = AddToBody(body,[WORK], 2);
			break;
		case 2: 
			body = AddToBody(body, [MOVE], 2);  
			body = AddToBody(body, [WORK], 4);			
			break;
		case 3: 
			body = AddToBody(body, [MOVE], 3);  
			body = AddToBody(body, [WORK], 6);	
			break;	
		case 3: 
			body = AddToBody(body, [MOVE], 3);  
			body = AddToBody(body, [WORK], 6);	
			break;	
	}
	// alway have 1 carry body part
	body = AddToBody(body,[CARRY], 1);
	
    return body;
}
exports.GetMaxTier_Miner = GetMaxTier_Miner;
function GetMaxTier_Miner(energy){
	return GetMaxTier(energy, GetBody_Miner, 2);
}




 /**
  *
  * Backupharvesters - get spawned when nothing else goes. Have most simple body to sub for miners and couriers
  * 
  *	  	T1: MOVE*1,WORK*1,CARRY*1 ; 200E ; plain=1,2   road=1,1   swamp=5,10  
  *		T2: MOVE*2,WORK*1,CARRY*2 ; 300E ; plain=1,2   road=1,1   swamp=3,8   
  *
  */
exports.GetBody_BackupHarvester = GetBody_BackupHarvester;
function GetBody_BackupHarvester(tier) {
	if (tier > 2) tier = 2;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[WORK, MOVE, CARRY], 1);
			break;
		case 2: 
			body = AddToBody(body, [WORK], 1);
			body = AddToBody(body, [CARRY, MOVE], 2);  
			break;
	}
	
    return body;
}
exports.GetMaxTier_BackupHarvester = GetMaxTier_BackupHarvester;
function GetMaxTier_BackupHarvester(energy){
	return GetMaxTier(energy, GetBody_BackupHarvester, 2);
}

/*=====  End of Creep Profiles  ======*/




/*==============================================
=        Calculating Body Parts and Tiers      =
==============================================*/


function GetCostForBodyPart (bodypart) {
	switch (bodypart) {
		case TOUGH: 		return 10;
		case MOVE:  		return 50; 		
		case CARRY: 		return 50;
		case ATTACK: 		return 80;
		case WORK: 			return 100;
		case RANGED_ATTACK: return 150;
		case HEAL: 			return 250;
		case CLAIM: 		return 600;
		default: 			return 0;	// if enything else is the case
	}
}

function AddToBody(body, parts, count) {
	for (i = 0; i<count; i++) {
		for (let part of parts) {
			body.push(part);
		} 
	}
	return body;
}

function GetMaxTier(energy, bodyfunc, maxTier) {
	let tier = 0;
	let maxReached = false;
	for (let i = 0; !maxReached; i++) {
		let cost = GetCostForBodyPart(bodyfunc(i));
		if(cost > energy || i > maxTier) {
			maxReached = true;
		}else{
			tier = i;
		}
	}
	return tier;
}

function GetCostForFullBody(body) {
	let cost = 0;
	for (let bodyPart of body) {
		cost += GetCostForBodyPart(bodyPart)
	}
	return cost;
}

/*=====  End of Calculating Body Parts and Tiers  ======*/



