import { Controller, Get } from "@nestjs/common";
import { KeysService } from "../services";

@Controller("/keys")
export class KeysController {
    constructor(
        private readonly keysService: KeysService,
    ) {}

    @Get("")
    public async getAllKeys() {
        return this.keysService.getAllKeys();
    };
};
