import type { Config } from "drizzle-kit";

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    
    // Drizzle-Kit related
    dialect: 'sqlite',
    dbCredentials: {
        url: "sqlite.db"
    }
} satisfies Config;
