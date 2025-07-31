import { Body, Controller, Get, Post, Param} from '@nestjs/common';

@Controller("jobs")
export class JobController{

    @Post("apply/:jobId")
    async applyForJob(@Param('jobId') jobId: string, @Body() applicationData ){
        
    }
}