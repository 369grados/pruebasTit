import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

import { AuthService } from "./auth.service"
import { CreateUserDto, LoginUserDto } from "./dto"
//import { Auth, GetUser, RawHeader, RoleProtected } from './decorators';

//import { UserRoleGuard } from './guards/user-role/user-role.guard';
//import { iValidRoles } from './interfaces';
//import { User } from './schemas/user.schema';

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@HttpCode(HttpStatus.ACCEPTED)
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto)
	}

	@Post("register")
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createUserDto) {
		// REVIEW: Añadir el DTO
		return this.authService.register(createUserDto)
	}

	//   @Get('private')
	//   @UseGuards(AuthGuard())
	//   private(@GetUser() user: User, @GetUser('email') userEmail: string, @RawHeader() rawHeaders: string[]) {
	//     console.log(rawHeaders);
	//     // console.log(userEmail);

	//     return {
	//       user,
	//       userEmail,
	//       rawHeaders,
	//     };
	//   }

	//   @Get('private2')
	//   @RoleProtected(iValidRoles.admin)
	//   //@SetMetadata('roles', ['admin', 'user']) // REVIEW: Esto hace que el endpoint sea accesible solo para los usuarios con el rol admin.
	//   @UseGuards(AuthGuard(), UserRoleGuard)
	//   private2(@GetUser() user: User) {
	//     return {
	//       user,
	//     };
	//   }

	//   @Get('private3')
	//   @Auth(iValidRoles.admin)
	//   private3(@GetUser() user: User) {
	//     return {
	//       user,
	//     };
	//   }
}
