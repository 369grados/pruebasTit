import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
