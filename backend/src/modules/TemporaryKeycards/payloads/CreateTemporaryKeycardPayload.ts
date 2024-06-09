import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTemporaryKeycardPayload {
    @IsNotEmpty()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    middlename: string;
}
