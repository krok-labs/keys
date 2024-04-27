import { UsersModel } from "src/schema";
import { AzureEntraUserInterface } from "./AzureEntra";

export type UserInterface = AzureEntraUserInterface &
    { avatarUrl: string };
