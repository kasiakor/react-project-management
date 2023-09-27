const { projects, clients } = require("../sampleData");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Project Type

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return clients.find((client) => client.id === parent.clientId);
      },
    },
  }),
});

// Client Type

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// root query object
// pass id for the client
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return clients;
      },
    },

    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return clients.find((client) => client.id === args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return projects;
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return projects.find((project) => project.id === args.id);
      },
    },
  },
});

// Mutations
// id is not unique

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Object({
          id: args.id,
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client;
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return client.filter((client) => client.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
