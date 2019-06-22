const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');

const typeDefs = importSchema('server/schema.graphql');
const resolvers = require('./resolvers');
const loaders = require('./resolvers/loaders');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        loaders
    })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}.`);
});
