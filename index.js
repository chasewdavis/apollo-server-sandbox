const { ApolloServer, gql, PubSub } = require('apollo-server');

const pubsub = new PubSub();
const BOOK_ADDED = 'BOOK_ADDED';

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


const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Query {
        books (limit:Int): [Book]
    }

    type Mutation {
        addBook(title: String!, author: String!): Book 
    }

    type Subscription {
        bookAdded: Book
    }
  `;

// comments
const resolvers = {
    Query: {
        books: (_, { limit }, context) => (limit || limit === 0 ? books.slice(0, limit) : books)
    },

    Mutation: {
        addBook: (_, { title, author }, context) => {
            const book = { title, author };
            books.push(book);
            pubsub.publish(BOOK_ADDED, { bookAdded: book });
            return book;
        }
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
        }
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
