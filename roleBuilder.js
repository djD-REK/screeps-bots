var actionHarvest = require("actionHarvest")

var roleBuilder = {
  /** @param {Creep} thisCreep **/
  run: function (thisCreep) {
    if (thisCreep.memory.building && thisCreep.store[RESOURCE_ENERGY] == 0) {
      thisCreep.memory.building = false
    }
    if (!thisCreep.memory.building && thisCreep.store.getFreeCapacity() == 0) {
      thisCreep.memory.building = true
      thisCreep.say("🚧 build")
    }

    if (thisCreep.memory.building) {
      var buildSites = thisCreep.room.find(FIND_MY_CONSTRUCTION_SITES)
      if (buildSites.length) {
        if (thisCreep.memory.buildSiteNumber == null) {
          thisCreep.memory.buildSiteNumber = Math.floor(
            Math.random() * buildSites.length
          )
          console.log(
            `${thisCreep.name} assigned to @buildSites[${thisCreep.memory.buildSiteNumber}]`
          )
        }
        if (
          thisCreep.build(buildSites[thisCreep.memory.buildSiteNumber]) ==
          ERR_NOT_IN_RANGE
        ) {
          thisCreep.moveTo(buildSites[thisCreep.memory.buildSiteNumber], {
            visualizePathStyle: { stroke: "#ffffff" },
          })
        } else if (
          thisCreep.build(buildSites[thisCreep.memory.buildSiteNumber]) != OK
        ) {
          // There was a different error
          console.log(
            `${thisCreep.name} error ${thisCreep.build(
              buildSites[thisCreep.memory.buildSiteNumber]
            )}`
          )
          thisCreep.memory.buildSiteNumber = null
        }
      }
    } else {
      actionFillUp(thisCreep)
    }
  },
}

module.exports = roleBuilder
