const playersTable = require('../../model/tables/players');

const playerLoader = playerIds => {
    return playersTable.getPlayers(playerIds);
};

module.exports = playerLoader;
