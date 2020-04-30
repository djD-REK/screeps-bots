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
// Miner: (Static drop miner)
// [MOVE, WORK, WORK] = 250

const creepRoles = [
  {
    role: "Miner",
    buildTemplate: [WORK, WORK, MOVE],
    emoji: "⛏️",
  },
]

export default creepRoles
