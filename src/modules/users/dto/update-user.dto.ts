import { PartialType } from "@nestjs/mapped-types"
import { IsBoolean, IsOptional } from "class-validator"

import { CreateUserDto } from "../../auth/dto/create-user.dto"

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsBoolean()
	@IsOptional()
	isActive?: boolean // REVIEW: Esto no hace el update de este campo
}
