const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// READ: Get all users
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users from database. Is MySQL running?' });
    }
});

// READ: Get a specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const [rows] = await db.pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// CREATE: Add a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const [result] = await db.pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        
        const newUser = {
            id: result.insertId,
            name,
            email
        };

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// UPDATE: Update an existing user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { name, email } = req.body;

        const [current] = await db.pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (current.length > 0) {
            // Validate inputs
            if (!name && !email) {
                return res.status(400).json({ error: 'At least name or email is required for update' });
            }

            const updatedName = name || current[0].name;
            const updatedEmail = email || current[0].email;

            await db.pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [updatedName, updatedEmail, userId]);

            res.status(200).json({ id: userId, name: updatedName, email: updatedEmail });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const [result] = await db.pool.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully', user: { id: userId } });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Delay starting the server until the database is completely ready
initDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to start server because database initialization failed.", err);
    process.exit(1);
});
