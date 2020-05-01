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

const convertRoomPositionStringBackToRoomPositionObject = (
  stringRoomPosition
) => {
  // input example: [room E56N8 pos 23,26]
  // output example: new RoomPosition(23, 26, 'E56N8');
  // Using the constructor for to create a new RoomPosition object: constructor(x, y, roomName)
  // Output example: const pos = new RoomPosition(10, 25, 'sim');
  // --> from https://docs.screeps.com/api/#RoomPosition
  const roomName = stringRoomPosition.substring(6, 11) // e.g. E56N8
  const xCoordinate = Number(stringRoomPosition.substring(16, 18)) // e.g. 23
  const yCoordinate = Number(stringRoomPosition.substring(19, 21)) // e.g. 26
  return new RoomPosition(xCoordinate, yCoordinate, roomName) // e.g. new RoomPosition(23, 26, "E56N8")
}

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
      if (thisCreep.memory.objective == undefined) {
        thisCreep.memory.mission = "THINK"
      } else {
        // In the creep's memory, the objective and destination are stored as strings, so we have to convert them
        const sourcePosition = convertRoomPositionStringBackToRoomPositionObject(
          thisCreep.memory.objective
        )
        const sourceObjectAtObjective = sourcePosition.findClosestByRange(
          FIND_SOURCES_ACTIVE
        )
        if (thisCreep.harvest(sourceObjectAtObjective) === ERR_NOT_IN_RANGE) {
          thisCreep.moveTo(
            convertRoomPositionStringBackToRoomPositionObject(
              thisCreep.memory.destination
            ),
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
