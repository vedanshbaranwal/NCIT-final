import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://postgres:vedanshho@123@db.zxefdhpfnkymtuoyccqe.supabase.co:5432/postgres");
export const db = drizzle(sql);