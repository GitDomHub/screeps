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


/*======================================
=            Creep Profiles            =
======================================*/





/**
  *
  * Builder 
  *  	- cheaper than tower for far away repairs	  
  *
  * 							  Buidling
  *	  	T1: MOVE*2,WORK*1,CARRY*2 ; 5/T ; 	 
  *	  	T2: MOVE*3,WORK*2,CARRY*4 ; 10/T ;
  *	  	T3: MOVE*7,WORK*7,CARRY*5 ; 35/T ; 
  *	  	
  *	
  *
  */
exports.GetBody_Builder = GetBody_Builder;
function GetBody_Builder(tier) {
	if (tier > 3) tier = 3;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[WORK], 1);
			body = AddToBody(body,[CARRY], 2);
			break;
		case 2: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[WORK], 2);
			body = AddToBody(body,[CARRY], 4);
			break;
		case 3: 
			body = AddToBody(body,[MOVE], 7);
			body = AddToBody(body,[WORK], 7);
			body = AddToBody(body,[CARRY], 5);
			break;
	}
    return body;
}
exports.GetMaxTier_Builder = GetMaxTier_Builder;
function GetMaxTier_Builder(energy){
	return GetMaxTier(energy, GetBody_Builder,3);
}




/**
  *
  * Repairer 
  *  	- cheaper than tower for far away repairs	  
  *
  * 							  Repairing
  *	  	T1: MOVE*2,WORK*1,CARRY*2 ; 100/T ; 	
  *	  	T2: MOVE*3,WORK*2,CARRY*4 ; 200/T ; 
  *	  	T3: MOVE*4,WORK*4,CARRY*4 ; 400/T ;
  *	  	T4: MOVE*7,WORK*6,CARRY*7 ; 600/T ; 
  *	  	
  *	
  *
  */
exports.GetBody_Repairer = GetBody_Repairer;
function GetBody_Repairer(tier) {
	if (tier > 4) tier = 4;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[CARRY], 1);
			body = AddToBody(body,[CARRY], 2);
			break;
		case 2: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[CARRY], 2);
			body = AddToBody(body,[CARRY], 4);
			break;
		case 3: 
			body = AddToBody(body,[MOVE], 4);
			body = AddToBody(body,[CARRY], 4);
			body = AddToBody(body,[CARRY], 4);
			break;
		case 4: 
			body = AddToBody(body,[MOVE], 7);
			body = AddToBody(body,[CARRY], 6);
			body = AddToBody(body,[CARRY], 7);
			break;
	}
    return body;
}
exports.GetMaxTier_Repairer = GetMaxTier_Repairer;
function GetMaxTier_Repairer(energy){
	return GetMaxTier(energy, GetBody_Repairer,4);
}



/**
  *
  * Refiller 
  * 	- refills spawns and extensions from storage 
  * 	- works after RCL 4 with storages
  * 	- before : need to collect energy from different source. 
  * 						 
  *	  	T1: MOVE*3,CARRY*6 ; plain=1,2   road=1,1   swamp=1,10 
  *	  	
  *	  	 
  *
  */
exports.GetBody_Refiller = GetBody_Refiller;
function GetBody_Refiller(tier) {
	if (tier > 1) tier = 1;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[CARRY], 6);
			break;
	}
    return body;
}
exports.GetMaxTier_Refiller = GetMaxTier_Refiller;
function GetMaxTier_Refiller(energy){
	return GetMaxTier(energy, GetBody_Refiller,1);
}

/**
  *
  * Harvester - can harvest source and deliver to everywhere
  *
  * 						 			  Harvest
  *	  	T1: MOVE*2,WORK*1,CARRY*1 ; 250E ; 2/T
  *	  	T2: MOVE*2,WORK*1,CARRY*2 ; 300E ; 2/T
  *	  	T3: MOVE*3,WORK*2,CARRY*1 ; 400E ; 4/T
  *	  	T4: MOVE*3,WORK*3,CARRY*2 ; 550E ; 6/T
  *	  	T5: MOVE*4,WORK*4,CARRY*4 ; 800E ; 8/T
  *	  	 
  *
  */
