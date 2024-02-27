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
        unit TEXT
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

// Create the tools table if it doesn't exist
db.run(
    `
    CREATE TABLE IF NOT EXISTS tools(
        id INTEGER PRIMARY KEY,
        label TEXT,
        installed BOOLEAN
    )
    `,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "tools" created or already exists');
        }
    }
);

// Pre-populate the tools table
db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const defaultTools = ['Heating', 'Water', 'Electricity', 'Energy Saving'];
    const insertToolStmt = db.prepare(
        'INSERT INTO tools (label, installed) Values (?,?)'
    );
    defaultTools.forEach((tool) => {
        insertToolStmt.run(tool, 0);
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

app.get('/api/tools', (_, res) => {
    db.all('SELECT id, label, installed FROM tools', (err, rows) => {
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
    const { type, label, installed } = req.body;

    if (!type || !label || typeof isChecked === 'undefined') {
        console.log('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type === 'panel') {
        const { target, value, original, unit } = req.body;

        const stmt = db.prepare(
            'INSERT INTO panels (label, target, value, original, unit) VALUES (?, ?, ?, ?, ?)'
        );

        stmt.run([label, target, value, original, unit], function (err) {
            if (err) {
                console.log('Error inserting data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log('Data inserted successfully:', this.lastID);
            res.json({
                id: this.lastID,
                label,
                target,
                value,
                original,
                unit,
            });
        });
        stmt.finalize();
        return;
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

        db.run(
            'UPDATE panels SET label = ?, target = ?, value = ?, original = ?, unit = ? WHERE id = ?',
            [label, target, value, original, unit, id],
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                res.json({ message: 'Panel updated successfully' });
            }
        );
    } else if (type === 'tool') {
        db.run(
            'UPDATE tools SET installed = ? WHERE label = ?',
            [installed ? 1 : 0, label],
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (this.changes > 0) {
                    res.json({
                        message: `Tool '${label}' updated successfully`,
                    });
                } else {
                    res.status(404).json({
                        error: `Tool '${label}' not found`,
                    });
                }
            }
        );
    } else {
        return res.status(400).json({ error: 'Unsupported entity type' });
    }
});

// Route to delete panel data
app.delete('/api/data/:id', (req, res) => {
    const panelId = parseInt(req.params.id, 10);

    db.run('DELETE FROM panels WHERE id = ?', panelId, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json({ message: 'Panel deleted successfully' });
    });
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
