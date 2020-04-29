var actionDeposit = require("action.deposit")
var actionPatrol = require("action.patrol")

var roleFetcher = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Top priority: Dropped resources
    const targets = creep.room.find(FIND_DROPPED_RESOURCES)
    if (targets.length && creep.store.getFreeCapacity() > 0) {
      // Pick up dropped resources
      creep.say("🔄 dropped resources")
      console.log(`dropped resources at ${targets[0]}`)
      creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffaa00" } })
      creep.pickup(targets[0])
    } else {
      if (creep.store.getUsedCapacity > 0) {
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
