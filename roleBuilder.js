var actionHarvest = require("actionHarvest")

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false
      creep.say("🔄 harvest")
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true
      creep.say("🚧 build")
    }

    if (creep.memory.building) {
      var buildSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
      if (buildSites.length) {
        if (creep.memory.buildSiteNumber == null) {
          creep.memory.buildSiteNumber = Math.floor(
            Math.random() * buildSites.length
          )
          console.log(
            `${creep.name} assigned to @buildSites[${creep.memory.buildSiteNumber}]`
          )
        }
        if (
          creep.build(buildSites[creep.memory.buildSiteNumber]) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(buildSites[creep.memory.buildSiteNumber], {
            visualizePathStyle: { stroke: "#ffffff" },
          })
        }
        if (creep.build(buildSites[creep.memory.buildSiteNumber]) != OK) {
          // There was an error
          console.log(
            `error ${creep.build(buildSites[creep.memory.buildSiteNumber])}`
          )
          creep.memory.buildSiteNumber = null
        }
      }
    } else {
      actionHarvest(creep)
    }
  },
}

module.exports = roleBuilder
