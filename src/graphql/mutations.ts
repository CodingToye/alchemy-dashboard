import gql from 'graphql-tag';

export const CREATE_PANEL = gql`
    mutation createPanel($label: String!, $value: String!, $unit: String!) {
        createPanel(label: $label, value: $value, unit: $unit) {
            label
            value
            unit
        }
    }
`;

export const UPDATE_PANEL = gql`
    mutation updatePanel(
        $id: String!
        $label: String
        $value: String
        $unit: String
    ) {
        updatePanel(id: $id, label: $label, value: $value, unit: $unit) {
            id
            label
            value
            unit
        }
    }
`;

export const DELETE_PANEL = gql`
    mutation deletePanel($id: String!) {
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
