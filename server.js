const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS panels(
        id INTEGER PRIMARY KEY,
        label TEXT,
        value TEXT,
        suffix TEXT
    )
`);

app.get('/api/data', (_, res) => {
    db.all('SELECT * FROM panels', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(rows);
    });
});

app.post('/api/data/', (req, res) => {
    const { label, value, suffix } = req.body;

    if (!label || !value || !suffix) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(
        'INSERT INTO panels (label, value, suffix) VALUES (?, ? , ?)'
    );
    stmt.run(label, value, suffix, function (err) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json({
            id: this.lastID,
            label,
            value,
            suffix,
        });
    });
    stmt.finalize();
});

app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { label, value, suffix } = req.body;

    db.run(
        'UPDATE panels SET label = ?, value = ?, suffix = ? WHERE id = ?',
        [label, value, suffix, id],
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
