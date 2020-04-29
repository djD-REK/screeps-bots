function actionExplore(creep) {
  creep.say("🚶 exploring")
  if (thisCreep.memory.target == undefined) {
    const exits = thisCreep.room.find(FIND_EXIT)
    // Select an exit to move to at random
    thisCreep.memory.target = exits[Math.floor(exits.length * Math.random())]
  }
  if (
    thisCreep.pos.x === 0 ||
    thisCreep.pos.x === 49 ||
    thisCreep.pos.y === 0 ||
    thisCreep.pos.y === 49
  ) {
    // At an exit on the 50x50 game board
    thisCreep.memory.mission = "THINK"
    // Move off the border by 1 step
    thisCreep.moveTo(25, 25)
  } else {
    // Move toward the assigned exit tile
    thisCreep.moveTo(thisCreep.memory.target)
  }
}

module.exports = actionExplore
