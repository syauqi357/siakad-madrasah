import { authenticateUser, verifyTokenService } from '../services/authService.js';

// ============================================================================
// CONTROLLER LAYER - Request/Response Handling Only
// ============================================================================

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

STEP 6: Update authService.js
===========================
Replace the authenticateUser function with:

```javascript
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const authenticateUser = async (username, password) => {
  try {
    const user = await db.select().from(users)
      .where(and(
        eq(users.username, username),
        eq(users.password, password)
      ))
      .limit(1);

    if (!user || user.length === 0) {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }

    const foundUser = user[0];
    const token = jwt.sign({...}, JWT_SECRET, { expiresIn: '24h' });

    return {
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Internal server error' };
  }
};
```

*/

// Login controller
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Call service layer to authenticate
		const result = authenticateUser(username, password);

		if (!result.success) {
			return res.status(result.message === 'Username and password are required' ? 400 : 401).json({
				success: false,
				message: result.message
			});
		}

		return res.status(200).json(result);
	} catch (error) {
		console.error('Login controller error:', error);
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
		console.error('Logout controller error:', error);
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

		// Call service layer to verify token
		const result = verifyTokenService(token);

		if (!result.success) {
			return res.status(401).json({
				success: false,
				message: result.message
			});
		}

		// Attach decoded user info to request
		req.user = result.decoded;
		next();
	} catch (error) {
		console.error('Token verification controller error:', error); // debug code
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token'
		});
	}
};
