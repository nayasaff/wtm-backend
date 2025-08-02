import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import {JobStatus} from "@prisma/client"

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) {}

    async findById(id : string) {
        return this.prisma.jobs.findUnique({
            where : {
                id 
            }
        })
    }

    async findMany(params : {
        location : string;
        status : string;
        title : string
    }){

        const {location, status, title} = params
        
        let query: Record<string, any> = {}

        if(location){
            query.location =  { contains: location, mode: 'insensitive' } 
        }
        if(status) {
            query.status = status
        }
        if(title){
            query.title ={ contains: title, mode: 'insensitive' }
        }

        console.log(query)

        return await this.prisma.jobs.findMany({
            where : query,
            include : {
                applications : true
            }
        })
    }

    async create(params : {
        title : string,
        description : string,
        location : string,
        status : JobStatus,
        salary : number,
        department : string,
        userId : string
    }){

        const {title, description, location, status, salary, department, userId} = params

        return await this.prisma.jobs.create({
            data : {
                title,
                description,
                location,
                status,
                salary,
                department,
                admin : {
                    connect : {id : userId}
                }
            } 

        })
    }

    async update(params : {
        jobId : string,
        title : string,
        description : string,
        location : string,
        status : JobStatus,
        salary : number,
        department : string,
    }){

        const {title, description, location, status, salary, department, jobId} = params

        return this.prisma.jobs.update({
            where : {
                id : jobId
            },
            data : {
                title,
                description,
                department,
                location,
                status,
                salary
            }
        })

    }



}