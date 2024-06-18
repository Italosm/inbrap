import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './shared/infrastructure/decorators/public.decorator';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get welcome message',
    description: 'Returns a welcome message from the application.',
  })
  @ApiOkResponse({
    description: 'Welcome message retrieved successfully',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
