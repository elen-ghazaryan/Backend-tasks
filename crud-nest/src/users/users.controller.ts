import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dtos/user.dto';
import { BodyValidationPipe } from 'src/pipes/BodyValidationPipe';
import { whitelist } from 'validator';
import { UpdateUserDto } from 'src/dtos/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers() {
    return { users: this.usersService.getUsers() };
  }

  @Get(':id')
  public getUser(@Param('id') id: string) {
    return { user: this.usersService.getUserById(id) };
  }

  @Delete(':id')
  public deleteUser(@Param('id') id: string) {
    return { deleted: this.usersService.deleteUser(id) };
  }

  @Post()
  @UsePipes(
    new BodyValidationPipe(),
    new ValidationPipe({ 
      whitelist: true,
      stopAtFirstError: true
    })
  )
  public async addUser(@Body() body: UserDto) {
    const user = await this.usersService.addUser(body);
    return { user };
  }

  

  @Patch(':id')
  @UsePipes(
    new BodyValidationPipe(),
    new ValidationPipe({
      transform: true
    })
  )
  public async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, body)
    return { user }
  }
}
