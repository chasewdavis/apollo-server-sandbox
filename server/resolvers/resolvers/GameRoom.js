const gameRoomMembers = require('../../model/tables/gameRoomMembers');

const GameRoom = {
    players: async ({ gameRoomId }) => {
        const players = await gameRoomMembers.gameRoomMembers({ gameRoomId });
        return players;
    }
};

module.exports = GameRoom;
