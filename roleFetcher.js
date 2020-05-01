var actionDeposit = require("actionDeposit")
var actionExplore = require("actionExplore")

var roleFetcher = {
  /** @param {Creep} thisCreep **/
  run: function (thisCreep) {
    // Top priority: Dropped resources
    const droppedResources = thisCreep.room.find(FIND_DROPPED_RESOURCES, {
      filter: function (resource) {
        return (
          resource.amount >
          thisCreep.body.filter(
            (bodyPartObject) => bodyPartObject.type === CARRY
          ).length *
            CARRY_CAPACITY
        )
      },
    })

    if (droppedResources.length && thisCreep.store.getFreeCapacity() > 0) {
      if (thisCreep.memory.droppedResourceNumber == null) {
        // Randomize current droppedResource assignment
        thisCreep.memory.droppedResourceNumber = Math.floor(
          Math.random() * droppedResources.length
        )
        thisCreep.say("🔄 PICK UP")
        console.log(
          `${thisCreep.name} assigned to @droppedResources[${thisCreep.memory.droppedResourceNumber}]`
        )
      }
      if (
        thisCreep.pickup(
          droppedResources[thisCreep.memory.droppedResourceNumber]
        ) == ERR_NOT_IN_RANGE
      ) {
        thisCreep.moveTo(
          droppedResources[thisCreep.memory.droppedResourceNumber],
          {
            visualizePathStyle: { stroke: "#ffaa00" },
          }
        )
      }
      if (
        thisCreep.pickup(
          droppedResources[thisCreep.memory.droppedResourceNumber]
        ) == ERR_INVALID_TARGET
      ) {
        // Maybe we already picked it up, or someone else did
        thisCreep.memory.droppedResourceNumber = null
      }
    } else {
      thisCreep.memory.droppedResourceNumber = null
      if (thisCreep.store.getUsedCapacity() > 0) {
        // Drop off resources
        actionDeposit(thisCreep)
      } else {
        // Explore
        actionExplore(thisCreep)
      }
    }
  },
}

module.exports = roleFetcher
