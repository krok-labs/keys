import type { UsersControllerContract } from "$backend/modules/Users/contracts";
import { ApplicationConfiguration } from "$lib/config";

class UsersServiceClass {
    public async getById(id: string): ReturnType<UsersControllerContract["getById"]> {
        // todo: error handling
        if (!id.startsWith("id=") && !id.startsWith("aid=")) {
            id = `aid=${id}`;
        };

        return (await fetch(`${ApplicationConfiguration.apiUrl}/users/${id}`)).json();
    };
};

export const UsersService = new UsersServiceClass();
