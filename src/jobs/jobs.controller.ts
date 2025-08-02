import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PostJobDto } from './postJobDto';
import { JobService } from './jobs.service';
import { AuthGuard } from 'src/guards/auth.gaurd';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import constants from "../constants/constants.json"

@UseGuards(AuthGuard)
@Controller("jobs")
export class JobController {

    constructor(private jobService: JobService) { }

    @Get()
    async getJobs(@Query('status') status?: string,
        @Query('title') title?: string,
        @Query('location') location?: string,) {

        const filters = {
            ...(title && { title }),
            ...(location && { location }),
            ...(status && { status })
        };

        return await this.jobService.findMany(filters)
    }

    @UseGuards(RolesGuard)
    @Post()
    @Roles([constants.ROLES.ADMIN])
    async postJob(@Request() req, @Body() postJobDto: PostJobDto) {
        const userId: string = req.user.id;

        const { title, salary, department, location, status, description } = postJobDto

        return await this.jobService.create({
            title,
            salary: Number(salary),
            department,
            location,
            status,
            userId,
            description
        })

    }


    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    @Roles([constants.ROLES.ADMIN])
    async patchJob(@Request() req, @Body() postJobDto: PostJobDto,@Param('id', ParseUUIDPipe) id: string ){

        const { title, salary, department, location, status, description } = postJobDto


        
        return await this.jobService.update({
            jobId : id,
            title,
            salary,
            location,
            status,
            department,
            description
        })

    }
}