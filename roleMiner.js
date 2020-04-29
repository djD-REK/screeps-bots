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

require("actionExplore")

const assessSources = (thisCreep) => {
  const thisRoom = thisCreep.room

  // Using Object.keys() and Array.prototype.filter:
  // const miners = Object.keys(Game.creeps).filter(
  //  (creep) => Game.creeps[creep].memory.role === "miner"
  // )
  // Equivalent using lodash filter:
  // const upgraders = _.filter(
  //  Game.creeps,
  //  (creep) => thisCreep.memory.role === "miner"
  // )

  // Select all sources with available energy from this room:
  const activeSources = thisRoom.find(FIND_SOURCES_ACTIVE)
  // Make a hash map of target->objective: {x,y}: {x,y}} coordinates
  const mineablePositions = new Map()
  activeSources.forEach((source) => {
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
          { x: mineablePosition.x, y: mineablePosition.y },
          { x: sourceX, y: sourceY }
        )
      })
  })

  // Select an array of miners with assigned targets from this room:
  const miners = Object.keys(Game.creeps).filter(
    (creepName) =>
      Game.creeps[creepName].memory.role === "miner" &&
      Game.creeps[creepName].memory.target != undefined &&
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
    // --> Mission: EXPLORE
    thisCreep.memory.mission = "EXPLORE"
    thisCreep.say("🔄 EXPLORE")
  } else {
    // Found at least 1 available mining position
    // --> Mission: MINE
    thisCreep.memory.mission = "MINE"
    thisCreep.say("🔄 MINE")
    // Select a position available at random and assign it as the mission target
    thisCreep.memory.target = [...mineablePositions.keys()][
      Math.floor(Math.random() * mineablePositions.size)
    ]
    // Assign the energy source to the mission objective
    thisCreep.memory.objective = mineablePositions.get(thisCreep.memory.target)
    console.log(
      `${thisCreep.name} assigned mission to MINE Objective (${thisCreep.memory.objective.x},` +
        `${thisCreep.memory.objective.y}) from Target (${thisCreep.memory.target.x},${thisCreep.memory.target.y})`
    )
  }
}

const roleMiner = {
  /** @param {Creep} thisCreep **/
  run: function (thisCreep) {
    if (thisCreep.memory.mission == undefined) {
      thisCreep.memory.home == thisCreep.room
      thisCreep.memory.mission = "THINK"
    }
    if (thisCreep.memory.mission === "THINK") {
      thisCreep.say("🔄 MINE")
      assessSources(thisCreep)
    }
    if (thisCreep.memory.mission === "MINE") {
      const pos = thisCreep.room.getPositionAt(
        thisCreep.memory.objective.x,
        thisCreep.memory.objective.y
      )
      const sourceAtObjective = pos.findClosestByRange(FIND_SOURCES_ACTIVE)
      if (thisCreep.harvest(sourceAtObjective) === ERR_NOT_IN_RANGE) {
        thisCreep.moveTo(thisCreep.memory.target.x, thisCreep.memory.target.y, {
          visualizePathStyle: { stroke: "#ffaa00" },
        })
      }
    }
    if (thisCreep.memory.mission === "EXPLORE") {
      actionExplore(thisCreep)
    }
  },
}

module.exports = roleMiner
