import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(params : {
        skip? : number;
        take? : number;
    }){

        const {skip, take} = params

        return this.prisma.users.findMany({
            skip,
            take
        });
    }

    async findById(id : string) {
        return this.prisma.users.findUnique({
            where : {
                id 
            }
        })
    }

    async findByUsername(email : string){
        return this.prisma.users.findUnique({
            where : {
                email : email
            }
        })
    }

    async create(email : string, fullName : string, password : string){
        return this.prisma.users.create({
            data : {
                email,
                fullName,
                password,
                role : "jobseeker"
            }
        })
    }


}