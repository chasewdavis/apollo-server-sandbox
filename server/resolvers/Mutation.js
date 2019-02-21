const playersTable = require('../model/tables/players');
const gameRoomsTable = require('../model/tables/gameRooms');
const gameRoomMembers = require('../model/tables/gameRoomMembers');

const Mutation = {
    createPlayer: async (_, { playerName }) => {
        const player = await playersTable.createPlayer(playerName);
        return player;
    },
    deletePlayer: async (_, { playerId }) => {
        const players = await playersTable.deletePlayer(playerId);
        return players;
    },
    createGameRoom: async (_, { gameRoomName, playerId }) => {
        const gameRoom = await gameRoomsTable.createGameRoom({ gameRoomName, playerId });
        const { gameRoomId } = gameRoom;
        await gameRoomMembers.joinGameRoom({ playerId, gameRoomId });
        return gameRoom;
    },
    gameRoomStatusUpdate: async (_, { playerId, gameRoomId, playerStatus }) => {
        const status = await gameRoomMembers.gameRoomStatusUpdate({ playerId, gameRoomId, playerStatus });
        // query for player id ONLY if it was requested
        return status;
    }
};

module.exports = Mutation;
