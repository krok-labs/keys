import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { KeysService } from "../services";
import { KeysControllerContract } from "../contracts";
import { CommitKeyPayload } from "../payloads";

@Controller("/keys")
export class KeysController implements KeysControllerContract {
    constructor(
        private readonly keysService: KeysService,
    ) {}

    @Get()
    public async getAllKeys() {
        const keys = await this.keysService.getAllKeys();
        return keys.map((key) => ({
            ...key,
            contracts: key.contracts.filter((x) => x.state == 'CURRENTLY_HOLDING')
        }));
    };

    @Get('/:id')
    public getKey(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.keysService.getById(id);
    };

    @Post('/:id/commit')
    public async commitKey(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CommitKeyPayload,
    ) {
        // Getting information about this key
        const key = await this.keysService.getById(id);

        // 1. Checking if this key is available
        if (key.contracts.filter((x) => x.state == 'CURRENTLY_HOLDING').length > 0) {
            throw new Error(`This key is not available right now. CommitIds: [${ key.contracts.map((x) => x.id) }]`);
        };

        // 2. Committing
        return await this.keysService.commit(id, body);
    };

    @Delete('/commits/:commitId')
    public revokeCommit(
        @Param('commitId', ParseIntPipe) commitId: number,
    ) {
        return this.keysService.revokeCommit(commitId);
    };

    @Post('/:id/deposit')
    public async depositKey(
        @Param('id', ParseIntPipe) id: number
    ) {
        // Getting this key's contracts
        const key = await this.keysService.getById(id);
        if (key == null) throw new Error('Key not found');

        // Getting CURRENTLY_HOLDING contracts
        const contracts = key.contracts;
        if (contracts.filter((x) => x.state == 'CURRENTLY_HOLDING').length != 1) throw new Error('Could not deposit this key');

        const contract = contracts[0];
        return this.keysService.depositCommit(contract.id);
    }
};
