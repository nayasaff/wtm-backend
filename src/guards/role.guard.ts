import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
 
    const request = context.switchToHttp().getRequest();
    const {role : userRole} = request.user
    
    let matchedRole = roles.some((role) => userRole === role);

    if(!matchedRole){
      throw new UnauthorizedException()
    }

    return true

  }
}