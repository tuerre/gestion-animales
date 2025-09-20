import dotenv from "dotenv";
import { createClient, processLock } from "@supabase/supabase-js";

dotenv.config();

export const supabase = createClient(
  process.env.PROJECT_URL as string,
  process.env.ANON_KEY as string
);
