import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: EnvConfigService,
  ) {}

  async generateJwt(userId: string, roles: string[]): Promise<string> {
    const token = await this.jwtService.signAsync({ id: userId }, {});
    return token;
  }

  async verifyJwt(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.getJwtSecret(),
    });
  }
}
