import type { Config } from "drizzle-kit";

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    
    // Drizzle-Kit related
    driver: "better-sqlite",
    dbCredentials: {
        url: "sqlite.db"
    }
} satisfies Config;
