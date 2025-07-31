import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll(params : {
        skip? : number;
        take? : number;
    }){

        const {skip, take} = params

        return this.prisma.user.findMany({
            skip,
            take
        });
    }

    async findById(id : String) {
        return this.prisma.user.findUnique({
            where : {
                id 
            }
        })
    }
}