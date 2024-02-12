import gql from 'graphql-tag';

export const GET_PANELS = gql`
    query {
        panels {
            id
            label
            value
            suffix
        }
    }
`;
