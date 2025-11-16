import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator"
import { IsUniqueLogin } from "src/decorators/is-unique-login.decorator"

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsUniqueLogin()
  @IsString()
  login?: string

  @IsOptional()
  @MinLength(6)
  @IsString()
  password?: string

  @IsOptional()
  @Min(18)
  @IsNumber()
  @Type(() => Number)
  age?: number
}