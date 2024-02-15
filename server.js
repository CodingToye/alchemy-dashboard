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
        value TEXT,
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

// Route to get all panel data
app.get('/api/data', (_, res) => {
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

// Route to insert new panel data
app.post('/api/data/', (req, res) => {
    const { label, value, unit } = req.body;

    if (!label || !value || !unit) {
        console.log('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(
        'INSERT INTO panels (label, value, unit) VALUES (?, ?, ?)'
    );

    stmt.run(label, value, unit, function (err) {
        if (err) {
            console.log('Error inserting data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('Data inserted successfully:', this.lastID);
        res.json({
            id: this.lastID,
            label,
            value,
            unit,
        });
    });
    stmt.finalize();
});

// Route to update panel data
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { label, value, unit } = req.body;
    db.run(
        'UPDATE panels SET label = ?, value = ?, unit = ? WHERE id = ?',
        [label, value, unit, id],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({ message: 'Panel updated successfully' });
        }
    );
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
