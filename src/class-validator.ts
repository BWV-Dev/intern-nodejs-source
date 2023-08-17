import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import get from 'lodash/get';

export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string | number, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = get(args, `object.${relatedPropertyName}`, '');
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}
