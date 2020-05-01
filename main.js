const roleDefender = require("roleDefender")
const roleMiner = require("roleMiner")
const roleBuilder = require("roleBuilder")
const roleFetcher = require("roleFetcher")
const roleHarvester = require("roleHarvester")
const roleUpgrader = require("roleUpgrader")

// const upperFirstCharacter = (string) => string.slice(0, 1).toUpperCase() + string.slice(1)
// const unitTypesAndCounts = {harvesters: 6, "upgraders", "builders", "defenders", "fetchers"]
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
// Fetcher: (Dropped resources and patrol)
// [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY]

// Defender: (Attack and patrol)
// [MOVE, MOVE, ATTACK, ATTACK] = 260
// Miner:
// [WORK, WORK, MOVE, MOVE] = 300

module.exports.loop = function () {
  // Housekeeping: Delete dead creeps from memory
  for (const name in Memory.creeps) {
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
  // Fetcher: (Dropped resources / Tanker)
  // [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY] = 300
  // Miner: (Static drop miner -- however also a remote miner, so needs MOVE)
  // [MOVE, MOVE, WORK, WORK] = 300

  // Spawn new creeps if at least 300 energy (default max to a spawn)
  // Initially Game.spawns["Spawn1"].room.energyCapacityAvailable === 300
  // Currently Game.spawns["Spawn1"].room.energyCapacityAvailable === 550
  if (
    Game.spawns["Spawn1"].room.energyAvailable >=
    Game.spawns["Spawn1"].room.energyCapacityAvailable
  ) {
    const harvesters = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "harvester"
    )
    console.log("Harvesters: " + harvesters.length)
    const upgraders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader"
    )
    console.log("Upgraders: " + upgraders.length)
    const builders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder"
    )
    console.log("Builders: " + builders.length)
    const defenders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "defender"
    )
    console.log("Defenders: " + defenders.length)
    const fetchers = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "fetcher"
    )
    console.log("Fetchers: " + fetchers.length)
    const miners = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "miner"
    )
    console.log("Miners: " + miners.length)

    if (harvesters.length < 0) {
      const newName = Game.time + "_" + "Harvester" + harvesters.length
      console.log("Spawning new harvester: " + newName)
      Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, MOVE, CARRY], newName, {
        memory: { role: "harvester" },
      })
    } else if (fetchers.length < miners.length) {
      const newName = Game.time + "_" + "Fetcher" + fetchers.length
      console.log("Spawning new fetcher: " + newName)
      Game.spawns["Spawn1"].spawnCreep(
        //        [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], // 300
        [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], // 500
        newName,
        { memory: { role: "fetcher" } }
      )
    } else if (miners.length < 20) {
      const newName = Game.time + "_" + "Miner" + miners.length
      console.log("Spawning new miner: " + newName)
      // [WORK, WORK, MOVE, MOVE] // 300
      // [WORK, WORK, WORK, WORK, MOVE, MOVE] // 500
      Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, WORK, WORK, MOVE, MOVE],
        newName,
        {
          memory: { role: "miner" },
        }
      )
    } else if (upgraders.length < 5) {
      const newName = Game.time + "_" + "Upgrader" + upgraders.length
      console.log("Spawning new upgrader: " + newName)
      // [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY] // 500
      // [WORK, MOVE, MOVE, CARRY] // 300
      Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY],
        newName,
        {
          memory: { role: "upgrader" },
        }
      )
    } else if (
      builders.length < 5 &&
      Game.spawns["Spawn1"].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0
    ) {
      const newName = Game.time + "_" + "Builder" + builders.length
      console.log("Spawning new builder: " + newName)
      // [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY] // 500
      // [WORK, MOVE, MOVE, CARRY] // 300
      Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY],
        newName,
        {
          memory: { role: "builder" },
        }
      )
    } else if (defenders.length < 20) {
      const newName = Game.time + "_" + "Defender" + defenders.length
      console.log("Spawning new defender: " + newName)
      // [ATTACK, ATTACK, MOVE, MOVE] // 260
      // [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE ] // 520
      Game.spawns["Spawn1"].spawnCreep(
        [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        newName,
        {
          memory: { role: "defender" },
        }
      )
    } else {
      const newName = Game.time + "_" + "Miner" + miners.length
      console.log("Spawning new miner: " + newName)
      // [WORK, WORK, MOVE, MOVE] // 300
      // [WORK, WORK, WORK, WORK, MOVE, MOVE] // 500
      Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, WORK, WORK, MOVE, MOVE],
        newName,
        {
          memory: { role: "miner" },
        }
      )
    }
  }

  // Visual display if spawn is spawning
  if (Game.spawns["Spawn1"].spawning) {
    const spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name]
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    )
  }

  // Make towers attack & repair
  const tower = Game.getObjectById("19c84d7e085f8e787fde0c5b")
  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    )
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure)
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (closestHostile) {
      tower.attack(closestHostile)
    }
  }

  // Run all creeps
  for (const creepName in Game.creeps) {
    try {
      const creep = Game.creeps[creepName]
      if (creep.memory.role == "defender") {
        roleDefender.run(creep)
      }
      if (creep.memory.role == "miner") {
        roleMiner.run(creep)
      }
      if (creep.memory.role == "fetcher") {
        roleFetcher.run(creep)
      }
      if (creep.memory.role == "harvester") {
        roleHarvester.run(creep)
      }
      if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep)
      }
      if (creep.memory.role == "builder") {
        roleBuilder.run(creep)
      }
    } catch (e) {
      console.log(`${creepName} threw a ${e}`)
    }
  }
}
