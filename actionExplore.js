// TODO: Refactor how target is stored in memory with newer version (string)
const convertRoomPositionStringBackToRoomPositionObject = require("convertRoomPositionStringBackToRoomPositionObject")

function actionExplore(thisCreep) {
  // TODO: make sure target is getting unset
  if (thisCreep.memory.target == undefined) {
    thisCreep.say("🚶 EXPLORE")
    const exits = thisCreep.room.find(FIND_EXIT)
    // Select an exit to move to at random
    // TODO: Fix that target here is a RoomPosition object, not a string
    thisCreep.memory.target = String(
      exits[Math.floor(exits.length * Math.random())].pos
    )
    console.log(exits[Math.floor(exits.length * Math.random())].pos)
    console.log(exits[Math.floor(exits.length * Math.random())])
    console.log(
      `${thisCreep.name} assigned mission to EXPLORE to Target ${thisCreep.memory.target}`
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
    thisCreep.memory.target = null
    // Move off the border by 1 step
    thisCreep.moveTo(25, 25)
  } else {
    // Move toward the assigned exit tile
    thisCreep.moveTo(
      convertRoomPositionStringBackToRoomPositionObject(
        thisCreep.memory.target
      ),
      {
        visualizePathStyle: { stroke: "#ffaa00" },
      }
    )
  }
}

module.exports = actionExplore
