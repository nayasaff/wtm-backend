import {  IsEnum } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import {APPLICATION_STATUS} from "src/constants/constants.json"

export class UpdateApplicationDto {
  @IsEnum([APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.REVIEWED], {
    message: `Status must be one of: ${Object.values(ApplicationStatus).join(', ')}`
  })
  status: ApplicationStatus;
    
}