exports.GetBody_Harvester = GetBody_Harvester;
function GetBody_Harvester(tier) {
	if (tier > 4) tier = 4;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[WORK], 1);
			body = AddToBody(body,[CARRY], 1);
			
			break;
		case 2: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[WORK], 2);
			body = AddToBody(body,[CARRY], 1);
			break;
		case 3: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[WORK], 2);
			body = AddToBody(body,[CARRY], 1);
			break;
		case 4: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[WORK], 3);
			body = AddToBody(body,[CARRY], 2);
			break;
		case 4: 
			body = AddToBody(body,[MOVE], 4);
			body = AddToBody(body,[WORK], 4);
			body = AddToBody(body,[CARRY], 4);
			break;

	}
    return body;
}
exports.GetMaxTier_Harvester = GetMaxTier_Harvester;
function GetMaxTier_Harvester(energy){
	return GetMaxTier(energy, GetBody_Harvester,4);
}



/**
  *
  * TowerCourier - deliverung to towers only
  * 						 
  *	  	T1: MOVE*1,CARRY*1 ; 100E ; 50carry ; plain=1,1   road=1,1   swamp=1,5 
  *
  */
exports.GetBody_TowerCourier = GetBody_TowerCourier;
function GetBody_TowerCourier(tier) {
	if (tier > 1) tier = 1;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 1);
			body = AddToBody(body,[CARRY], 1);
			break;
	}
    return body;
}
exports.GetMaxTier_TowerCourier = GetMaxTier_TowerCourier;
function GetMaxTier_TowerCourier(energy){
	return GetMaxTier(energy, GetBody_TowerCourier,1);
}



/**
  *
  * Courier - deliverung from drop or container to central storage/droppoffpoint
  * 						 
  *	  	T1: MOVE*3,CARRY*3 ; 300E ; 150carry ; plain=1,1   road=1,1   swamp=1,5 
  *		T2: MOVE*5,CARRY*5 ; 500E ; 250carry ; plain=1,1   road=1,1   swamp=1,5
  *		T3: MOVE*3,CARRY*8 ; 600E ; 400carry ; plain=1,2   road=1,1   swamp=1,10
  *
  */
exports.GetBody_Courier = GetBody_Courier;
function GetBody_Courier(tier) {
	if (tier > 3) tier = 3;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 3);
			body = AddToBody(body,[CARRY], 3);
			break;
		case 2: 
			body = AddToBody(body, [MOVE], 5);  
			body = AddToBody(body,[CARRY], 5);
			break;
		case 3: 
			body = AddToBody(body, [MOVE], 4);
			body = AddToBody(body,[CARRY], 8);
			break;
	}
    return body;
}
exports.GetMaxTier_Courier = GetMaxTier_Courier;
function GetMaxTier_Courier(energy){
	return GetMaxTier(energy, GetBody_Courier,3);
}


/**
  *
  * Defender
  * 						 Energy Health	Attack
  *	  	T1: MOVE*2,ATTACK*2 ; 260E ; 400H ; 60k/T
  *		T2: MOVE*4,ATTACK*4 ; 520E ; 800H ; 120k/T
  *		T3: MOVE*6,ATTACK*6 ; 780E ; 1.200H ; 180k/T
  *		T4: MOVE*9,ATTACK*9 ; 1.170E ; 1.800H ; 270k/T
  *		T5: MOVE*13,ATTACK*13 ; 1.690E ; 2.600H ; 390k/T
  *		T6: MOVE*17,ATTACK*17 ; 2.210E ; 3.400H ; 510k/T
  *
  */
