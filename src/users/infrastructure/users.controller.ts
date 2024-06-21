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
  ApiOperation,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { ListUsersBySectorUseCase } from '../application/usecases/listusersbysector.usecase';
import { ListUsersSectorDto } from './dtos/list-users-sector.dto';
import { UpdateRolesUserDto } from './dtos/update-roles-user.dto';
import { UpdateRolesUserUseCase } from '../application/usecases/update-roles.usecase';
import { UpdateSectorsUserDto } from './dtos/update-sectors-user.dto';
import { UpdateSectorsUserUseCase } from '../application/usecases/update-sectors.usecase';
import { UpdateStatusUserUseCase } from '../application/usecases/update-status.usecase';
import { UpdateStatusUserDto } from './dtos/update-status-user.dto';

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

  @Inject(ListUsersBySectorUseCase.UseCase)
  private listUsersBySectorUseCase: ListUsersUseCase.UseCase;

  @Inject(UpdateRolesUserUseCase.UseCase)
  private updateRolesUserUseCase: UpdateRolesUserUseCase.UseCase;

  @Inject(UpdateSectorsUserUseCase.UseCase)
  private updateSectorsUserUseCase: UpdateSectorsUserUseCase.UseCase;

  @Inject(UpdateStatusUserUseCase.UseCase)
  private updateStatusUserUseCase: UpdateStatusUserUseCase.UseCase;

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
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user with the provided details.',
  })
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

  @Roles(UserRoles.ADMIN)
  @Get()
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
  @ApiOperation({
    summary: 'Search users',
    description: 'This route is accessible only to users with the ADMIN role.',
  })
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output);
  }

  @Roles(UserRoles.SUPERVISOR)
  @Get('sector')
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
  @ApiOperation({
    summary: 'Search users by sectors',
    description:
      'This route is accessible only to users with the SUPERVISOR role.',
  })
  async searchBySectors(
    @Req() request: FastifyRequest,
    @Query() searchParams: ListUsersSectorDto,
  ) {
    const { sectors } = request.user;
    const paramsWithSectorUser = { ...searchParams, sector: sectors };
    const output =
      await this.listUsersBySectorUseCase.execute(paramsWithSectorUser);
    return UsersController.listUsersToResponse(output);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user information',
    description:
      'Returns the details of the currently authenticated user based on the provided token.',
  })
  @ApiOkResponse({
    description: 'Details of the currently authenticated user',
    type: UserPresenter,
  })
  async findMe(@Req() request: FastifyRequest) {
    const { id } = request.user;
    const output = await this.getMeUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Get('jwt')
  @ApiOperation({
    summary: 'Verify JWT token',
    description: 'Verifies the validity of the provided JWT token.',
  })
  async verifyJwt() {
    return;
  }

  @Roles(UserRoles.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'This route is accessible only to users with the ADMIN role.',
  })
  @ApiOkResponse({ type: UserPresenter })
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Roles(UserRoles.ADMIN)
  @Patch(':id/roles')
  async updateRoles(
    @Param('id') id: string,
    @Body() updateRolesUserDto: UpdateRolesUserDto,
  ) {
    const { roles } = updateRolesUserDto;
    const output = await this.updateRolesUserUseCase.execute({ id, roles });
    return UsersController.userToResponse(output);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id/sectors')
  async updateSectors(
    @Param('id') id: string,
    @Body() updateSectorsUserDto: UpdateSectorsUserDto,
  ) {
    const { sectors } = updateSectorsUserDto;
    const output = await this.updateSectorsUserUseCase.execute({ id, sectors });
    return UsersController.userToResponse(output);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusUserDto: UpdateStatusUserDto,
  ) {
    const { status } = updateStatusUserDto;
    const output = await this.updateStatusUserUseCase.execute({ id, status });
    return UsersController.userToResponse(output);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user based on provided credentials and returns user details along with a JWT token.',
  })
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
