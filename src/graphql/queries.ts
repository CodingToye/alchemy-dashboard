import gql from 'graphql-tag';

export const GET_PANELS = gql`
    query {
        panels {
            id
            label
            target
            value
            original
            unit
        }
    }
`;

export const GET_TOOLS = gql`
    query {
        tools {
            id
            label
            installed
        }
    }
`;
