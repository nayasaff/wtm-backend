import {  IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    jobId : string;

    @IsString()
    @IsNotEmpty()
    resumeText;

    @IsString()
    coverLetter?;
}
