const mysql = require('mysql2/promise');
require('dotenv').config();

const db = {
    pool: null
};

const initDatabase = async () => {
    const dbName = process.env.DB_NAME || 'codveda_db';
    
    try {
        // 1. Temporary connection to create database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' ensured.`);
        await connection.end();

        // 2. Create the main pool WITH the database explicitly selected
        db.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 3. Create table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.pool.query(createTableQuery);
        
        // 4. Remove any hardcoded sample data (John Doe, Jane Smith) if they somehow got in
        await db.pool.query(`DELETE FROM users WHERE email IN ('john.doe@example.com', 'jane.smith@example.com')`);

        console.log("Users table is ready and sample data removed.");
    } catch (error) {
        console.error("Error initializing database. Please check MySQL connection:", error.message);
        throw error;
    }
};

module.exports = {
    db,
    initDatabase
};
