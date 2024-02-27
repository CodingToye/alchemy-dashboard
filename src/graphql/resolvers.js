import db from '../../database.js';

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
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'INSERT INTO panels (label, target, value, original, unit) VALUES (?, ?, ?, ?, ?)'
                );

                stmt.run(label, target, value, original, unit, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const insertedPanel = {
                            id: this.lastID,
                            label,
                            target,
                            value,
                            original,
                            unit,
                        };
                        resolve(insertedPanel);
                    }
                });
            });
        },
        updatePanel: async (
            _,
            { id, target, label, original, value, unit }
        ) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'UPDATE panels SET label = ?, target = ?, value = ?, original = ?, unit = ? WHERE id = ?'
                );
                stmt.run(
                    label,
                    target,
                    value,
                    original,
                    unit,
                    id,
                    function (err) {
                        stmt.finalize();
                        if (err) {
                            reject(err);
                        } else {
                            const updatedPanel = {
                                id,
                                label,
                                target,
                                original,
                                value,
                                unit,
                            };
                            resolve(updatedPanel);
                        }
                    }
                );
            });
        },
        deletePanel: async (_, { id }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare('DELETE FROM panels WHERE id = ?');
                stmt.run(id, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const deletePanel = {
                            id,
                        };
                        resolve(deletePanel);
                    }
                });
            });
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
        installTool: async (_, { label, installed }) => {
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
    },
};

export default resolvers;
