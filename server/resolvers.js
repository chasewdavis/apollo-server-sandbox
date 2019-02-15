const { PubSub, withFilter, UserInputError } = require('apollo-server');

// TODO - What if multiple instances of server need to be created
// How will this effect pubsub?
const pubsub = new PubSub();
const faker = require('faker');
const playersTable = require('./model/players');

const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';

// TODO - DynamoDB
const gameRooms = [
    {
        name: 'game room one',
        id: '807ab1aa-3aaa-42bc-aead-ed7f16ccdbd1',
        players: []
    }
];

// TODO - DynamoDB
let players = [
    {
        id: '770de62d-1f9b-4e1c-be4e-ba5e566e5837',
        userName: 'chase'
    }
];

const resolvers = {
    Query: {
        gameRooms: () => gameRooms,
        players: () => players
    },

    Mutation: {
        getPlayer: async (_, { playerId }) => {
            const player = await playersTable.getPlayer(playerId);
            return player;
        },
        createPlayer: async (_, { playerName }) => {
            const player = await playersTable.createPlayer(playerName);
            return player;
        },
        deletePlayer: async (_, { playerId }) => {
            players = await playersTable.deletePlayer(playerId);
            return players;
        },
        createGameRoom: (_, { gameRoomName, player }) => {
            const gameRoom = {
                name: gameRoomName,
                id: faker.random.uuid(),
                players: [
                    player
                ]
            };
            gameRooms.push(gameRoom);
            return gameRoom;
        },
        // TODO - Dry up joinGameRoom & leaveGameRoom - create validation function / error throwing function
        joinGameRoom: (_, { playerId, gameRoomId }) => {
            const gameRoom = gameRooms.filter(room => room.id === gameRoomId)[0];
            if (!gameRoom) {
                throw new UserInputError('Game room does not exist', {
                    invalidGameRoomId: gameRoomId
                });
            }
            const player = players.filter(user => user.id === playerId)[0];
            if (!player) {
                throw new UserInputError('Player does not exist', {
                    invalidPlayerId: playerId
                });
            }
            const playerIsInGameRoom = gameRoom.players.some(user => user.id === playerId);
            if (player && !playerIsInGameRoom) {
                gameRoom.players.push(player);

                pubsub.publish(PLAYER_JOINED, { playerJoined: player, gameRoomId });
            }
            return gameRoom;
        },
        leaveGameRoom: (_, { playerId, gameRoomId }) => {
            const gameRoom = gameRooms.filter(room => room.id === gameRoomId)[0];
            const player = players.filter(user => user.id === playerId)[0];
            gameRoom.players = gameRoom.players.filter(user => user.id !== playerId);
            pubsub.publish(PLAYER_LEFT, { playerLeft: player, gameRoomId });
            return gameRoom;
        }
    },

    Subscription: {
        playerJoined: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([PLAYER_JOINED]),
                (payload, variables) => payload.gameRoomId === variables.gameRoomId
            )
        },
        playerLeft: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([PLAYER_LEFT]),
                (payload, variables) => payload.gameRoomId === variables.gameRoomId
            )
        }
    }
};

module.exports = resolvers;
