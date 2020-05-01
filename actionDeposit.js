// var actionExplore = require("actionExplore")

function actionDeposit(thisCreep) {
  thisCreep.say("🚶 depositing")
  var targets = thisCreep.room.find(FIND_MY_STRUCTURES, {
    // var targets = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      )
    },
  })
  if (targets.length > 0) {
    thisCreep.memory.depositTargetNumber = Math.floor(
      Math.random() * targets.length
    )
    if (
      thisCreep.transfer(
        targets[thisCreep.memory.depositTargetNumber],
        RESOURCE_ENERGY
      ) == ERR_NOT_IN_RANGE
    ) {
      thisCreep.moveTo(targets[thisCreep.memory.depositTargetNumber], {
        visualizePathStyle: { stroke: "#ffffff" },
      })
    }
  } else {
    // TODO make dynamic instead of always going home
    // actionExplore()
    thisCreep.moveTo(Game.spawns["Spawn1"].pos, {
      visualizePathStyle: { stroke: "#ffffff" },
    })
  }
}

module.exports = actionDeposit