exports.GetBody_Defender = GetBody_Defender;
function GetBody_Defender(tier) {
	if (tier > 6) tier = 6;
	let body = [];
	switch (tier) {
		case 1: 
			body = AddToBody(body,[MOVE], 2);
			body = AddToBody(body,[ATTACK], 2);
			break;
		case 2: 
			body = AddToBody(body, [MOVE], 4);  
			body = AddToBody(body,[ATTACK], 4);
			break;
		case 3: 
			body = AddToBody(body, [MOVE], 6);  
			body = AddToBody(body,[ATTACK], 6);
			break;
		case 4: 
			body = AddToBody(body, [MOVE], 9);  
			body = AddToBody(body,[ATTACK], 9);
			break;	
		case 5: 	
			body = AddToBody(body, [MOVE], 13);  
			body = AddToBody(body,[ATTACK], 13);
			break;
		case 6: 	
			body = AddToBody(body, [MOVE], 17);  
			body = AddToBody(body,[ATTACK], 17);
			break;
	}
    return body;
}
exports.GetMaxTier_Defender = GetMaxTier_Defender;
function GetMaxTier_Defender(energy){
	return GetMaxTier(energy, GetBody_Defender, 6);
}




/**
  *
  * Upgrader
  * 
  *	  	T1: MOVE*2,WORK*1,CARRY*2 ;  300E  ; plain=1,2   road=1,1   swamp=3,8  ;  1.000/T
  *		T2: MOVE*3,WORK*3,CARRY*2 ;  550E  ; plain=1,2   road=1,1   swamp=5,10 ;  3.000/T
  *		T3: MOVE*4,WORK*4,CARRY*4 ;  800E  ; plain=1,2   road=1,1   swamp=5,10 ;  4.000/T
  *		T4: MOVE*7,WORK*6,CARRY*7 ; 1.300E ; plain=1,2   road=1,1   swamp=5,10 ;  6.000/T
  *		T5: MOVE*9,WORK*8,CARRY*10 ; 1.750E ; plain=1,2   road=1,1   swamp=4,9 ;  8.000/T
  *		T6: MOVE*12,WORK*11,CARRY*12 ; 2.300E ; plain=1,2   road=1,1   swamp=5,10 ; 11.000/T
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
  * 							   Harvest
  *	  	T1: MOVE*1,WORK*2,CARRY*1 ; 4/T ; 300E ; plain=2,3   road=1,2   swamp=10,15  
  *		T2: MOVE*2,WORK*4,CARRY*1 ; 8/T ; 550E ; plain=2,3   road=1,2   swamp=10,13  
  *		T3: MOVE*3,WORK*5,CARRY*1 ; 10/T ; 700E ; plain=2,2   road=1,1   swamp=9,10
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
			body = AddToBody(body,[CARRY], 1);
			break;
		case 2: 
			body = AddToBody(body, [MOVE], 2);  
			body = AddToBody(body, [WORK], 4);
			body = AddToBody(body,[CARRY], 1);			
			break;
		case 3: 
			body = AddToBody(body, [MOVE], 3);  
			body = AddToBody(body, [WORK], 5);
			body = AddToBody(body,[CARRY], 1);	
			break;	
	}
	
	
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
	for (let i = 0; i<count; i++) {
		for (let part of parts) {
			body.push(part);
		} 
	}
	return body;
}

function GetMaxTier(energy, bodyfunc, maxTier) {
	// console.log(energy, ' <-------- got this energy in func');
	// console.log(bodyfunc, ' <-------- got this bodyfunc in func');
	// console.log(maxTier, ' <-------- got this maxTier in func');
	let tier = 0;
	let maxReached = false;
	for (let i = 0; !maxReached; i++) {
		let cost = GetCostForFullBody(bodyfunc(i));
		// console.log(cost, ' <----------------------- is current cost');
		// console.log(energy, ' <----------------------- is max energy');
		// console.log(i, ' <----------------------- current tier');
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







