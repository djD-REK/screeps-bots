// var actionExplore = require("actionExplore")

function actionFillUp(thisCreep) {
  thisCreep.say("🚶 FILL UP")
  const targetFillUpSite = thisCreep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    //var targets = thisCreep.room.find(FIND_MY_STRUCTURES, {
    // var targets = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER ||
          structure.structureType == STRUCTURE_CONTAINER ||
          structure.structureType == STRUCTURE_STORAGE) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      )
    },
  })
  if (targetFillUpSite != null) {
    // There is somewhere to fill up in the current room
    if (
      thisCreep.withdraw(targetFillUpSite, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
    ) {
      thisCreep.moveTo(targetFillUpSite, {
        visualizePathStyle: { stroke: "#ffffff" },
      })
    }
  }
}

module.exports = actionFillUp
