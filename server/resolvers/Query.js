const gameRoomsTable = require('../model/tables/gameRooms');
const gameRoomMembers = require('../model/tables/gameRoomMembers');

const Query = {
    player: (_, { playerId }) => ({ playerId }), // the remaining fields being requested are picked up by the Player resolver
    gameRoom: async (_, { gameRoomId }) => {
        const gameRoom = await gameRoomsTable.getGameRoom(gameRoomId);
        return gameRoom;
    },
    gameRoomMembers: async (_, { gameRoomId, playerStatus }, context) => {
        const players = await gameRoomMembers.gameRoomMembers({ gameRoomId, playerStatus });
        return players;
    }
};

module.exports = Query;
