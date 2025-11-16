import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator"
import { IsUniqueLogin } from "src/decorators/is-unique-login.decorator"

export class UserDto {
  @IsString()
  @IsNotEmpty({ message: "username is required" })
  username: string

  @IsUniqueLogin()
  @IsString()
  @IsNotEmpty({ message: "login is required" })
  login: string

  @MinLength(6)
  @IsString()
  @IsNotEmpty({ message: "password is required" })
  password: string

  @Min(18)
  @IsNumber()
  @IsNotEmpty({ message: "age is required"})
  @Type(() => Number)
  age: number
}