// Script to migrate from local PostgreSQL to Supabase
// Run this when Supabase hostname is accessible

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "postgresql://postgres:vedanshho@123@db.gxarrwhxlxbjsuzpgepi.supabase.co:5432/postgres";

function updateDatabaseConnection() {
  const dbPath = path.join(__dirname, '../server/db.ts');
  
  const newContent = `import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Supabase database connection
const connectionString = "${SUPABASE_URL}";
const client = postgres(connectionString);

console.log("Using Supabase PostgreSQL database");
export const db = drizzle(client);
`;

  fs.writeFileSync(dbPath, newContent);
  console.log('✅ Updated database connection to use Supabase');
  console.log('✅ Run "npm run db:push" to sync schema to Supabase');
  console.log('✅ Restart the application to apply changes');
}

// Test connection before switching
async function testSupabaseConnection() {
  try {
    const { default: postgres } = await import('postgres');
    const client = postgres(SUPABASE_URL, { connect_timeout: 5 });
    await client`SELECT 1`;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('Testing Supabase connection...');
  const isConnected = await testSupabaseConnection();
  
  if (isConnected) {
    updateDatabaseConnection();
  } else {
    console.log('⚠️  Supabase not accessible. Keeping local database connection.');
    console.log('💡 Try again later when network connectivity to Supabase is restored.');
  }
}

if (require.main === module) {
  main();
}