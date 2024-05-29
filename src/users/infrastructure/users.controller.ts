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
import { AuthService } from '@/auth/infrastructure/auth.service';
import { SigninDto } from './dtos/signin.dto';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { Public } from '@/shared/infrastructure/decorators/public.decorator';
import { Roles } from '@/shared/infrastructure/decorators/roles.decorator';
import { UserRoles } from '@/users/domain/entities/user.entity';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: UserOutput, token?: string) {
    const userPresenter = new UserPresenter(output);
    const response = { data: userPresenter };
    if (token) {
      response['token'] = token;
    }
    return response;
  }

  static listUsersToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output);
  }

  @Public()
  @Post()
  async create(@Body() signupDto: SignupDto) {
    const user = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(user);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output);
  }

  @Get('me')
  async findMe(@Req() request) {
    const { id } = request.user;
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Roles(UserRoles.ADMIN)
  @Get(':id')
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
  async login(@Body() signinDto: SigninDto) {
    const user = await this.signinUseCase.execute(signinDto);
    const token = await this.authService.generateJwt(user.id, user.roles);
    return UsersController.userToResponse(user, token);
  }
}
