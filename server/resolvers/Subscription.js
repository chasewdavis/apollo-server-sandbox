const gameRoomMembers = require('../model/tables/gameRoomMembers');
const { withFilter } = require('apollo-server');

const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';

const Subscription = {
    playerJoined: {
        subscribe: withFilter(
            () => gameRoomMembers.pubsub.asyncIterator([PLAYER_JOINED]),
            (payload, variables) => payload.gameRoomId === variables.gameRoomId
        )
    },
    playerLeft: {
        subscribe: withFilter(
            () => gameRoomMembers.pubsub.asyncIterator([PLAYER_LEFT]),
            (payload, variables) => payload.gameRoomId === variables.gameRoomId
        )
    }
};

module.exports = Subscription;
