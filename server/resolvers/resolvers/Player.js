
const Player = {
    playerName: async ({ playerId }, _, { loaders }) => {
        const player = await loaders.playerLoader.load(playerId);
        return player.playerName;
    }
};

module.exports = Player;
