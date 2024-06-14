import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  Request,
  Req,
} from '@nestjs/common';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { SignupDto } from './dtos/signup.dto';
import { GetUserUseCase } from '../application/usecases/getuser.usecase';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { UserOutput } from '../application/dtos/user-output';
import {
  UserPresenter,
  UserCollectionPresenter,
} from './presenters/user.presenter';
import { ListUsersDto } from './dtos/list-users.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { SigninDto } from './dtos/signin.dto';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { Public } from '@/shared/infrastructure/decorators/public.decorator';
import { Roles } from '@/shared/infrastructure/decorators/roles.decorator';
import { UserRoles } from '@/users/domain/entities/user.entity';
import { GetMeUseCase } from '../application/usecases/getme.usecase';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiResponse,
  getSchemaPath,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(GetMeUseCase.UseCase)
  private getMeUseCase: GetMeUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  static userToResponse(output: UserOutput, token?: string) {
    const userPresenter = new UserPresenter(output);

    if (token) {
      return { user: userPresenter, token };
    }
    return userPresenter;
  }

  static listUsersToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output);
  }

  @Public()
  @Post()
  @ApiCreatedResponse({ type: UserPresenter })
  @ApiResponse({
    status: 409,
    description: 'Conflito de e-mail',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  async create(@Body() signupDto: SignupDto) {
    const user = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output);
  }

  @Get('me')
  @ApiOkResponse({ type: UserPresenter })
  async findMe(@Req() request: FastifyRequest) {
    const { id } = request.user;
    const output = await this.getMeUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Get('jwt')
  async verifyJwt() {
    return;
  }

  @Roles(UserRoles.ADMIN)
  @Get(':id')
  @ApiOkResponse({ type: UserPresenter })
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Public()
  @Post('login')
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: getSchemaPath(UserPresenter),
        },
        token: {
          type: 'string',
        },
      },
    },
  })
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);
    return UsersController.userToResponse(output, output.token);
  }
}
