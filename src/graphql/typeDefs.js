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
    }

    type Query {
        panels: [Panel]
    }

    type Mutation {
        createPanel(
            label: String!
            target: String!
            value: String!
            original: String!
            unit: String!
        ): Panel
        updatePanel(
            id: String!
            label: String
            target: String
            original: String
            value: String
            unit: String
        ): Panel
        deletePanel(id: String!): Panel
        deleteAllPanels: Panel
    }
`;

export { typeDefs };
