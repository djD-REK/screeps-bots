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
      ) < 0 &&
      thisCreep.transfer(
        targets[thisCreep.memory.depositTargetNumber],
        RESOURCE_ENERGY
      ) !== ERR_NOT_IN_RANGE
    ) {
      console.log(
        "Drop it!" +
          thisCreep.transfer(
            targets[thisCreep.memory.depositTargetNumber],
            RESOURCE_ENERGY
          )
      )
      // There's an issue, so let's drop our resources and mosey on
      thisCreep.drop(RESOURCE_ENERGY)
    }
    if (
      thisCreep.transfer(
        targets[thisCreep.memory.depositTargetNumber],
        RESOURCE_ENERGY
      ) === ERR_NOT_IN_RANGE
    ) {
      thisCreep.moveTo(targets[thisCreep.memory.depositTargetNumber], {
        visualizePathStyle: { stroke: "#ffffff" },
      })
    }
  } else {
    // TODO make dynamic instead of always going home
    // actionExplore()
    if (
      thisCreep.room === Game.spawns["Spawn1"].room &&
      thisCreep.pos.getRangeTo(Game.spawns["Spawn1"].pos) < 5
    ) {
      console.log("Drop it! There are 0 available targets in the home room.")
      thisCreep.say("DROP IT!")
      // There's an issue, so let's drop our resources and mosey on
      thisCreep.drop(RESOURCE_ENERGY)
    } else {
      // Move to within 5 tiles of the spawn. Then we drop it if everything is full
      thisCreep.moveTo(Game.spawns["Spawn1"].pos, {
        visualizePathStyle: { stroke: "#ffffff" },
      })
    }
  }
}

module.exports = actionDeposit
