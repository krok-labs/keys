import { IsString } from "class-validator";

export class NewKecardContractPayload {
    @IsString()
    faceImage: string;

    @IsString()
    documentImage: string;
};
