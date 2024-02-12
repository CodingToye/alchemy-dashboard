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
        createPanel: async (_, { label, value, suffix }) => {
            return new Promise((resolve, reject) => {
                console.log(resolve);
                const stmt = db.prepare(
                    'INSERT INTO panels (label, value, suffix) VALUES (?, ?, ?)'
                );
                stmt.run(label, value, suffix, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const insertedPanel = {
                            id: this.lastID.toString(),
                            label,
                            value,
                            suffix,
                        };
                        resolve(insertedPanel);
                    }
                });
            });
        },
        updatePanel: async (_, { id, label, value, suffix }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'UPDATE panels SET label = ?, value = ?, suffix = ? WHERE id = ?'
                );
                stmt.run(label, value, suffix, id, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const updatedPanel = {
                            id,
                            label,
                            value,
                            suffix,
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
