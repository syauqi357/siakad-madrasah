import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',

  // switched to schema.js by folder schema at 
  schema: './src/db/schema/schema.js',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
