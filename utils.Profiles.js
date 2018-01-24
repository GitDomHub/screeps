/*======================================
=            Creep Profiles            =
======================================*/


/**
  *
  * Upgrader - handling the pickup of energy and getting it to storages
  * 
  *	  	T1: MOVE*2,WORK*1,CARRY*2 ;  300E  ; plain=1,2   road=1,1   swamp=3,8  
  *		T2: MOVE*3,WORK*3,CARRY*2 ;  550E  ; plain=1,2   road=1,1   swamp=5,10  
  *		T3: MOVE*4,WORK*4,CARRY*4 ;  800E  ; plain=1,2   road=1,1   swamp=5,10  
  *		T4: MOVE*7,WORK*6,CARRY*7 ; 1.300E ; plain=1,2   road=1,1   swamp=5,10 
  *		T5: MOVE*9,WORK*8,CARRY*10 ; 1.750E ; plain=1,2   road=1,1   swamp=4,9 
  *		T6: MOVE*6,WORK*6,CARRY*6 ; 1.200E ; plain=1,2   road=1,1   swamp=5,10 
  *
  */
exports.GetBody_Upgrader = GetBody_Upgrader;
function GetBody_Upgrader(tier) {
	if (tier > 6) tier = 6;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[WORK], 1);
			body = AddToBody(body,[CARRY], 1);
			break;
		case 2: 
			body = AddToBody(body, [MOVE], 3);  
			body = AddToBody(body, [WORK], 3);			
			body = AddToBody(body,[CARRY], 2);
			break;
		case 3: 
			body = AddToBody(body, [MOVE], 4);  
			body = AddToBody(body, [WORK], 4);
			body = AddToBody(body,[CARRY], 4);	
			break;
		case 4: 
			body = AddToBody(body, [MOVE], 7);  
			body = AddToBody(body, [WORK], 6);
			body = AddToBody(body,[CARRY], 7);	
			break;	
		case 5: 	
			body = AddToBody(body, [MOVE], 9);  
			body = AddToBody(body, [WORK], 8);
			body = AddToBody(body,[CARRY], 10);	
			break;
		case 6: 	
			body = AddToBody(body, [MOVE], 12);  
			body = AddToBody(body, [WORK], 11);
			body = AddToBody(body,[CARRY], 12);	
			break;
	}
    return body;
}
exports.GetMaxTier_Upgrader = GetMaxTier_Upgrader;
function GetMaxTier_Upgrader(energy){
	return GetMaxTier(energy, GetBody_Upgrader, 6);
}



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
	}
	// alway have 1 carry body part
	body = AddToBody(body,[CARRY], 1);
	
    return body;
}
exports.GetMaxTier_Miner = GetMaxTier_Miner;
function GetMaxTier_Miner(energy){
	return GetMaxTier(energy, GetBody_Miner, 3);
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





/*=================================================
=            Supplementary Information            =
=================================================*/


/* RCL	Energy to upgrade	Structures
	0	—					Roads, 5 Containers
	1	200					Roads, 5 Containers, 1 Spawn
	2	45,000				Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
	3	135,000				Roads, 5 Containers, 1 Spawn, 10 Extensions (50 capacity), Ramparts (1M max hits), Walls, 1 Tower
	4	405,000				Roads, 5 Containers, 1 Spawn, 20 Extensions (50 capacity), Ramparts (3M max hits), Walls, 1 Tower, Storage
	5	1,215,000			Roads, 5 Containers, 1 Spawn, 30 Extensions (50 capacity), Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
	6	3,645,000			Roads, 5 Containers, 1 Spawn, 40 Extensions (50 capacity), Ramparts (30M max hits), Walls, 2 Towers, Storage, 3 Links, Extractor, 3 Labs, Terminal
	7	10,935,000			Roads, 5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, Storage, 4 Links, Extractor, 6 Labs, Terminal
	8	—					Roads, 5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
*/

/*=====  End of Supplementary Information  ======*/

