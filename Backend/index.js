const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for the resource (users)
let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
];

// READ: Get all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// READ: Get a specific user by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// CREATE: Add a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE: Update an existing user by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Validate inputs
        if (!name && !email) {
            return res.status(400).json({ error: 'At least name or email is required for update' });
        }

        // Update fields
        users[userIndex] = {
            ...users[userIndex],
            name: name || users[userIndex].name,
            email: email || users[userIndex].email
        };

        res.status(200).json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser[0] });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
