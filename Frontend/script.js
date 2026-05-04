const API_URL = 'http://localhost:3000/users';

// DOM Elements
const usersContainer = document.getElementById('usersContainer');
const addUserForm = document.getElementById('addUserForm');
const statusMessage = document.getElementById('statusMessage');
const refreshBtn = document.getElementById('refreshBtn');

// Helper to get initials for avatar
const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

// Show status message
const showStatus = (message, isError = false) => {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusMessage.className = 'status-message';
    }, 3000);
};

// Fetch and render users
const fetchUsers = async () => {
    try {
        // Show loading state if container is empty
        if (usersContainer.children.length === 0 || usersContainer.querySelector('.loading-state')) {
            usersContainer.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Fetching users...</p>
                </div>
            `;
        }

        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        usersContainer.innerHTML = `
            <div class="loading-state">
                <p style="color: var(--danger)">Error loading users. Is the backend running?</p>
            </div>
        `;
    }
};

// Render users to DOM
const renderUsers = (users) => {
    if (users.length === 0) {
        usersContainer.innerHTML = `
            <div class="loading-state">
                <p>No users found. Add one above!</p>
            </div>
        `;
        return;
    }

    usersContainer.innerHTML = '';
    
    users.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'user-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="user-info">
                <div class="avatar">${getInitials(user.name)}</div>
                <div class="details">
                    <h3 title="${user.name}">${user.name}</h3>
                    <p title="${user.email}">${user.email}</p>
                </div>
            </div>
            <div class="user-actions">
                <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        
        usersContainer.appendChild(card);
    });
};

// Add new user
const addUser = async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    const newUser = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };
    
    if (!newUser.name || !newUser.email) {
        showStatus('Please fill in all fields', true);
        return;
    }

    const submitBtn = addUserForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Adding...</span>';
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) throw new Error('Failed to add user');

        // Reset form
        addUserForm.reset();
        showStatus('User added successfully!');
        
        // Refresh list
        fetchUsers();
    } catch (error) {
        console.error('Error adding user:', error);
        showStatus('Error adding user. Try again.', true);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
};

// Delete user
const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete user');
        
        showStatus('User deleted successfully!');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        showStatus('Error deleting user. Try again.', true);
    }
};

// Event Listeners
addUserForm.addEventListener('submit', addUser);
refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => refreshBtn.style.transform = 'none', 300);
    fetchUsers();
});

// Initial load
document.addEventListener('DOMContentLoaded', fetchUsers);
