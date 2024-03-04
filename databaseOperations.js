import db from './database.js';

export function insertPanel(label, target, value, original, unit) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'INSERT INTO panels (label, target, value, original, unit) VALUES (?, ?, ?, ?, ?)'
        );

        stmt.run(label, target, value, original, unit, function (err) {
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
            };
            console.log(panel);
            resolve(panel);
        });
        stmt.finalize();
    });
}

export function updatePanel(label, target, value, original, unit, id) {
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
}

export function deletePanel(id) {
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
}

// This function is not being used within my resolver, I may well revisit.
export function updateToolInstallationStatus(label, installed) {
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
}

export function updateToolActivationStatus(label, activated) {
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
}
