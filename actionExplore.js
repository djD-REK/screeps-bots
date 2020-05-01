// TODO: Refactor how destination is stored in memory with newer version (string)
const convertRoomPositionStringBackToRoomPositionObject = require("convertRoomPositionStringBackToRoomPositionObject")

function actionExplore(thisCreep) {
  // TODO: make sure destination is getting unset
  if (
    thisCreep.memory.destination == undefined ||
    typeof thisCreep.memory.destination != "string"
  ) {
    thisCreep.say("🚶 EXPLORE")
    // const exitPositions = thisCreep.room.find(FIND_EXIT)
    const exitRoomNameArray = Array.from(
      Object.values(Game.map.describeExits(thisCreep.room))
    )
    /* Game.map.describeExits(thisCreep.room) Return value

    The exits information in the following format, or null if the room not found.

    {
        "1": "W8N4",    // TOP
        "3": "W7N3",    // RIGHT
        "5": "W8N2",    // BOTTOM
        "7": "W9N3"     // LEFT
    } */

    // Select an exit to move to at random
    const destinationRoom =
      exitRoomNameArray[Math.floor(exitRoomNameArray.length * Math.random())]

    thisCreep.memory.destination = String(RoomPosition(25, 25, destinationRoom))

    console.log(
      `${thisCreep.name} assigned mission to EXPLORE to Destination ${thisCreep.memory.destination}`
    )
  }
  if (
    thisCreep.pos.x === 0 ||
    thisCreep.pos.x === 49 ||
    thisCreep.pos.y === 0 ||
    thisCreep.pos.y === 49
  ) {
    // At an exit on the 50x50 game board
    thisCreep.memory.mission = "THINK"
    thisCreep.memory.destination = null
    // Move off the border by 1 step
    thisCreep.moveTo(25, 25)
  } else {
    // Move toward the assigned exit tile
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

module.exports = actionExplore
