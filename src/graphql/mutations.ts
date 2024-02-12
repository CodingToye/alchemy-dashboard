import gql from 'graphql-tag';

export const CREATE_PANEL = gql`
    mutation createPanel($label: String!, $value: String!, $suffix: String!) {
        createPanel(label: $label, value: $value, suffix: $suffix) {
            label
            value
            suffix
        }
    }
`;

export const UPDATE_PANEL = gql`
    mutation UpdatePanel(
        $id: String!
        $label: String
        $value: String
        $suffix: String
    ) {
        updatePanel(id: $id, label: $label, value: $value, suffix: $suffix) {
            id
            label
            value
            suffix
        }
    }
`;

export const DELETE_PANEL = gql`
    mutation DeletePanel($id: String!) {
        deletePanel(id: $id) {
            id
        }
    }
`;

export const DELETE_ALL_PANELS = gql`
    mutation {
        deleteAllPanels {
            id
        }
    }
`;
