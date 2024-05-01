import { Injectable } from "@nestjs/common";
import { UserInterface } from "@types";
import { eq } from "drizzle-orm";
import { DrizzleDatabase } from "src/modules/Sources/services";
import { UsersService } from "src/modules/Users/services";
import { UsersModel, keyContracts, keys, users } from "src/schema";
import { CommitKeyPayload } from "../payloads";

@Injectable()
export class KeysService {
    constructor(
        private readonly database: DrizzleDatabase,
        private readonly usersService: UsersService,
    ) {}

    public async getAllKeys() {
        return await this.database.getInstance()
            .query.keys.findMany({
                with: {
                    contracts: {
                        orderBy: keyContracts.pickedUpAt,
                        limit: 10
                    }
                },
            });
    };

    public async getById(id: number) {
        return await this.database.getInstance()
            .query.keys.findFirst({
                with: {
                    contracts: {
                        orderBy: keyContracts.pickedUpAt,
                        limit: 10
                    }
                },
                where: (keys, { or, eq }) => or(eq(keys.id, id), eq(keys.nfcId, id))
            });
    };

    public async commit(id: number, body: CommitKeyPayload) {
        // Getting this userId
        const user = await this.usersService.getUserById(body.userId);
        if (user == null) throw new Error(`User with id [${body.userId}] not found.`);

        // Committing this key and returning commit information
        return (
                await this.database.getInstance()
                    .insert(keyContracts)
                    .values({
                        userId: user.id,
                        keyId: id,
                    })
                    .returning()
            )[0];
    };

    public async updateCommit(commitId: number, state: 'CURRENTLY_HOLDING' | 'DEPOSITED') {

    };

    public async revokeCommit(commitId: number) {
        // Getting this commit
        const commitsList = await this.database.getInstance()
            .select()
            .from(keyContracts)
            .where(eq(keyContracts.id, commitId));

        // okai
        if (commitsList.length != 1) throw new Error('Commit not found');

        const commit = commitsList[0];

        // Checking if we can revoke this commit
        // 1. Checking commit state
        if (commit.state != 'CURRENTLY_HOLDING') throw new Error('Could not revoke this commit due to invalid state');
        
        // 2. Checking if commit.pickedUpAt
        // if (commit.pickedUpAt) throw new Error('Could not revoke this commit due to it being older than 10 minutes from it\'s pickup time');

        // Revoking this commit
        await this.database.getInstance()
            .delete(keyContracts)
            .where(eq(keyContracts.id, commitId));
    
        return {
            success: true,
        };
    };

    // getAllowedKeys
    // | Fetches every allowed key for provided user
    public async getAllowedKeysFromAid(aid: string) {
        // Fetching (opr creating) this user account
        let user = 
            (await this.database.getInstance()
                .select()
                    .from(users)
                    .where(eq(users.aid, aid))
                    .limit(1)
            )[0];

        if (user == null) {
            // Creating new user
            user = await this.usersService.createNewUser(aid);
        };
        
        // Getting all allowedKeys relations with keys and returning them
        const keys = await this.database.getInstance()
            .query.allowedKeys.findMany({
                with: {
                    key: true
                },
                where: (allowedKeys, { eq }) => eq(allowedKeys.userId, user.id),
            });

        return keys;
    };

    public getAllowedKeys(user: UsersModel) {
        return this.getAllowedKeysFromAid(user.aid);
    };
};
