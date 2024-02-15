import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    // GraphQLID,
} from 'graphql';

import resolvers from './resolvers.js';

const PanelType = new GraphQLObjectType({
    name: 'Panel',
    fields: () => ({
        id: { type: GraphQLString },
        label: { type: GraphQLString },
        value: { type: GraphQLString },
        unit: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        panels: {
            type: new GraphQLList(PanelType),
            resolve: resolvers.Query.panels,
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPanel: {
            type: PanelType,
            args: {
                label: { type: new GraphQLNonNull(GraphQLString) },
                value: { type: new GraphQLNonNull(GraphQLString) },
                unit: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: resolvers.Mutation.createPanel,
        },
        updatePanel: {
            type: PanelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                label: { type: GraphQLString },
                value: { type: GraphQLString },
                unit: { type: GraphQLString },
            },
            resolve: resolvers.Mutation.updatePanel,
        },
        deletePanel: {
            type: PanelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: resolvers.Mutation.deletePanel,
        },
        deleteAllPanels: {
            type: PanelType,
            resolve: resolvers.Mutation.deleteAllPanels,
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema;
