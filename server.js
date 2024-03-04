import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './src/graphql/schema.js';
import sqlite3 from 'sqlite3';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// Create the panels table if it doesn't exist
db.run(
    `
    CREATE TABLE IF NOT EXISTS panels(
        id INTEGER PRIMARY KEY,
        label TEXT,
        target TEXT,
        value TEXT,
        original TEXT,
        unit TEXT,
        tag TEXT
    )
`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "panels" created or already exists');
        }
    }
);

// Create the filters table if it doesn't exist
db.run(
    `
    CREATE TABLE IF NOT EXISTS filters(
        id INTEGER PRIMARY KEY,
        filter TEXT,
        activated BOOLEAN
    )
    `,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "filters" created or already exists');
        }
    }
);

// Create the tools table if it doesn't exist
db.run(
    `
    CREATE TABLE IF NOT EXISTS tools(
        id INTEGER PRIMARY KEY,
        label TEXT,
        installed BOOLEAN,
        activated BOOLEAN
    )
    `,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "tools" created or already exists');
            populateDefaultTools();
        }
    }
);

// Pre-populate the tools table
function populateDefaultTools() {
    db.get('SELECT COUNT(*) as count FROM tools', (err, row) => {
        if (err) {
            console.error('Error checking tools table:', err);
            return;
        }
        if (row.count === 0) {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                const defaultTools = [
                    'Heating',
                    'Water',
                    'Electricity',
                    'Energy Saving',
                ];
                const insertToolStmt = db.prepare(
                    'INSERT INTO tools (label, installed, activated) Values (?,?,?)'
                );
                defaultTools.forEach((tool) => {
                    insertToolStmt.run(tool, 0, 0);
                });
                insertToolStmt.finalize();

                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                    } else {
                        console.log('Default tools inserted successfully');
                    }
                });
            });
        }
    });
}

// Route to get all panel data
app.get('/api/panels', (_, res) => {
    db.all('SELECT * FROM panels', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Query result:', rows);
        res.json(rows);
    });
});

// Route to get all filters data
app.get('/api/filters', (_, res) => {
    db.all('SELECT * FROM filters', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Query results:', rows);
        res.json(rows);
    });
});

// Route to get all tools data
app.get('/api/tools', (_, res) => {
    db.all('SELECT id, label, installed, activated FROM tools', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Query result:', rows);
        res.json(rows);
    });
});

// Route to insert new panel data
app.post('/api/data/', (req, res) => {
    const { type, label } = req.body;

    if (!type || !label || typeof isChecked === 'undefined') {
        console.log('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type === 'panel') {
        const { target, value, original, unit, tag } = req.body;

        return new Promise((resolve, reject) => {
            const stmt = db.prepare(
                'INSERT INTO panels (label, target, value, original, unit, tag) VALUES (?, ?, ?, ?, ?, ?)'
            );

            stmt.run(label, target, value, original, unit, tag, function (err) {
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
            });
            stmt.finalize();
        });
    } else {
        return res.status(400).json({ error: 'Unsupported entity type' });
    }
});

// Route to update panel data
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { type, label, installed } = req.body;

    if (!type || !label) {
        console.log('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type === 'panel') {
        const { target, value, original, unit } = req.body;
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(
                'UPDATE panels SET label = ?, target = ?, value = ?, original = ?, unit = ? WHERE id = ?'
            );
            stmt.run(label, target, value, original, unit, id, function (err) {
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
            });
        });
    } else if (type === 'tool') {
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
    } else if (type === 'filter') {
        const { activated } = req.body;
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(
                'UPDATE filters SET activated = ? WHERE id = ?'
            );

            stmt.run(activated ? 1 : 0, label, function (err) {
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
    } else {
        return res.status(400).json({ error: 'Unsupported entity type' });
    }
});

// Route to delete panel data
app.delete('/api/data/:id', (req, res) => {
    const { type } = req.body;

    if (type === 'panel') {
        const panelId = parseInt(req.params.id, 10);

        return new Promise((resolve, reject) => {
            const stmt = db.prepare('DELETE FROM panels WHERE id = ?');
            stmt.run(panelId, function (err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    const deletePanel = {
                        panelId,
                    };
                    resolve(deletePanel);
                }
            });
        });
    } else if (type === 'filter') {
        const filterId = parseInt(req.params.id, 10);

        return new Promise((resolve, reject) => {
            const stmt = db.prepare('DELETE FROM filters WHERE id = ?');
            stmt.run(filterId, function (err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    const deleteFilter = {
                        filterId,
                    };
                    resolve(deleteFilter);
                }
            });
        });
    } else {
        return res.status(400).json({ error: 'Unsupported entity type' });
    }
});

// Route to delete all panel data
app.delete('/api/data', (_, res) => {
    db.run('DELETE FROM panels', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json({ message: 'All panels deleted successfully' });
    });
});

// GraphQL endpoint
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true, // Enable GraphiQL for testing in the browser
    })
);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
