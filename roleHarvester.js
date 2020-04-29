var actionHarvest = require("action.harvest")

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    actionHarvest(creep)
  },
}

module.exports = roleHarvester
