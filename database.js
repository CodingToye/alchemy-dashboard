import sqlite3 from 'sqlite3';

// Connect to the SQLite database
const db = new sqlite3.Database('./database.db');

export default db;
