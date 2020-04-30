function actionDeposit(creep) {
  creep.say("🚶 depositing")
  creep.memory.sourceNumber = null // Clear current source
  //  var targets = creep.room.find(FIND_MY_STRUCTURES, {
  var targets = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {
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
    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } })
    }
  }
}

module.exports = actionDeposit
