const { PubSub } = require('apollo-server');

const pubsub = new PubSub();
const faker = require('faker');

const BOOK_ADDED = 'BOOK_ADDED';
const PLAYER_JOINED = 'PLAYER_JOINED';

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
            console.log('gameroom to join', gameRoom);
            gameRoom.players.push(player);
            pubsub.publish(PLAYER_JOINED, { playerJoined: player });
            return gameRoom;
        }
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
        }
        // TODO - player joined
    }
};

module.exports = resolvers;
