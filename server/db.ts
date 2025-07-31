import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use local database for now (Supabase hostname not resolving)
// To use Supabase when available: postgresql://postgres:vedanshho@123@db.gxarrwhxlxbjsuzpgepi.supabase.co:5432/postgres
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

console.log("Using local PostgreSQL database. Supabase URL saved for when hostname resolves.");
export const db = drizzle(client);