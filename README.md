# screeps
Screeps 

# 2Do things # 


Globals
- make a STATE for screeps where I can choose if its BUILDING time or ATTACK time or UPGRADE time
	- https://screepsworld.com/2017/09/screeps-tutorial-handling-creep-roles-with-a-state-machine/
- Creep levels https://github.com/Garethp/Screeps (see levels down below in the link)
- Put a emergency refill variable into Memory. When set true, all creep that got carry body part go to closest storage or container and refill spawn as well extensions
- Calcualte for each creep how much spawn time there is. then spawn a new creep accordingly

Modules
- Create new module: findNotFullStructures(structures[spawn,extension,tower,storage],prio[which structure do I like to get first?])

Attacker / Defender
- Implement ranged attack? archer?
- stay within ramparts if possible
- make ranked attack body parts (use cluster grenade style to harm close by ones)

Builder
- when nothing to build, assign upgrader role

Courier
- Make courier also deliver to towers when enemy is in room!
- Assign container when spawning - only once. not every tick
(- When available energy less than 500, then check for storages for energy and help distribute. dont go to containers. too slow!) This method is slowing down the energy harvesting. Need to find another method.

Miner
- Make a state for miners
- When there is link in the room, then make the miner also have carry body part to be able to drop energy into the link that is not directly beside him
- Early Miner idea: drop energy to floor and make miner have 1 carry body part https://hastebin.com/rajihumoji.js

Spawning
- before spawning new defenders, calculate amount of attack, heal parts in all enemy creeps. If higher than what my current defenders got, then only create a new defender

Tower
- need a code to handle healer attacks. When confronted with more than 3 healers, towers can't handle them
https://www.reddit.com/r/screeps/comments/4z8bz3/how_do_you_deal_with_healer_attacks/
https://www.reddit.com/r/screeps/comments/7d6w2t/offensive_strategy/
- Tower only repair close structures, let a repairer handle the rest?
- Tower only attack healers when less than 20 heal body parts or closer than 15 range
- Tower first repair ramparts then containers, roads etc.?
- when attackers to big to kill, instead repair the structures that they attack. get structures that are within in range 5 of attackers and then repair those

TowerCourier
- make it go refill extensions when not busy...


Repairer
- Save maximum hits for structures to be repaired in memory

Upgrader
- When available energy less than 500, then check for storages for energy and help distribute. dont go to containers. too slow!
- Check if controller is already set in memory!

Harvesting 
- actions.SelectSource : When closest source doesnt have energy then creeps just sit there and wait. need to implement some routine to check if closest resource has energy. if not look for another source.

new: Refiller
- Refilling Spawns and Extensions
- beginning form RCL 4 we can have a storage. Use new type creep to refill then.
- before that use dropped energy or containers???





# Creep States (thanks to Kamots from slack) #
- role
- originSpawn
- destRoom
- state (harvesting, upgrading, )
- homeRoomName
- previousRoom
- previousPosition {"x":11,"y":18,"roomName":"W54S19"}
- totalCarried
- nextDest


# Things to save into memory to save CPU #
1. Energy Sources (Sources, Drops, Containers, Storages)
2. Facilities that need energy (Spawn, Extensions, Towers, Labs)
3. Construction Sites (not needed!)
4. Repair Sites (maybe only get those every 10 ticks?)
5. Upgrade-Sites (Controller)

