import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} from 'graphql';

import resolvers from './resolvers.js';

const PanelType = new GraphQLObjectType({
    name: 'Panel',
    fields: () => ({
        id: { type: GraphQLString },
        label: { type: GraphQLString },
        target: { type: GraphQLString },
        original: { type: GraphQLString },
        value: { type: GraphQLString },
        unit: { type: GraphQLString },
        tag: { type: GraphQLString },
    }),
});

const FilterType = new GraphQLObjectType({
    name: 'Filter',
    fields: () => ({
        id: { type: GraphQLString },
        tag: { type: GraphQLString },
        activated: { type: GraphQLBoolean },
    }),
});

const ToolType = new GraphQLObjectType({
    name: 'Tool',
    fields: () => ({
        id: { type: GraphQLString },
        label: { type: GraphQLString },
        installed: { type: GraphQLBoolean },
        activated: { type: GraphQLBoolean },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        panels: {
            type: new GraphQLList(PanelType),
            resolve: resolvers.Query.panels,
        },
        filters: {
            type: new GraphQLList(FilterType),
            resolve: resolvers.Query.filters,
        },
        tools: {
            type: new GraphQLList(ToolType),
            resolve: resolvers.Query.tools,
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
                target: { type: new GraphQLNonNull(GraphQLString) },
                value: { type: new GraphQLNonNull(GraphQLString) },
                original: { type: new GraphQLNonNull(GraphQLString) },
                unit: { type: new GraphQLNonNull(GraphQLString) },
                tag: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: resolvers.Mutation.createPanelMutation,
        },
        createFilter: {
            type: FilterType,
            args: {
                tag: { type: new GraphQLNonNull(GraphQLString) },
                activated: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: resolvers.Mutation.createFilterMutation,
        },
        activateFilter: {
            type: FilterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                activated: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: resolvers.Mutation.activateFilterMutation,
        },
        deleteFilter: {
            type: FilterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: resolvers.Mutation.deleteFilterMutation,
        },
        updatePanel: {
            type: PanelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                label: { type: GraphQLString },
                target: { type: GraphQLString },
                original: { type: GraphQLString },
                value: { type: GraphQLString },
                unit: { type: GraphQLString },
                tag: { type: GraphQLString },
            },
            resolve: resolvers.Mutation.updatePanelMutation,
        },
        deletePanel: {
            type: PanelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: resolvers.Mutation.deletePanelMutation,
        },
        deleteAllPanels: {
            type: PanelType,
            resolve: resolvers.Mutation.deleteAllPanels,
        },
        installTool: {
            type: ToolType,
            args: {
                label: { type: new GraphQLNonNull(GraphQLString) },
                installed: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: resolvers.Mutation.installToolMutation,
        },
        activateTool: {
            type: ToolType,
            args: {
                label: { type: new GraphQLNonNull(GraphQLString) },
                activated: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: resolvers.Mutation.activateToolMutation,
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema;
