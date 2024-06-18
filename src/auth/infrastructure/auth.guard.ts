import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/shared/infrastructure/decorators/public.decorator';
import { Request } from 'express';
import { ROLES_KEY } from '@/shared/infrastructure/decorators/roles.decorator';
import { UserRoles } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { EVERY_ROLES_KEY } from '@/shared/infrastructure/decorators/every-roles.decorator';
import { UserSectors } from '@/users/domain/entities/user.entity';
import { SECTORS_KEY } from '@/shared/infrastructure/decorators/sectors.decorator';
import { EVERY_SECTORS_KEY } from '@/shared/infrastructure/decorators/every-sectors.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository.Repository,
    private authService: AuthService,
    private reflector: Reflector,
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
      const id = decoded.id;
      const user = await this.userRepository.findById(id);
      const { password, avatar, createdAt, updatedAt, ...userRequest } =
        user.toJSON();
      request['user'] = userRequest;
      const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const requiredEveryRoles = this.reflector.getAllAndOverride<UserRoles[]>(
        EVERY_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const requiredSectors = this.reflector.getAllAndOverride<UserSectors[]>(
        SECTORS_KEY,
        [context.getHandler(), context.getClass()],
      );

      const requiredEverySectors = this.reflector.getAllAndOverride<
        UserSectors[]
      >(EVERY_SECTORS_KEY, [context.getHandler(), context.getClass()]);

      if (
        requiredRoles &&
        !requiredRoles.some(role => user.roles.includes(role))
      ) {
        throw new UnauthorizedException('Access denied');
      }

      if (
        requiredRoles &&
        !requiredRoles.some(role => user.roles.includes(role))
      ) {
        throw new UnauthorizedException('Access denied');
      }

      if (
        requiredEveryRoles &&
        !requiredEveryRoles.every(role => user.roles.includes(role))
      ) {
        throw new UnauthorizedException('Access denied');
      }

      if (
        requiredSectors &&
        !requiredSectors.some(sector => user.sectors.includes(sector))
      ) {
        throw new UnauthorizedException('Access denied');
      }

      if (
        requiredEverySectors &&
        !requiredEverySectors.every(sector => user.sectors.includes(sector))
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
