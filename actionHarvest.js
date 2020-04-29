var actionDeposit = require("action.deposit")

function actionHarvest(creep) {
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
    if (creep.harvest(sources[creep.memory.sourceNumber]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[creep.memory.sourceNumber], {
        visualizePathStyle: { stroke: "#ffaa00" },
      })
    }
  } else {
    actionDeposit(creep)
  }
}

module.exports = actionHarvest
