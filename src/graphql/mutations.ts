import gql from 'graphql-tag';

export const CREATE_PANEL = gql`
    mutation createPanelMutation(
        $label: String!
        $target: String!
        $value: String!
        $original: String!
        $unit: String!
        $tag: String!
    ) {
        createPanel(
            label: $label
            target: $target
            value: $value
            original: $original
            unit: $unit
            tag: $tag
        ) {
            label
            target
            value
            original
            unit
            tag
        }
    }
`;

export const CREATE_FILTER = gql`
    mutation createFilterMutation($tag: String!, $activated: Boolean!) {
        createFilter(tag: $tag, activated: $activated) {
            tag
            activated
        }
    }
`;

export const ACTIVATE_FILTER = gql`
    mutation activateFilterMutation($id: String!, $activated: Boolean!) {
        activateFilter(id: $id, activated: $activated) {
            id
            activated
        }
    }
`;

export const DELETE_FILTER = gql`
    mutation deleteFilterMutation($id: String!) {
        deleteFilter(id: $id) {
            id
        }
    }
`;

export const DELETE_ALL_FILTERS = gql`
    mutation deleteAllFiltersMutation {
        deleteAllFilters {
            id
        }
    }
`;

export const UPDATE_PANEL = gql`
    mutation updatePanelMutation(
        $id: String!
        $label: String
        $target: String
        $original: String
        $value: String
        $unit: String
        $tag: String
    ) {
        updatePanel(
            id: $id
            label: $label
            target: $target
            original: $original
            value: $value
            unit: $unit
            tag: $tag
        ) {
            id
            label
            target
            original
            value
            unit
            tag
        }
    }
`;

export const DELETE_PANEL = gql`
    mutation deletePanelMutation($id: String!) {
        deletePanel(id: $id) {
            id
        }
    }
`;

export const DELETE_ALL_PANELS = gql`
    mutation deleteAllPanelsMutation {
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
