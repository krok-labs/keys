import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { TemporaryKeycardsControllerContract } from "../contracts";
import { DrizzleDatabase } from "$backend/modules/Sources/services";
import { temporaryKeycards } from "$backend/schema";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import multer from "multer";

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
        @UploadedFiles() files: { faceImage?: Express.Multer.File[], documentImage?: Express.Multer.File[] }
    ) {
        console.log(files);
        // Checking if we have every needed file
        if (files.documentImage?.length != 1 || files.faceImage?.length != 1) {
            throw new Error("Invalid files provided");
        };

        const faceImage = files["faceImage"][0];
        const documentImage = files["documentImage"][0];

        return this.database.getInstance()
            .insert(temporaryKeycards)
            .values({
                documentsImage: documentImage.path,
                faceImage: faceImage.path,
            })
            .returning();
    };
};
