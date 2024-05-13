import { Body, Controller, Post } from "@nestjs/common";
import { TemporaryKeycardsControllerContract } from "../contracts";
import { NewKecardContractPayload } from "../payloads";
import { DrizzleDatabase } from "$backend/modules/Sources/services";
import { temporaryKeycards } from "$backend/schema";

@Controller("/keycards")
export class TemporaryKeycardController implements TemporaryKeycardsControllerContract {
    constructor(
        private readonly database: DrizzleDatabase,
    ) {}
    
    @Post("/contract")
    public async handleNewContract(
        // omg
        @Body() body: NewKecardContractPayload
    ) {
        // omg x2
        return this.database.getInstance()
            .insert(temporaryKeycards)
            .values({
                documentsScan: body.documentImage,
                createdAt: body.faceImage,
            })
            .returning();
    };
};
