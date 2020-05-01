var actionDeposit = require("actionDeposit")
var actionExplore = require("actionExplore")

var roleFetcher = {
  /** @param {Creep} thisCreep **/
  run: function (thisCreep) {
    // This calculates the creep's carrying capacity by multiplying the number of
    // CARRY parts times the CARRY_CAPACITY per part, which is 50
    const carryingCapacity =
      thisCreep.body.filter((bodyPartObject) => bodyPartObject.type === CARRY)
        .length * CARRY_CAPACITY

    if (thisCreep.store.getUsedCapacity() >= CARRY_CAPACITY) {
      // If we have at least 50 resources (CARRY_CAPACITY), which is
      // the same as EXTENSION_ENERGY_CAPACITY[0] (i.e. 50 energy)
      // We can clear our marker of which resource we were gathing
      thisCreep.memory.droppedResourceNumber = null
      thisCreep.memory.objective = null
      // And go to to drop off resources
      actionDeposit(thisCreep)
    } else {
      // We can clear our marker of which structure we were filling
      thisCreep.memory.depositTargetNumber = null

      // Get all the fetchers who have assigned objectives
      const fetchers = Object.keys(Game.creeps).filter(
        (creepName) =>
          Game.creeps[creepName].memory.role === "fetcher" &&
          Game.creeps[creepName].memory.objective != undefined &&
          creepName !== thisCreep.Name
      )
      const fetcherDroppedTargets = fetchers.map((creepName) => {
        String(Game.creeps[creepName].memory.objective)
      })
      // Top priority: Dropped resources
      // - that have at least our carrying capacity
      // - and that no other fetchers are assigned to
      const droppedResources = thisCreep.room.find(FIND_DROPPED_RESOURCES, {
        filter: function (resource) {
          return (
            resource.amount >= 1 * carryingCapacity &&
            !fetcherDroppedTargets.includes(String(resource.pos))
          )
        },
      })
      // TODO: assign a number of fetchers dynamically?

      if (droppedResources.length) {
        if (thisCreep.memory.droppedResourceNumber == null) {
          // Randomize current droppedResource assignment
          thisCreep.memory.droppedResourceNumber = Math.floor(
            Math.random() * droppedResources.length
          )
          thisCreep.memory.objective = String(
            droppedResources[thisCreep.memory.droppedResourceNumber].pos
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
          thisCreep.memory.objective = null
        }
      } else {
        // Explore
        actionExplore(thisCreep)
      }
    }
  },
}

module.exports = roleFetcher
