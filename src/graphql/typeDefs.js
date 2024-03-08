import { gql } from 'apollo-server';

const typeDefs = gql`
    scalar Date

    type Panel {
        id: String
        label: String
        target: String
        original: String
        value: String
        unit: String
        tag: String
    }

    type Filter {
        id: String
        tag: String
        activated: Boolean
    }

    type Query {
        panels: [Panel]
        filters: [Filter]
        activeFilters: [Filter!]!
    }

    type Mutation {
        createPanelMutation(
            label: String!
            target: String!
            value: String!
            original: String!
            unit: String!
            tag: String!
        ): Panel
        createFilterMutation(tag: String!, activated: Boolean!): Filter
        activateFilterMutation(id: String!, activated: Boolean!): Filter
        deleteFilterMutation(id: String!): Filter
        deleteAllFiltersMutation: Filter
        updatePanelMutation(
            id: String!
            label: String
            target: String
            original: String
            value: String
            unit: String
            tag: String
        ): Panel
        deletePanelMutation(id: String!): Panel
        deleteAllPanelsMutation: Panel
    }
`;

export { typeDefs };
