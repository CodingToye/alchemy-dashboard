import db from '../../database.js';
import {
    insertPanel,
    updatePanel,
    deletePanel,
} from '../../databaseOperations.js';

const resolvers = {
    Query: {
        panels: async () => {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM panels', (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        },
        tools: async () => {
            return new Promise((resolve, reject) => {
                db.all(
                    'SELECT id, label, installed FROM tools',
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });
        },
    },
    Mutation: {
        createPanel: async (_, { label, target, value, original, unit }) => {
            insertPanel(label, target, value, original, unit);
        },
        updatePanel: async (
            _,
            { id, target, label, original, value, unit }
        ) => {
            updatePanel(label, target, value, original, unit, id);
        },
        deletePanel: async (_, { id }) => {
            deletePanel(id);
        },
        deleteAllPanels: async () => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare('DELETE FROM panels');
                stmt.run(function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const deleteAllPanels = {};
                        resolve(deleteAllPanels);
                    }
                });
            });
        },
        installToolMutation: async (_, { label, installed }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'UPDATE tools SET installed = ? WHERE label = ?'
                );

                stmt.run(installed ? 1 : 0, label, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        db.get(
                            'SELECT * FROM tools WHERE label = ?',
                            [label],
                            (err, row) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(row);
                                }
                            }
                        );
                    }
                });
            });
        },

        activateToolMutation: async (_, { label, activated }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'UPDATE tools SET activated = ? WHERE label = ?'
                );

                stmt.run(activated ? 1 : 0, label, function (err) {
                    if (err) {
                        console.error('Error updating tool:', err);
                        reject(err);
                    } else {
                        db.get(
                            'SELECT * FROM tools WHERE label = ?',
                            [label],
                            (err, row) => {
                                if (err) {
                                    console.error('Error fetching tool:', err);
                                    reject(err);
                                } else {
                                    console.log('Tool activated:', row);
                                    resolve(row);
                                }
                            }
                        );
                    }
                });
            });
        },
    },
};

export default resolvers;
