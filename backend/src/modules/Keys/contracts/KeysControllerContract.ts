import { KeyContractsModel, KeysModel, UsersModel } from "$backend/schema";
import { CommitKeyPayload } from "$backend/modules/Keys/payloads";

export abstract class KeysControllerContract {
    abstract getAllKeys(): Promise<Array<KeysModel & { contracts: KeyContractsModel[] }>>;
    abstract getKey(id: number): Promise<KeysModel & { contracts: KeyContractsModel[] }>;
    abstract commitKey(id: number, body: CommitKeyPayload): Promise<KeyContractsModel>;
    abstract revokeCommit(commitId: number): Promise<{ success: boolean }>;
};
