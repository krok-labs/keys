import { Injectable } from "@nestjs/common";
import { UserInterface } from "@types";
import { eq } from "drizzle-orm";
import { DrizzleDatabase } from "src/modules/Sources/services";
import { UsersService } from "src/modules/Users/services";
import { allowedKeys, keys, users } from "src/schema";

@Injectable()
export class KeysService {
    constructor(
        private readonly database: DrizzleDatabase,
        private readonly usersService: UsersService,
    ) {}

    public async getAllKeys() {
        return await this.database.getInstance()
            .select().from(keys);
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

    public getAllowedKeys(user: UserInterface) {
        return this.getAllowedKeysFromAid(user.aid);
    };
};
