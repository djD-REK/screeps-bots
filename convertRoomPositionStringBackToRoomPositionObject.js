function convertRoomPositionStringBackToRoomPositionObject(stringRoomPosition) {
  // input example: [room E56N8 pos 23,26]
  // output example: new RoomPosition(23, 26, 'E56N8');
  // Using the constructor for to create a new RoomPosition object: constructor(x, y, roomName)
  // Output example: const pos = new RoomPosition(10, 25, 'sim');
  // --> from https://docs.screeps.com/api/#RoomPosition
  stringRoomPosition = String(stringRoomPosition)
  console.log(stringRoomPosition)
  const regExp = /room (?<room>\w{5}) pos (?<x>\d+),(?<y>\d+)/
  // Board is a 50x50 grid with coordinates ranging from 0 to 49 i.e. 1-2 digits
  const resultOfRegExp = regExp.exec(stringRoomPosition)

  const roomName = resultOfRegExp.groups.room // e.g. E56N8
  const xCoordinate = Number(resultOfRegExp.groups.x) // e.g. 23
  const yCoordinate = Number(resultOfRegExp.groups.y) // e.g. 26
  return new RoomPosition(xCoordinate, yCoordinate, roomName) // e.g. new RoomPosition(23, 26, "E56N8")
}

module.exports = convertRoomPositionStringBackToRoomPositionObject
