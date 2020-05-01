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

const convertRoomPositionStringBackToRoomPositionObject = require("convertRoomPositionStringBackToRoomPositionObject")

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
        const mineablePosition = thisRoom.getPositionAt(
          mineablePositionAsJSON.x,
          mineablePositionAsJSON.y
        ) // Retrieve a RoomPosition object, mineablePosition, from the x,y coordinates
        const mineablePositionString = String(mineablePosition)
        // Remove occupied positions from the hash map
        if (mineablePosition.lookFor(LOOK_CREEPS).length === 0) {
          mineablePositions.set(mineablePositionString, sourcePositionString)
        }
      })
  })

  // Select an array of creeps with assigned destinations in this room:
  const miners = Object.keys(Game.creeps).filter(
    (creepName) =>
      Game.creeps[creepName].memory.role === "miner" &&
      Game.creeps[creepName].memory.destination != undefined &&
      creepName !== thisCreep.Name
  )
  // Using Object.keys() and Array.prototype.filter:
  // const miners = Object.keys(Game.creeps).filter(
  //  (creep) => Game.creeps[creep].memory.role === "miner"
  // )
  // Equivalent using lodash filter:
  // const upgraders = _.filter(
  //  Game.creeps,
  //  (creep) => thisCreep.memory.role === "miner"
  // )

  // Remove taken positions from the hash map of {"(x,y)": true} coordinates
  miners.forEach((creepName) => {
    const takenPositionString = String(
      Game.creeps[creepName].memory.destination
    ) // e.g. [room E55N6 pos 14,11]
    mineablePositions.delete(takenPositionString)
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
    console.log("Mineable positions: " + [...mineablePositions.keys()])
    // Select a position available at random and assign it as the mission destination (RoomPosition object stored in memory)
    thisCreep.memory.destination = [...mineablePositions.keys()][
      Math.floor(Math.random() * mineablePositions.size)
    ]
    // Assign the energy source to the mission objective (string resulting from RoomPosition object stored in memory)
    // Hash key accessed by string lookup of string resulting from RoomPosition
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
      if (
        thisCreep.memory.objective == undefined ||
        thisCreep.memory.destination == undefined
      ) {
        thisCreep.memory.mission = "THINK"
      } else {
        // In the creep's memory, the objective and destination are stored as strings, so we have to convert them
        const sourcePosition = convertRoomPositionStringBackToRoomPositionObject(
          thisCreep.memory.objective
        )
        const destinationPosition = convertRoomPositionStringBackToRoomPositionObject(
          thisCreep.memory.destination
        )
        const sourceObjectAtObjective = sourcePosition.findClosestByRange(
          FIND_SOURCES_ACTIVE
        )
        if (
          thisCreep.harvest(sourceObjectAtObjective) < 0 &&
          thisCreep.harvest(sourceObjectAtObjective) !== ERR_NOT_IN_RANGE
        ) {
          // Think about it if our mining site is giving us an error, such as because it's empty
          thisCreep.memory.mission = "THINK"
        }
        if (thisCreep.harvest(sourceObjectAtObjective) === ERR_NOT_IN_RANGE) {
          if (destinationPosition.lookFor(LOOK_CREEPS).length > 0) {
            // Think about it if our mining site is occupied
            thisCreep.memory.mission = "THINK"
          }
          thisCreep.moveTo(destinationPosition, {
            visualizePathStyle: { stroke: "#ffaa00" },
          })
        }
      }
    }
    if (thisCreep.memory.mission === "EXPLORE") {
      if (Math.random < 0.5) {
        thisCreep.memory.mission === "THINK"
      }
      actionExplore(thisCreep)
    }
  },
}

module.exports = roleMiner
