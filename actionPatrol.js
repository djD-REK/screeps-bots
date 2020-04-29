function actionPatrol(creep) {
  // Patrol to a random flag
  var flags = creep.room.find(FIND_FLAGS)
  if (creep.memory.flagNumber == null) {
    // null or undefined
    // Randomize current source assignment
    creep.memory.flagNumber = Math.floor(Math.random() * flags.length)
    creep.say("🚶 patrolling")
    console.log(`${creep.name} assigned to @flags[${creep.memory.flagNumber}]`)
  }
  if (
    flags[creep.memory.flagNumber].pos.x === creep.pos.x &&
    flags[creep.memory.flagNumber].pos.y === creep.pos.y
  ) {
    console.log(`${creep.name} arrived at @flags[${creep.memory.flagNumber}]`)
    creep.memory.flagNumber = null
  } else {
    // Get to moving
    creep.moveTo(flags[creep.memory.flagNumber], {
      visualizePathStyle: { stroke: "#ffaa00" },
    })
  }
}

module.exports = actionPatrol
