import { registerDecorator, type ValidationOptions } from 'class-validator';
import { IsUniqueLoginConstraint } from 'src/validators/is-unique-login.validator';

export function IsUniqueLogin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUniqueLoginConstraint,
    });
  };
}
