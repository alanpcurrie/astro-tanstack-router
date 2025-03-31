import { betterAuth } from "better-auth";
import  pg from "pg";
 
export const auth = betterAuth({
    database: new pg.Pool({
        connectionString: import.meta.env.DATABASE_URL,
         ssl: true
    })
})