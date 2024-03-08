import db from '../../database.js';
// import { deletePanel } from '../../databaseOperations.js';

const resolvers = {
    Query: {
        panels: async () => {
            return new Promise((resolve, reject) => {
                db.all(
                    'SELECT * FROM panels WHERE tag IN (SELECT tag FROM filters WHERE activated = 1) OR NOT EXISTS (SELECT 1 FROM filters WHERE activated =1)',
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
            try {
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
                                console.log('Error inserting panel data:', err);
                                reject(err);
                                return;
                            }

                            console.log(
                                'Panel data inserted successfully:',
                                label
                            );
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
                    .then(async (panel) => {
                        const checkTagExistsInFilters = (tag) => {
                            return new Promise((resolve, reject) => {
                                db.get(
                                    'SELECT COUNT(*) AS count FROM filters WHERE tag = ?',
                                    [tag],
                                    (err, row) => {
                                        if (err) {
                                            console.log(
                                                'Error checking if tag exists in filters:',
                                                err
                                            );
                                            reject(err);
                                            return;
                                        }

                                        resolve(row.count > 0);
                                    }
                                );
                            });
                        };

                        const tagExists = await checkTagExistsInFilters(tag);
                        if (tag && !tagExists) {
                            return new Promise((resolve, reject) => {
                                const filterStmt = db.prepare(
                                    'INSERT INTO filters (tag, activated) VALUES (?, ?)'
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
                        }
                    })
                    .catch((error) => {
                        console.error(
                            'Error creating panel and inserting filter:',
                            error
                        );
                        throw error;
                    });
            } catch (error) {
                console.error('Error creating panel:', error);
                throw new Error('Failed to create panel. Please try again');
            }
        },
        createFilterMutation: async (_, { tag, activated }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare(
                    'INSERT INTO filters (tag, activated) VALUES (?, ?)'
                );

                stmt.run(tag, activated, function (err) {
                    if (err) {
                        console.log('Error inserting filter data:', err);
                        reject(err);
                        return;
                    }

                    const _filter = { tag, activated };
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
                                    'Filter data updated successfully:',
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
                db.get(
                    'SELECT tag FROM filters WHERE id = ?',
                    [id],
                    (err, row) => {
                        if (err) {
                            console.error('Error retrieving filter name:', err);
                            reject(err);
                            return;
                        }

                        const filterName = row ? row.tag : null;

                        if (!filterName) {
                            console.error('Filter not found');
                            reject(new Error('Filter not found'));
                            return;
                        }

                        const deleteFilterStmt = db.prepare(
                            'DELETE FROM filters WHERE id = ?'
                        );
                        deleteFilterStmt.run(id, function (err) {
                            if (err) {
                                console.error('Error deleting filter:', err);
                                reject(err);
                                return;
                            }
                            console.log(
                                'Filter successfully deleted:',
                                filterName
                            );

                            const updatePanelStmt = db.prepare(
                                'UPDATE panels SET tag = null WHERE tag = ?'
                            );
                            updatePanelStmt.run(filterName, function (err) {
                                if (err) {
                                    console.error(
                                        'Error updating panels:',
                                        err
                                    );
                                    reject(err);
                                    return;
                                }
                                console.log(
                                    'Filter removed from panels associated with filter:',
                                    filterName
                                );
                                resolve({ id });
                            });
                            updatePanelStmt.finalize();
                        });
                    }
                );
            });
        },
        deleteAllFiltersMutation: async () => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare('DELETE FROM filters');
                stmt.run(function (err) {
                    stmt.finalize();
                    if (err) {
                        reject(err);
                    } else {
                        const deleteAllFilters = {};
                        resolve(deleteAllFilters);
                    }
                });
            });
        },
        updatePanelMutation: async (
            _,
            { id, target, label, original, value, unit, tag }
        ) => {
            try {
                return new Promise((resolve, reject) => {
                    const panelStmt = db.prepare(
                        'UPDATE panels SET label = ?, target = ?, value = ?, original = ?, unit = ?, tag = ? WHERE id = ?'
                    );
                    panelStmt.run(
                        label,
                        target,
                        value,
                        original,
                        unit,
                        tag,
                        id,
                        function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            console.log('Panel data updated successfully:', id);
                            const updatedPanel = {
                                id,
                                label,
                                target,
                                original,
                                value,
                                unit,
                                tag,
                            };
                            resolve(updatedPanel);
                        }
                    );
                    panelStmt.finalize();
                })
                    .then(async (panel) => {
                        const checkTagExistsInFilters = (tag) => {
                            return new Promise((resolve, reject) => {
                                db.get(
                                    'SELECT COUNT(*) AS count FROM filters WHERE tag = ?',
                                    [tag],
                                    (err, row) => {
                                        if (err) {
                                            console.log(
                                                'Error checking if tag exists in filters:',
                                                err
                                            );
                                            reject(err);
                                            return;
                                        }

                                        resolve(row.count > 0);
                                    }
                                );
                            });
                        };
                        const tagExists = await checkTagExistsInFilters(tag);

                        if (tag && !tagExists) {
                            return new Promise((resolve, reject) => {
                                const filterStmt = db.prepare(
                                    'INSERT INTO filters (tag, activated) VALUES (?, ?)'
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
                        }
                    })
                    .catch((error) => {
                        console.error(
                            'Error creating panel and inserting filter:',
                            error
                        );
                        throw error;
                    });
            } catch (error) {
                console.error('Error updating panel:', error);
                throw new Error('Failed to update panel. Please try again');
            }
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
        deleteAllPanelsMutation: async () => {
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
