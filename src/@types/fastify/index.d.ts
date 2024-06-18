import { UserSectors } from '@/users/domain/entities/user.entity';
import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      sectors?: UserSectors[];
    };
  }
}
