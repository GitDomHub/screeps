# screeps
Screeps 

Changelog:
180107 
	- Emojis seem to be broken after being pulled synced from github into screeps. Some guy on Slack suggested to use String.fromCodePoint(). Is it worth to get all the codes for just the looks? Idk...



2Do things:


Globals
- store sources in a room into some memory 
- store minimum creeps into spawn memory
- make a STATE for screeps where I can choose if its BUILDING time or ATTACK time or UPGRADE time
	- https://screepsworld.com/2017/09/screeps-tutorial-handling-creep-roles-with-a-state-machine/
- Creep levels https://github.com/Garethp/Screeps (see levels down below in the link)

Courier
- 2DO: make courier also deliver to towers when enemy is in room!

Builder
- when nothing to build, assign upgrader role

Miner
- Make a state for miners
- When there is link in the room, then make the miner also have carry body part to be able to drop energy into the link that is not directly under him
- Early Miner idea: drop energy to floor and make miner have 1 carry body part https://hastebin.com/rajihumoji.js

Tower
- need a code to handle healer attacks. When confronted with more than 3 healers, towers can't handle them
https://www.reddit.com/r/screeps/comments/4z8bz3/how_do_you_deal_with_healer_attacks/
https://www.reddit.com/r/screeps/comments/7d6w2t/offensive_strategy/





Creep States (thanks to Kamots from slack)
	- role
	- originSpawn
	- destRoom
	- state (harvesting, upgrading, )
	- homeRoomName
	- previousRoom
	- previousPosition {"x":11,"y":18,"roomName":"W54S19"}
	- totalCarried
	- nextDest
	- "_move":{"dest":{"x":40,"y":8,"room":"W54S19"}"time":5159995,"path":"1418322232222222233344324323333","room":"W54S19"}}
