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
    },
    Mutation: {
        createPanel: async (_, { label, value, unit }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'INSERT INTO panels (label, value, unit) VALUES (?, ?, ?)'
                );
                stmt.run(label, value, unit, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const insertedPanel = {
                            id: this.lastID,
                            label,
                            value,
                            unit,
                        };
                        resolve(insertedPanel);
                    }
                });
            });
        },
        updatePanel: async (_, { id, label, value, unit }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'UPDATE panels SET label = ?, value = ?, unit = ? WHERE id = ?'
                );
                stmt.run(label, value, unit, id, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const updatedPanel = {
                            id,
                            label,
                            value,
                            unit,
                        };
                        resolve(updatedPanel);
                    }
                });
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
    },
};

export default resolvers;
