// Drop Miner
// A miner that drops what it mines where it sits, preferably into a container

// State Chart
// Mission: "MINE"
// Objective: {x,y} (energy source)
// Destination: {x,y} (where to move to mine)

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

const actionExplore = require("actionExplore")

const assessSources = (thisCreep) => {
  const thisRoom = thisCreep.room

  // Select all sources with available energy from this room:
  const activeSources = thisRoom.find(FIND_SOURCES_ACTIVE)
  // Make a hash map of destination -> objective coordinates
  // Both are strings: e.g. [room E55N6 pos 14,11] -> [room E55N6 pos 14,11]
  const mineablePositions = new Map()
  activeSources.forEach((source) => {
    const sourcePositionString = String(source.pos)
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
      .filter((positionAsJSON) => positionAsJSON.terrain !== "wall")
      .forEach((mineablePositionAsJSON) => {
        // Each item returned by lookForAtArea looks like:
        // {"type":"terrain","terrain":"plain","x":24,"y":42}
        console.log(mineablePositionAsJSON)
        const mineablePosition = thisRoom.getPositionAt(
          mineablePositionAsJSON.x,
          mineablePositionAsJSON.y
        ) // Retrieve a RoomPosition object from the x,y coordinates
        const mineablePositionString = String(mineablePosition.pos)
        // Remove occupied positions from the hash map
        if (mineablePosition.pos.lookFor(LOOK_CREEPS).length === 0) {
          mineablePositions.set(mineablePositionString, sourcePositionString)
        }
      })
  })

  // The hash map mineablePositions now only includes available positions
  if (mineablePositions.size === 0) {
    // No available mining positions
    // --> Mission: EXPLORE
    thisCreep.memory.mission = "EXPLORE"
  } else {
    // Found at least 1 available mining position
    // --> Mission: MINE
    thisCreep.memory.mission = "MINE"
    console.log([...mineablePositions.keys()])
    // Select a position available at random and assign it as the mission destination
    thisCreep.memory.destination = [...mineablePositions.keys()][
      Math.floor(Math.random() * mineablePositions.size)
    ]
    // Assign the energy source to the mission objective
    thisCreep.memory.objective = mineablePositions.get(
      thisCreep.memory.destination
    )
    console.log(
      `${thisCreep.name} assigned mission to MINE Objective ${thisCreep.memory.objective} from Destination ${thisCreep.memory.destination}`
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
      thisCreep.say("🔄 THINK")
      assessSources(thisCreep)
    }
    if (thisCreep.memory.mission === "MINE") {
      if (Math.random() < 0.01) {
        thisCreep.say("🔄 MINE")
      }
      if (thisCreep.memory.objective == undefined) {
        thisCreep.memory.mission = "THINK"
      } else {
        const pos = thisCreep.room.getPositionAt(
          thisCreep.memory.objective.x,
          thisCreep.memory.objective.y
        )
        const sourceAtObjective = pos.findClosestByRange(FIND_SOURCES_ACTIVE)
        if (thisCreep.harvest(sourceAtObjective) === ERR_NOT_IN_RANGE) {
          thisCreep.moveTo(
            thisCreep.memory.destination.x,
            thisCreep.memory.destination.y,
            {
              visualizePathStyle: { stroke: "#ffaa00" },
            }
          )
        }
      }
    }
    if (thisCreep.memory.mission === "EXPLORE") {
      actionExplore(thisCreep)
    }
  },
}

module.exports = roleMiner
