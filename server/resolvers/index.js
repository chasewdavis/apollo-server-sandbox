const Query = require('./Query');
const Mutation = require('./Mutation');
const Subscription = require('./Subscription');

const Player = require('./resolvers/Player');
const Status = require('./resolvers/Status');
const GameRoom = require('./resolvers/GameRoom');

const resolvers = {
    Query,
    Mutation,
    Subscription,

    Player,
    Status,
    GameRoom
};

module.exports = resolvers;
