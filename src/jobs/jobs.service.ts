import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) {}

    async findById(id : String) {
        return this.prisma.jobs.findUnique({
            where : {
                id 
            }
        })
    }

    async findMany(params : {
        skip : number;
        take : number;
        location : String;
        status : String;
        title : String
    }){

        const {skip, take, location, status, title} = params
        
        let query = {}

        if(location){
            query["location"] = { location: { contains: location, mode: 'insensitive' } }
        }
        if(status) {
            query["status"] = {status : status}
        }
        if(title){
            query["title"] = {title: { contains: location, mode: 'insensitive' }}
        }

        return this.prisma.jobs.findMany({
            skip, 
            take,
            where : query
        })
    }


}