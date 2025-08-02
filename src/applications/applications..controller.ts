import { Body, Controller, Param, Patch, Post, Request, UseGuards, ParseUUIDPipe } from '@nestjs/common';
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
export class AuthController {

    constructor(private applicationService : ApplicationsService){}

    @UseGuards(RolesGuard)
    @Post()
    @Roles(constants.ROLES.JOBSEEKER)
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
    @Patch(":id")
    @Roles(constants.ROLES.ADMIN)
    async updateStatus(@Body() updateApplicationDto : UpdateApplicationDto, @Param('id', ParseUUIDPipe) id: string){

        const {status } = updateApplicationDto

        return await this.applicationService.update(id, status)
    }

}