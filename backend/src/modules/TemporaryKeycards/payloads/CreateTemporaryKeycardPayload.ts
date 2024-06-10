import { IsDate, IsEnum, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { TemporaryKeycardType } from './TemporaryKeycardType';

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

    @IsString()
    @IsOptional()
    cardNumber: string;

    // todo: add ability to add custom expiration date
    @IsDateString()
    @IsOptional()
    expiresAt?: Date;
}
