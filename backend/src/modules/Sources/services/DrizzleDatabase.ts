import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as BetterSQLite from "better-sqlite3";
import * as schema from "src/schema";

@Injectable()
export class DrizzleDatabase implements OnApplicationBootstrap {
    private readonly sqliteDatabase: BetterSQLite.Database;
    private readonly instance: BetterSQLite3Database<typeof schema>;
    private readonly logger = new Logger(DrizzleDatabase.name);

    constructor() {
        this.sqliteDatabase = new BetterSQLite("sqlite.db");
        this.instance = drizzle(this.sqliteDatabase, { schema });
    };

    public getInstance() {
        return this.instance;
    };

    // onApplicationBootstrap
    // | Bootstrapping drizzle database:
    // | 1. Migrating everything
    // | 2. ...
    async onApplicationBootstrap() {
        this.logger.warn("Migrating database");

        try {
            migrate(this.instance, {
                migrationsFolder: "drizzle"
            });
        } catch(error) {
            this.logger.error("Error while migrating database", error);
        };
    }
};
