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
            tag
        }
    }
`;

export const GET_FILTERS = gql`
    query {
        filters {
            id
            filter
            activated
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
