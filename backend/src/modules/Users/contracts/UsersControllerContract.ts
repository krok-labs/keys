import { UserInterface } from "$backend/types";

export abstract class UsersControllerContract {
    abstract getById(id: string): Promise<UserInterface>
};
