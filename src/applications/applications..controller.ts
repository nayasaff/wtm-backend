import { Body, Controller, Param, Patch, Post, Request, UseGuards, ParseUUIDPipe, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateApplicationDto } from './createApplication.dto';
import { AuthGuard } from 'src/guards/auth.gaurd';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import constants from "src/constants/constants.json"
import { ApplicationsService } from './applications.service';
import { UpdateApplicationDto } from './updateApplication.dto';

@UseGuards(AuthGuard)
@Controller('application')
export class ApplicationController {

    constructor(private applicationService : ApplicationsService){}

    @HttpCode(HttpStatus.OK)
    @Get("user")
    async getUserApplication(@Request() req){
        const userId : string = req.user.id;

        const applications = await this.applicationService.getUserApplication(userId)

    }

    @UseGuards(RolesGuard)
    @Post()
    @Roles([constants.ROLES.JOBSEEKER])
    async applyForJob(@Request() req, @Body() createApplicationDto : CreateApplicationDto){
         const userId : string = req.user.id;
        
         const {jobId, resumeText, coverLetter} = createApplicationDto

         return await this.applicationService.create({
            userId,
            jobId,
            resumeText,
            coverLetter
         })
    }

    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    @Roles([constants.ROLES.ADMIN])
    async updateStatus(@Body() updateApplicationDto : UpdateApplicationDto, @Param('id', ParseUUIDPipe) id: string){

        const {status } = updateApplicationDto

        return await this.applicationService.update(id, status)
    }

    @UseGuards(RolesGuard)
    @Get("job/:jobId")
     @Roles([constants.ROLES.ADMIN])
     async getJobApplication( @Param('jobId') id: string){
        return await this.applicationService.getApplicationsByJobId(id)
     }

     @UseGuards(RolesGuard)
     @Patch("bulk")
      @Roles([constants.ROLES.ADMIN])
      async bulkUpdateStatys(@Body() applications : Array<any>){

        return this.applicationService.updateMany(applications, "reviewed")
      }

}