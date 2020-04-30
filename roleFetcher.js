var actionDeposit = require("actionDeposit")
var actionPatrol = require("actionPatrol")

var roleFetcher = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Top priority: Dropped resources
    const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES)
    if (droppedResources.length && creep.store.getFreeCapacity() > 0) {
      if (creep.memory.droppedRedroppedResourceNumber == null) {
        // Randomize current droppedResource assignment
        creep.memory.droppedRedroppedResourceNumber = Math.floor(
          Math.random() * droppedResources.length
        )
        creep.say("🔄 FILL UP")
        console.log(
          `${creep.name} assigned to @droppedResources[${creep.memory.droppedResourceNumber}]`
        )
      }
      if (
        creep.harvest(droppedResources[creep.memory.droppedResourceNumber]) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(droppedResources[creep.memory.droppedResourceNumber], {
          visualizePathStyle: { stroke: "#ffaa00" },
        })
      }
      if (
        creep.harvest(droppedResources[creep.memory.droppedResourceNumber]) ===
        OK
      ) {
        // Log destination while harvesting
        creep.memory.destination = { x: creep.pos.x, y: creep.pos.y }
        creep.pickup(droppedResources[creep.memory.droppedResourceNumber])
      }
    } else {
      if (creep.store.getUsedCapacity() > 0) {
        // Drop off resources
        actionDeposit(creep)
      } else {
        // Patrol
        actionPatrol(creep)
      }
    }
  },
}

module.exports = roleFetcher
