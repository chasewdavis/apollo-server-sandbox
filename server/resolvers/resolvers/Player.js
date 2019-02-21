const playersTable = require('../../model/tables/players');

const Player = {
    playerName: async ({ playerId }) => {
        console.log('n + 1 issue');
        const player = await playersTable.getPlayer(playerId);
        return player.playerName;
    }
};

module.exports = Player;
