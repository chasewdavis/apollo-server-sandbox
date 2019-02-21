const Query = require('./Query');
const Mutation = require('./Mutation');
const Subscription = require('./Subscription');

const Player = require('./resolvers/Player');
const GameRoom = require('./resolvers/GameRoom');

const resolvers = {
    Query,
    Mutation,
    Subscription,

    Player,
    GameRoom,
};

module.exports = resolvers;
