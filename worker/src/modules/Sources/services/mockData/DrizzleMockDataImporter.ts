import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DrizzleDatabase } from "../DrizzleDatabase";
import { allowedKeys, keys, users } from "src/schema";
import { MockDataConfiguration } from "src/config";

@Injectable()
export class DrizzleMockDataImporter implements OnApplicationBootstrap {
    private readonly logger = new Logger(DrizzleMockDataImporter.name);
    
    constructor(
        private readonly database: DrizzleDatabase
    ) {}
    
    async onApplicationBootstrap() {
        if (!MockDataConfiguration.importMockData) return;

        this.logger.warn("Importing mock data");

        if (MockDataConfiguration.clearDatabaseBeforeImport) {
            // Clearing all tables
            await this.database.getInstance().delete(allowedKeys);
            await this.database.getInstance().delete(keys);
            await this.database.getInstance().delete(users);
        };

        // Test Keys
        const testKeys = await this.database.getInstance().insert(keys)
            .values([
                { nfcId: 1111111, },
                { nfcId: 2111111, },
                { nfcId: 3211111, },
            ]).returning();

        // Test User
        const user = await this.database.getInstance().insert(users)
            .values({
                aid: "85f4808b-7e9d-4523-9659-407262f31054"
            }).returning();

        // Allowing test keys to Test User
        await this.database.getInstance().insert(allowedKeys)
            .values([
                { userId: user[0].id, keyId: testKeys[0].id },
                { userId: user[0].id, keyId: testKeys[1].id }
            ]);

        this.logger.warn("Imported mock data");
    };
};
