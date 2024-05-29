import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/shared/infrastructure/decorators/public.decorator';
import { Request } from 'express';
import { GetUserUseCase } from '@/users/application/usecases/getuser.usecase';
import { ROLES_KEY } from '@/shared/infrastructure/decorators/roles.decorator';
import { UserRoles } from '@/users/domain/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
    private getUserUseCase: GetUserUseCase.UseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = await this.authService.verifyJwt(token);
      const user = await this.getUserUseCase.execute({ id: decoded.id });
      const { password, avatar, createdAt, updatedAt, ...userRequest } = user;
      request['user'] = userRequest;
      const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (
        requiredRoles &&
        !requiredRoles.some(role => user.roles.includes(role))
      ) {
        throw new UnauthorizedException('Access denied');
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
