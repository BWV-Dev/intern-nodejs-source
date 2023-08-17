// create-user.dto.ts
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { IsEqualTo } from '../class-validator';

export class UserCreateDTOModel {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation cannot be empty' })
  @IsEqualTo('password', { message: 'Confirm password must match password' })
  passwordConfirmation: string;
}
