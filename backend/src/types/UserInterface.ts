import { UsersModel } from "src/schema";
import { AzureEntraUserInterface } from "./AzureEntra";

export type UserInterface = AzureEntraUserInterface
    & { id: number }
    & { avatarUrl: string };
