import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CURRENT IMPLEMENTATION: Reading from JSON file (guru.json)
// ============================================================================

// Read accounts from guru.json
const guruPath = path.join(__dirname, '../data/guru.json');
const getAccounts = () => {
	try {
		const data = fs.readFileSync(guruPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading guru.json:', error);
		return [];
	}
};

// ============================================================================
// MIGRATION TO SQLITE WITH DRIZZLE ORM - Step by Step Guide
// ============================================================================

/*
STEP 1: Install Dependencies
================================
npm install drizzle-orm sqlite3
npm install -D drizzle-kit

STEP 2: Create Database Schema File
====================================
Create: backend/db/schema.ts (or .js)

```javascript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'admin' or 'teacher'
  nama_lengkap: text('nama_lengkap'),
  nip: text('nip'),
  jabatan: text('jabatan'),
});
```

STEP 3: Create Database Connection File
=======================================
Create: backend/db/index.js

```javascript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database('./backend/data/school.db');
export const db = drizzle(sqlite, { schema });
```

STEP 4: Run Migrations (auto-generate tables)
==============================================
npx drizzle-kit generate:sqlite

STEP 5: Seed Database with Existing guru.json Data
==================================================
Create: backend/seed.js

```javascript
import { db } from './db/index.js';
import { users } from './db/schema.js';
import fs from 'fs';

const guruData = JSON.parse(fs.readFileSync('./data/guru.json', 'utf-8'));

async function seed() {
  for (const user of guruData) {
    await db.insert(users).values(user);
  }
  console.log('Database seeded!');
}

seed();
```

Then run: node backend/seed.js

STEP 6: Update This Controller (authController.js)
===================================================
Replace the getAccounts() function and login controller with:

 Import Drizzle
 import { db } from '../db/index.js';
 import { users } from '../db/schema.js';
 import { eq, and } from 'drizzle-orm';
 //New getAccounts using SQLite
 export const getAccounts = async () => {
   try {
     return await db.select().from(users);
   } catch (error) {
     console.error('Error reading from database:', error);
     return [];
   }
 };
 //New login controller using SQLite
 export const login = async (req, res) => {
   try {
     const { username, password } = req.body;
     console.log('Login attempt:', { username, password });

     if (!username || !password) {
       return res.status(400).json({
         success: false,
         message: 'Username and password are required'
       });
     }

     // Query database instead of reading JSON
     const user = await db.select().from(users)
       .where(and(
         eq(users.username, username),
         eq(users.password, password)
       ))
       .limit(1);

     if (!user || user.length === 0) {
       return res.status(401).json({
         success: false,
         message: 'Invalid username or password'
       });
     }

     const foundUser = user[0];
     const token = jwt.sign(
       {
         id: foundUser.id,
         username: foundUser.username,
         email: foundUser.email,
         role: foundUser.role
       },
       JWT_SECRET,
       { expiresIn: '24h' }
     );

     const userResponse = {
       id: foundUser.id,
       username: foundUser.username,
       email: foundUser.email,
       role: foundUser.role,
       nama_lengkap: foundUser.nama_lengkap,
       jabatan: foundUser.jabatan
     };

     return res.status(200).json({
       success: true,
       message: 'Login successful',
       token,
       user: userResponse
     });
   } catch (error) {
     console.error('Login error:', error);
     return res.status(500).json({
       success: false,
       message: 'Internal server error'
     });
   }
 };

*/

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// Login controller
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		console.log('Login attempt:', { username, password }); //debug code

		// Validate input
		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: 'Username and password are required'
			});
		}

		// Get accounts from guru.json
		const accounts = getAccounts();

		// debug code : dont remove until using real database
		console.log('Available accounts:', accounts.length);
		console.log('Guru.json path:', guruPath);
		console.log('Accounts data:', accounts.map(a => ({ username: a.username, password: a.password })));

		// Find user by username and password
		const user = accounts.find(
			account => account.username === username && account.password === password
		);

		// debug code to detect the user already exist and total user founded
		console.log('User found:', !!user);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid username or password'
			});
		}

		// Create JWT token
		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// Return user data without password
		const userResponse = {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			nama_lengkap: user.nama_lengkap,
			jabatan: user.jabatan
		};

		return res.status(200).json({
			success: true,
			message: 'Login successful',
			token,
			user: userResponse
		});
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Logout controller
export const logout = async (req, res) => {
	try {
		// JWT logout is handled on the client side by removing the token
		return res.status(200).json({
			success: true,
			message: 'Logout successful'
		});
	} catch (error) {
		console.error('Logout error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Verify token middleware
export const verifyToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'No token provided'
			});
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token'
		});
	}
};
