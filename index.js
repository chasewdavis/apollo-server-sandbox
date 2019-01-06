const { ApolloServer, gql, PubSub } = require('apollo-server');
const faker = require('faker');

const pubsub = new PubSub();
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

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    input PlayerInput {
        userName: String!
        id: ID
    }

    type Player {
        id: ID!
        userName: String!
    }

    input GameRoomInput {
        name: String!
        players: [PlayerInput]
    }

    type GameRoom {
        id: ID!
        name: String!
        players: [Player]
    }

    type Query {
        books (limit:Int): [Book]
        gameRooms: [GameRoom]
        players: [Player]
    }

    type Mutation {
        addBook(title: String!, author: String!): Book 
        createPlayer(userName: String!): Player
        joinGameRoom(gameRoomId: String!, player: PlayerInput!): GameRoom
        createGameRoom(gameRoomName: String!, player: PlayerInput!): GameRoom
    }

    type Subscription {
        bookAdded: Book
        playerJoined: Player
    }
`;

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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    engine: process.env.ENGINE_API_KEY && {
        apiKey: process.env.ENGINE_API_KEY
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
