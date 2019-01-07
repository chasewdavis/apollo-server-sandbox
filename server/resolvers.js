const { PubSub } = require('apollo-server');

const pubsub = new PubSub();
const faker = require('faker');

const BOOK_ADDED = 'BOOK_ADDED';
const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';

const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling'
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton'
    }
];

const gameRooms = [
    {
        name: 'game room one',
        id: faker.random.uuid(),
        players: []
    }
];

const players = [];

const resolvers = {
    Query: {
        books: (_, { limit }) => (limit || limit === 0 ? books.slice(0, limit) : books),
        gameRooms: () => gameRooms,
        players: () => players
    },

    Mutation: {
        addBook: (_, { title, author }) => {
            const book = { title, author };
            books.push(book);
            pubsub.publish(BOOK_ADDED, { bookAdded: book });
            return book;
        },
        createPlayer: (_, { userName }) => {
            const player = {
                userName,
                id: faker.random.uuid()
            };
            players.push(player);
            return player;
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
        joinGameRoom: (_, { player, gameRoomId }) => {
            const gameRoom = gameRooms.filter(room => room.id === gameRoomId)[0];
            gameRoom.players.push(player);
            pubsub.publish(PLAYER_JOINED, { playerJoined: player });
            return gameRoom;
        },
        leaveGameRoom: (_, { player, gameRoomId }) => {
            const gameRoom = gameRooms.filter(room => room.id === gameRoomId)[0];
            gameRoom.players = gameRoom.players.filter(user => user.id !== player.id);
            pubsub.publish(PLAYER_LEFT, { playerLeft: player });
            return gameRoom;
        }
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
        },
        playerJoined: {
            subscribe: (_, { gameRoomId }) => {
                console.log('gameRoom', gameRoomId);
                return pubsub.asyncIterator([PLAYER_JOINED]);
            }
        },
        playerLeft: {
            subscribe: (_, { gameRoomId }) => {
                console.log('player left, game room', gameRoomId);
                return pubsub.asyncIterator([PLAYER_LEFT]);
            }
        }
    }
};

module.exports = resolvers;
