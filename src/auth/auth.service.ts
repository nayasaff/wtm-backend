import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(email : string, password : string, fullName : string){
    const user = await this.usersService.findByUsername(email)

    if(user){
        throw new BadRequestException("Email already exisit")
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    let createdUser = await this.usersService.create(email, fullName, hashedPassword)

    const token  = await this.jwtService.signAsync({id : createdUser.id, role : createdUser.role})

    return {access_token : token, role : createdUser.role, statusCode : 200}
  }

  async logIn(email : string, password : string) {
    const user = await this.usersService.findByUsername(email) 

    const matchedPasswords = await bcrypt.compare(password, user?.password || "");

    if(!matchedPasswords) {
        return new HttpException("Invalid Credentials", HttpStatus.BAD_REQUEST)
    }

    const token =  await this.jwtService.signAsync({id : user.id, role : user.role})

    return {access_token : token, role : user.role, statusCode : 200}
  }

}