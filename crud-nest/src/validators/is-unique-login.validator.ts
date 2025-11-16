import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, type ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { UsersService } from "src/users/users.service";

@ValidatorConstraint({ name: 'IsUniqueLogin', async: false })
@Injectable()
export class IsUniqueLoginConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  validate(value: any, args: ValidationArguments): boolean {
    if(!value) return false;
    const user = this.usersService.findByLogin(value)
    return !user  
  }

  defaultMessage(): string {
    return 'This login is already taken'
  }
}