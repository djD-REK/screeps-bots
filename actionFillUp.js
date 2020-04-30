const actionFillUp = function (thisCreep) {
  thisCreep.say("🔄 FILL UP")
  thisCreep.memory.sourceNumber = null // Clear current source
  const storageSites = thisCreep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      )
    },
  })
  if (storageSites.length > 0) {
    if (thisCreep.memory.storageSiteNumber == null) {
      thisCreep.memory.storageSiteNumber = Math.floor(
        Math.random() * storageSites.length
      )
      console.log(
        `${thisCreep.name} assigned to @storageSites[${thisCreep.memory.storageSiteNumber}]`
      )
    }
    if (
      thisCreep.withdraw(storageSites[thisCreep.memory.storageSiteNumber]) ==
      ERR_NOT_IN_RANGE
    ) {
      thisCreep.moveTo(storageSites[thisCreep.memory.storageSiteNumber], {
        visualizePathStyle: { stroke: "#ffffff" },
      })
    } else if (
      thisCreep.withdraw(storageSites[thisCreep.memory.storageSiteNumber]) != OK
    ) {
      // There was a different error
      console.log(
        `${thisCreep.name} error ${thisCreep.withdraw(
          storageSites[thisCreep.memory.storageSiteNumber]
        )}`
      )
      thisCreep.memory.storageSiteNumber = null
    }
  }
}

module.exports = actionFillUp
