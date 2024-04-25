import { Injectable } from "@nestjs/common";
import { FirebirdSourceContract } from "@contracts";

// todo: implement non-mock variant
@Injectable()
export class MockFirebirdService implements FirebirdSourceContract {
    public async resolveNameFromKeycard(keycardId: number): Promise<string> {
        // todo: implement
        return "Спичак Гліб Павлович";
    }
};
