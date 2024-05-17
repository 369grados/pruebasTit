import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { PassportModule } from "@nestjs/passport"

import { User, UserSchema } from "../users/schemas/user.schema"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // REVIEW: Tengo que estudiar para que podemos utilizar forFeatureAsync
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const secret: string = configService.getOrThrow<string>("auth.secret")
				const expired: string = configService.getOrThrow<string>("auth.expired")
				// TOMAR NOTA: Key Rotation: Si tu infraestructura lo permite, considera implementar una rotación de claves para mejorar la seguridad.
				// TOMAR NOTA: Esto implica cambiar periódicamente la clave secreta utilizada para firmar los tokens.
				return {
					secret: secret,
					signOptions: {
						expiresIn: expired,
						// subject: 'auth', // se utiliza para identificar a quién está destinado el token o a quién se refiere el token.
						// audience: 'http://localhost:3000', // se utiliza para identificar la audiencia a la que está destinado el token.
						// issuer: 'http://localhost:3000', // se utiliza para identificar el servidor que emite el token.
					},
				}
			},
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [MongooseModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
