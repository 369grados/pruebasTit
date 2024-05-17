import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { PassportStrategy } from "@nestjs/passport"
import { Model } from "mongoose"
import { ExtractJwt, Strategy } from "passport-jwt"

import { User } from "src/modules/users/schemas/user.schema"
import { iJwtPayload } from "../interfaces/jwt-payload.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		configService: ConfigService,
	) {
		super({
			secretOrKey: configService.getOrThrow<string>("auth.secret"),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
		})
	}

	async validate(payload: iJwtPayload): Promise<User> {
		const { id } = payload
		const user = await this.userModel.findById(id)

		if (!user) throw new UnauthorizedException("Token not valid.")

		if (!user.isActive)
			throw new UnauthorizedException(
				"User not active, talk with an administrator.",
			)

		return user
	}
}
