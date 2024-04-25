import { User } from "@microsoft/microsoft-graph-types";
import { AzureEntraUserInterface } from "@types";

export function transformEntraUser(user: User): AzureEntraUserInterface {
    return {
        ...user,
        aid: user.id,
        
        // @huskie removing junk fields. Is there another, more "normal" way to do this?
        // @ts-ignore
        id: undefined,
    }
};
