import db from '../../database.js';
// import { deletePanel } from '../../databaseOperations.js';

const resolvers = {
    Query: {
        panels: async () => {
            return new Promise((resolve, reject) => {
                db.all(
                    'SELECT * FROM panels WHERE tag IN (SELECT filter FROM filters WHERE activated = 1)',
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
        filters: async () => {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM filters', (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        },
        activeFilters: async () => {
            return new Promise((resolve, reject) => {
                db.all(
                    'SELECT * FROM filters WHERE activated = 1',
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
        createPanelMutation: async (
            _,
            { label, target, value, original, unit, tag }
        ) => {
            return new Promise((resolve, reject) => {
                const panelStmt = db.prepare(
                    'INSERT INTO panels (label, target, value, original, unit, tag) VALUES (?, ?, ?, ?, ?, ?)'
                );

                panelStmt.run(
                    label,
                    target,
                    value,
                    original,
                    unit,
                    tag,
                    function (err) {
                        if (err) {
                            console.log('Error inserting data:', err);
                            reject(err);
                            return;
                        }

                        console.log('Data inserted successfully:', this.lastID);
                        const panel = {
                            id: this.lastID,
                            label,
                            target,
                            value,
                            original,
                            unit,
                            tag,
                        };

                        resolve(panel);
                    }
                );
                panelStmt.finalize();
            })
                .then((panel) => {
                    return new Promise((resolve, reject) => {
                        const filterStmt = db.prepare(
                            'INSERT INTO filters (filter, activated) VALUES (?, ?)'
                        );
                        filterStmt.run(tag, true, function (filterErr) {
                            if (filterErr) {
                                console.log(
                                    'Error inserting filter data',
                                    filterErr
                                );
                                reject(filterErr);
                                return;
                            }

                            console.log(
                                'Filter data inserted successfully',
                                this.lastID
                            );
                            resolve(panel);
                        });
                        filterStmt.finalize();
                    });
                })
                .catch((error) => {
                    console.error(
                        'Error creating panel and inserting filter:',
                        error
                    );
                    throw error;
                });
        },
        createFilterMutation: async (_, { filter, activated }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'INSERT INTO filters (filter, activated) VALUES (?, ?)'
                );

                stmt.run(filter, activated, function (err) {
                    if (err) {
                        console.log('Error inserting data:', err);
                        reject(err);
                        return;
                    }

                    console.log('Data inserted successfully', filter);
                    console.log('Activate columns inserted data', activated);
                    const _filter = { filter, activated };
                    resolve(_filter);
                });
                stmt.finalize();
            });
        },
        activateFilterMutation: async (_, { id, activated }) => {
            try {
                const stmt = db.prepare(
                    'UPDATE filters SET activated = ? WHERE id = ?'
                );
                stmt.run(activated ? 1 : 0, id, function (err) {
                    if (err) {
                        console.error(
                            'Error updating filter in database:',
                            err
                        );
                        throw err;
                    }
                });
                stmt.finalize();

                const updatedFilter = await new Promise((resolve, reject) => {
                    db.get(
                        'SELECT * FROM filters WHERE id = ?',
                        [id],
                        (err, row) => {
                            if (err) {
                                console.error(
                                    'Error retrieving updated filter:',
                                    err
                                );
                                reject(err);
                            } else {
                                console.log(
                                    'Data updated successfully:',
                                    activated
                                );
                                resolve(row);
                            }
                        }
                    );
                });

                return updatedFilter;
            } catch (error) {
                console.error('Error activating filter:', error);
                throw error;
            }
        },
        deleteFilterMutation: async (_, { id }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare('DELETE FROM filters WHERE id = ?');
                stmt.run(id, function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const deleteFilter = {
                            id,
                        };
                        resolve(deleteFilter);
                    }
                });
            });
        },
        updatePanelMutation: async (
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
        deletePanelMutation: async (_, { id }) => {
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
