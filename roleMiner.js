// Drop Miner
// A miner that drops what it mines where it sits, preferably into a container

// State Chart
// Mission: "MINE"
// Objective: {x,y} (energy source)
// Target: {x,y} (where to move to mine)

// Initial mission: undefined
// --> Set home to memory
// ----> Mission: THINK
// Default mission: THINK
// --> Assess Sources (energy sources)
// Available energy sources are the open tiles adjacent
// Open tiles mean no creep currently assigned to those tiles
// --> If available sources, go to mine them
// ----> Mission: MINE ---> (until death)
// --> If no available sources, go to another room
// ----> Mission: EXPLORE ---> Mission THINK on entering new room

const assessSources = (thisCreep) => {
  const thisRoom = thisCreep.room

  // Using Object.keys() and Array.prototype.filter:
  // const miners = Object.keys(Game.creeps).filter(
  //  (creep) => Game.creeps[creep].memory.role === "miner"
  // )
  // Equivalent using lodash filter:
  // const upgraders = _.filter(
  //  Game.creeps,
  //  (creep) => creep.memory.role === "miner"
  // )

  // Select all sources with available energy from this room:
  const allSources = thisRoom.find(FIND_SOURCES_ACTIVE)
  // Make a hash map of {"(x,y)": true} coordinates
  const mineablePositions = new Map()
  allSources.forEach((source) => {
    const sourceX = source.pos.x
    const sourceY = source.pos.y
    // lookForAtArea(type, top, left, bottom, right, [asArray])
    const lookArray = thisRoom.lookForAtArea(
      LOOK_TERRAIN,
      sourceY - 1,
      sourceX - 1,
      sourceY + 1,
      sourceX + 1,
      true
    )
    lookArray
      .filter((position) => position.terrain !== "wall")
      .forEach((mineablePosition) => {
        mineablePositions.set(
          `(${mineablePosition.x},${mineablePosition.y})`,
          true
        )
      })
  })

  // Select an array of miners from this room:
  const miners = Object.keys(Game.creeps).filter(
    (creepName) =>
      Game.creeps[creepName].memory.role === "miner" &&
      Game.creeps[creepName].room === thisRoom
  )
  // Remove taken positions from the hash map of {"(x,y)": true} coordinates
  miners.forEach((creepName) => {
    mineablePositions.delete(
      `(${Game.creeps[creepName].memory.target.x},${Game.creeps[creepName].memory.target.y})`
    )    
  })
  // The hash map mineablePositions now only includes available positions
  if (mineablePositions.size === 0) {
    // No available mining positions
    // --> Mission: Explore
  }
  else {
    // Select a position available at random
    mineablePositions.keys
  }
}

const roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      // Go harvest active resources
      var sources = creep.room.find(FIND_SOURCES_ACTIVE)
      if (creep.memory.sourceNumber === null) {
        // Randomize current source assignment
        creep.memory.sourceNumber = Math.floor(Math.random() * sources.length)
        creep.say("🔄 harvest")
        console.log(
          `${creep.name} assigned to @sources[${creep.memory.sourceNumber}]`
        )
      }
      if (
        creep.harvest(sources[creep.memory.sourceNumber]) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(sources[creep.memory.sourceNumber], {
          visualizePathStyle: { stroke: "#ffaa00" },
        })
      }
    } else {
      // Go to other room
    }
  },
}

module.exports = roleMiner
