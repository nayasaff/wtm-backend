import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { ApplicationStatus } from '@prisma/client';
import { JobService } from 'src/jobs/jobs.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private jobService: JobService,
  ) { }

  async create(payload: {
    jobId: string;
    resumeText: string;
    coverLetter: string;
    userId: string;
  }) {
    const { jobId, resumeText, coverLetter, userId } = payload;

    const exisitingJob = this.jobService.findById(jobId);

    if (!exisitingJob) {
      throw new BadRequestException();
    }

    const exisingApplication = this.findByUserIdAndJobId(userId, jobId);

    if (exisingApplication) {
      throw new BadRequestException('User already applied to this job');
    }

    //Add user id
    return await this.prisma.applications.create({
      data: {
        jobId,
        userId,
        resumeText,
        coverLetter: coverLetter || null,
        status: 'submitted', // Default status
      },
    });
  }

  async findByUserIdAndJobId(userId: string, jobId: string) {
    return await this.prisma.applications.findFirst({
      where: {
        jobId: jobId,
        userId,
      },
    });
  }

  async update(applicationId: string, status: ApplicationStatus) {
    return this.prisma.applications.update({
      where: { id: applicationId },
      data: {
        status: status,
      },
    });
  }

  async getUserApplication(userId: string) {
    const userApplications = await this.prisma.applications.findMany({
      where: {
        userId: userId, // Filter by the user's ID
      },
      include: {
        job: true, // Include the full job details
      },
    });

    return userApplications
  }

  async getApplicationsByJobId(jobId: string) {

    console.log(jobId)
    return await this.prisma.$queryRaw`
    SELECT 
      a.*,
      u.id as "userId",
       u."fullName" as "fullName", 
      u.email
    FROM "Applications" a
    JOIN "Users" u ON a."userId" = u.id
    WHERE a."jobId" = ${jobId} 
  `;
  }

  async updateMany(applications: Array<any>, status: ApplicationStatus) {
    return this.prisma.applications.updateMany({
      where: {
        id: {
          in: applications // Updates records where ID is in the array
        }
      },
      data: {
        status: status, 
      }
    });

  }
} 
