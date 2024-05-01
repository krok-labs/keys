import { IsNumber } from "class-validator";

export class CommitKeyPayload {
    @IsNumber()
    userId: number;
};
