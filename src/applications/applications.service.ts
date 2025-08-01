import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { ApplicationStatus } from '@prisma/client';
import { JobService } from 'src/jobs/jobs.service';

@Injectable()
export class ApplicationsService {
    
    constructor(private prisma: PrismaService, private jobService : JobService) {}

    async create(payload : {
        jobId : string,
        resumeText : string,
        coverLetter : string,
        userId : string
    }){
        const {jobId, resumeText, coverLetter, userId} = payload

        const exisitingJob = this.jobService.findById(jobId)

        if(!exisitingJob){
            throw new BadRequestException()
        }

        //Add user id 
        return await this.prisma.applications.create({
               data: {
                    jobId,
                    userId ,
                    resumeText,
                    coverLetter: coverLetter || null,
                    status: 'submitted' // Default status
                },
        })
    }

    async update(applicationId : string, status: ApplicationStatus){
        
        return this.prisma.applications.update({
            where : {id : applicationId},
            data : {
                status : status
            }
        })
    }

}