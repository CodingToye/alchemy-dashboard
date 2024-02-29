import gql from 'graphql-tag';

export const CREATE_PANEL = gql`
    mutation createPanel(
        $label: String!
        $target: String!
        $value: String!
        $original: String!
        $unit: String!
    ) {
        createPanel(
            label: $label
            target: $target
            value: $value
            original: $original
            unit: $unit
        ) {
            label
            target
            value
            original
            unit
        }
    }
`;

export const UPDATE_PANEL = gql`
    mutation updatePanel(
        $id: String!
        $label: String
        $target: String
        $original: String
        $value: String
        $unit: String
    ) {
        updatePanel(
            id: $id
            label: $label
            target: $target
            original: $original
            value: $value
            unit: $unit
        ) {
            id
            label
            target
            original
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

export const INSTALL_TOOL = gql`
    mutation installToolMutation($label: String!, $installed: Boolean!) {
        installTool(label: $label, installed: $installed) {
            label
            installed
        }
    }
`;

export const ACTIVATE_TOOL = gql`
    mutation activateToolMutation($label: String!, $activated: Boolean!) {
        activateTool(label: $label, activated: $activated) {
            label
            activated
        }
    }
`;
