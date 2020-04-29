var roleHarvester = require("roleHarvester")
var roleUpgrader = require("roleUpgrader")
var roleBuilder = require("roleBuilder")
var roleDefender = require("roleDefender")
var roleFetcher = require("roleFetcher")

const upperFirstCharacter = (string) =>
  string.slice(0, 1).toUpperCase() + string.slice(1)
// const unitTypesAndCounts = {harvesters: 6, "upgraders", "builders", "defenders", "fetchers"]

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log("Clearing non-existing creep memory:", name)
    }
  }

  /*  BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    }, */
  // Default: (Harvester, Upgrader, Builder)
  // Old default: Move + work + carry = 200
  // Too slow: [WORK, WORK, MOVE, CARRY] = 300
  // New default: Move + move + work + carry = 250
  // Creep [CARRY, WORK, MOVE] will move 1 square per tick if it does not bear energy, and 1 square per 2 ticks if loaded.
  // Slow Defender: (Attack and patrol)
  // [TOUGH, ATTACK, ATTACK, ATTACK, MOVE] = 300
  // Fast Defender: (Attack and patrol)
  // [MOVE, MOVE, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH] = 300
  // Fetcher: (Dropped resources and patrol)
  // [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY]
  if (Game.spawns["Spawn1"].energy >= 300) {
    var harvesters = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "harvester"
    )
    console.log("Harvesters: " + harvesters.length)
    var upgraders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader"
    )
    console.log("Upgraders: " + upgraders.length)
    var builders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder"
    )
    console.log("Builders: " + builders.length)
    var defenders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "defender"
    )
    console.log("Defenders: " + defenders.length)
    var fetchers = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "fetcher"
    )
    console.log("Fetchers: " + fetchers.length)

    if (harvesters.length < 5) {
      var newName = "Harvester" + Game.time
      console.log("Spawning new harvester: " + newName)
      Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, MOVE, CARRY], newName, {
        memory: { role: "harvester" },
      })
    } else if (upgraders.length < 3) {
      var newName = "Upgrader" + Game.time
      console.log("Spawning new upgrader: " + newName)
      Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, MOVE, CARRY], newName, {
        memory: { role: "upgrader" },
      })
    } else if (
      builders.length < 5 &&
      Game.spawns["Spawn1"].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0
    ) {
      var newName = "Builder" + Game.time
      console.log("Spawning new builder: " + newName)
      Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, MOVE, CARRY], newName, {
        memory: { role: "builder" },
      })
    } else if (fetchers.length < 1) {
      var newName = "Fetcher" + Game.time
      console.log("Spawning new fetcher: " + newName)
      Game.spawns["Spawn1"].spawnCreep(
        [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY],
        newName,
        { memory: { role: "fetcher" } }
      )
    } else {
      //else if(defenders.length < 4) {
      var newName = "Defender" + Game.time
      console.log("Spawning new defender: " + newName)
      if (Math.random() < 0.5) {
        // Slow defender
        Game.spawns["Spawn1"].spawnCreep(
          [TOUGH, ATTACK, ATTACK, ATTACK, MOVE],
          newName,
          { memory: { role: "defender" } }
        )
      } else {
        // Fast defender
        Game.spawns["Spawn1"].spawnCreep(
          [MOVE, MOVE, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH],
          newName,
          { memory: { role: "defender" } }
        )
      }
    }
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name]
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    )
  }

  var tower = Game.getObjectById("19c84d7e085f8e787fde0c5b")
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    )
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure)
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (closestHostile) {
      tower.attack(closestHostile)
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name]
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep)
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep)
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep)
    }
    if (creep.memory.role == "defender") {
      roleDefender.run(creep)
    }
    if (creep.memory.role == "fetcher") {
      roleFetcher.run(creep)
    }
  }
}
