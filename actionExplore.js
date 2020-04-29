function actionExplore(thisCreep) {
  if (thisCreep.memory.target == undefined) {
    thisCreep.say("🚶 EXPLORE")
    const exits = thisCreep.room.find(FIND_EXIT)
    // Select an exit to move to at random
    thisCreep.memory.target = exits[Math.floor(exits.length * Math.random())]
    console.log(
      `${thisCreep.name} assigned mission to EXPLORE to Target (${thisCreep.memory.target.x},${thisCreep.memory.target.y})`
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
    // Move off the border by 1 step
    thisCreep.moveTo(25, 25)
  } else {
    // Move toward the assigned exit tile
    thisCreep.moveTo(thisCreep.memory.target.x, thisCreep.memory.target.y)
  }
}

module.exports = actionExplore
