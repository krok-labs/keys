import { User } from "@microsoft/microsoft-graph-types";
import { AzureEntraUserInterface } from "@types";

export abstract class AzureEntraSourceContract {
    // - getUserById
    abstract getUserById(id: string): Promise<AzureEntraUserInterface>;
    
    // - searchUserByName
    abstract searchUserByName(name: string): Promise<Array<AzureEntraUserInterface>>;
};
