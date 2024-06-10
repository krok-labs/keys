import { Body, Controller, BadRequestException, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { TemporaryKeycardsControllerContract } from "../contracts";
import { DrizzleDatabase } from "$backend/modules/Sources/services";
import { temporaryKeycards } from "$backend/schema";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateTemporaryKeycardPayload } from "../payloads/CreateTemporaryKeycardPayload";
import { TemporaryKeycardType } from "../payloads";
import * as moment from "moment";

@Controller("/keycards")
export class TemporaryKeycardController implements TemporaryKeycardsControllerContract {
    constructor(
        private readonly database: DrizzleDatabase,
    ) {}
    
    @Post("/contract")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'faceImage', maxCount: 1 },
        { name: 'documentImage', maxCount: 1 },
    ], {
        dest: "./upload",
    }))
    public async handleNewContract(
        @Body() payload: CreateTemporaryKeycardPayload,
        @UploadedFiles() files: { faceImage?: Express.Multer.File[], documentImage?: Express.Multer.File[] }
    ) {
        // Checking if we have every needed file
        if (files.documentImage?.length != 1 || files.faceImage?.length != 1) {
            throw new Error("Invalid files provided");
        };

        const faceImage = files["faceImage"][0];
        const documentImage = files["documentImage"][0];

        // Checking this card's type
        let expiresAt = moment().startOf("day");
        expiresAt.add("1", "day");

        if (payload.type == TemporaryKeycardType.TEMPORARY) {
            // todo: standartize errors
            if (payload.expiresAt == null) throw new BadRequestException("No expiresAt property provided");
            
            // Updating expiresAt
            // todo: check provided expiresAt date
            expiresAt = moment(payload.expiresAt);
        }

        return this.database.getInstance()
            .insert(temporaryKeycards)
            .values({
                surname: payload.surname,
                firstname: payload.firstname,
                middlename: payload.middlename,
                
                documentsImage: documentImage.path,
                faceImage: faceImage.path,
                
                expiresAt: expiresAt.format("YYYY-MM-DD HH:MM:ss"),
            })
            .returning();
    };
};
