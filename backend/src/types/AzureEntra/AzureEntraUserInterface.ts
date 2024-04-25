import { User } from "@microsoft/microsoft-graph-types";

export type AzureEntraUserInterface = 
    // 'displayName', 'id', 'userPrincipalName', 'jobTitle', 'officeLocation'
    Pick<User, "displayName" | "jobTitle" | "userPrincipalName" | "officeLocation"> &
    { aid: string };