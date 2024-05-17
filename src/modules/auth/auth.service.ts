import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import * as bcrypt from "bcrypt"
import mongoose, { Model } from "mongoose"

import {
	MongoDuplicateError,
	MongoValidationError,
} from "src/common/database/errors/mongodb.errors"
import { User } from "../users/schemas/user.schema"
import { LoginUserDto } from "./dto/login-user.dto"
import { iJwtPayload } from "./interfaces/jwt-payload.interface"

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly jwtService: JwtService,
	) {}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.validateUser(loginUserDto)
		if (!user) throw new UnauthorizedException("Not valid credentials.")

		return this.prepareResponse(user)
	}

	async register(createUserDto) {
		// REVIEW: Añadir el DTO
		const { password, ...userData } = createUserDto

		const hashedPassword = await this.hashPassword(password)
		try {
			const createdUser = await this.userModel.create({
				...userData,
				password: hashedPassword,
			})

			return this.prepareResponse(createdUser)
		} catch (error) {
			if (error.code === 11000) {
				// Identifica específicamente el error de duplicación de clave de MongoDB
				const duplicatedField = Object.keys(error.keyValue).join(", ")
				throw new MongoDuplicateError(error)
				// biome-ignore lint/style/noUselessElse: <explanation>
			} else if (error instanceof mongoose.Error) {
				throw new MongoValidationError(error)
			}

			console.log("SE ESTA ESCAPANDO")
		}
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10)
	}

	private async validateUser(loginUserDto: LoginUserDto): Promise<User | null> {
		const { email, password } = loginUserDto
		const user = await this.userModel.findOne({ email }, { password: 1 })

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return null
		}

		return user
	}

	private prepareResponse(user: User) {
		const res = this.excludePrivateFields(user)
		const token = this.getJwtToken({ id: user._id })
		return { ...res, token }
	}

	private excludePrivateFields(user: User) {
		const { password, __v, ...responseWithoutFields } = user.toObject()
		return responseWithoutFields
	}

	private getJwtToken(payload: iJwtPayload) {
		const token = this.jwtService.sign(payload)
		return token
	}
}
