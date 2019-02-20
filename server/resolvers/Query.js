const playersTable = require('../model/tables/players');
const gameRoomsTable = require('../model/tables/gameRooms');
const gameRoomMembers = require('../model/tables/gameRoomMembers');

const Query = {
    player: async (_, { playerId }) => {
        const player = await playersTable.getPlayer(playerId);
        return player;
    },
    gameRoom: async (_, { gameRoomId }) => {
        const gameRoom = await gameRoomsTable.getGameRoom(gameRoomId);
        return gameRoom;
    },
    gameRoomMembers: async (_, { gameRoomId, playerStatus }) => {
        const players = await gameRoomMembers.gameRoomMembers({ gameRoomId, playerStatus });
        return players;
    }
};

module.exports = Query;
