import { Body, Get, Query, Controller, BadRequestException, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { TemporaryKeycardsControllerContract } from "../contracts";
import { DrizzleDatabase } from "$backend/modules/Sources/services";
import { temporaryKeycards } from "$backend/schema";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateTemporaryKeycardPayload } from "../payloads/CreateTemporaryKeycardPayload";
import { TemporaryKeycardType } from "../payloads";
import * as moment from "moment";
import { and, gte, lte, sql } from 'drizzle-orm';

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

        if (payload.expiresAt != null) {
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
                cardNumber: payload.cardNumber,
                
                documentsImage: documentImage.path,
                faceImage: faceImage.path,
                
                expiresAt: expiresAt.format("YYYY-MM-DD HH:MM:ss"),
            })
            .returning();
    }

    // New method for obtaining temporary cards
    @Get("/temporary")
    public async getTemporaryKeycards(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? moment(startDate).format("YYYY-MM-DD") : moment(0).format("YYYY-MM-DD");
        const end = endDate ? moment(endDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

        return this.database.getInstance()
            .select()
            .from(temporaryKeycards)
            .where(and(
                gte(sql`julianday(expiresAt) - julianday(createdAt)`, 2), // Temporary cards
                gte(temporaryKeycards.createdAt, start),
                lte(temporaryKeycards.createdAt, end)
            ));
    }

    // New method for receiving one-time cards
    @Get("/one-time")
    public async getOneTimeKeycards(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? moment(startDate).format("YYYY-MM-DD") : moment(0).format("YYYY-MM-DD");
        const end = endDate ? moment(endDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

        return this.database.getInstance()
            .select()
            .from(temporaryKeycards)
            .where(and(
                lte(sql`julianday(expiresAt) - julianday(createdAt)`, 2), // One-time cards
                gte(temporaryKeycards.createdAt, start),
                lte(temporaryKeycards.createdAt, end)
            ));
     }
    
}
