import { Injectable } from "@nestjs/common";
import { AzureEntraSourceContract } from "@contracts";
import { ClientSecretCredential, TokenCredential } from "@azure/identity";
import { AzureEntraClientConfiguration } from "src/config";
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { AuthenticationProvider, Client } from '@microsoft/microsoft-graph-client';
import { User } from "@microsoft/microsoft-graph-types";
import { transformEntraUser } from "../helpers/AzureEntra";
import { AzureEntraUserInterface } from "@types";

// Microsoft Graph Configurations
const SELECT_USER_FIELDS = ['displayName', 'id', 'userPrincipalName', 'jobTitle', 'officeLocation'];

@Injectable()
export class AzureEntraSource implements AzureEntraSourceContract {
    private readonly credentials: TokenCredential; 
    private readonly authProvider: AuthenticationProvider;
    private readonly client: Client;
    
    constructor() {
        // Creating our ClientSecretCredentials, creating token-based auth strategy and creating our
        // msgraph client
        this.credentials = new ClientSecretCredential(
            AzureEntraClientConfiguration.tenantId,
            AzureEntraClientConfiguration.clientId,
            AzureEntraClientConfiguration.clientSecret,
        );

        this.authProvider = new TokenCredentialAuthenticationProvider(this.credentials, {
            // @huskie you ask me why? idk
            scopes: ["https://graph.microsoft.com/.default"]
        });

        this.client = Client.initWithMiddleware({
            authProvider: this.authProvider,
        });
    };

    public async getUserById(id: string): Promise<AzureEntraUserInterface> {
        return transformEntraUser(
            await this.client
                .api(`/users/${id}`)
                .select(SELECT_USER_FIELDS)
                .get()
            );
    }

    public async searchUserByName(name: string): Promise<AzureEntraUserInterface[]> {
        const users = (
            await this.client
                .api('/users')
                .select(SELECT_USER_FIELDS)
                .header("ConsistencyLevel", "eventual")
                .search(`"displayName:${name}"`)
                .get()
        ).value as User[];

        return users.map((user) => transformEntraUser(user));
    }
};
