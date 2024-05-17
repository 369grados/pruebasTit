import { Type } from "class-transformer"
import {
	IsArray,
	IsDate,
	IsEmail,
	IsEnum,
	IsISO31661Alpha2,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength,
	ValidateNested,
} from "class-validator"
import {
	GenderType,
	PhoneNumbersType,
} from "src/common/interfaces/valid-dataPersonalType"

export class OthersEmailsDto {
	@IsEmail()
	@IsNotEmpty()
	address: string

	@IsString()
	type: string

	@IsString()
	@IsNotEmpty()
	description: string
}

export class PhoneNumbersDto {
	@IsString()
	@IsNotEmpty()
	number: string

	@IsEnum(PhoneNumbersType)
	@IsOptional()
	type: PhoneNumbersType

	@IsString()
	@IsNotEmpty()
	description: string
}

export class LoginRecordDto {
	@IsDate()
	@Type(() => Date)
	loginDate: Date

	@IsString()
	ipAddress: string
}

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	firstName: string

	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	lastName1: string

	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	lastName2: string

	@IsEnum(GenderType)
	gender: GenderType

	@IsDate()
	dateOfBirth: Date

	@IsISO31661Alpha2()
	nationality: string

	@IsEmail()
	email: string

	@ValidateNested({ each: true })
	@Type(() => PhoneNumbersDto)
	@IsArray()
	phoneNumbers: PhoneNumbersDto[]

	@ValidateNested({ each: true })
	@Type(() => OthersEmailsDto)
	@IsArray()
	othersEmails: OthersEmailsDto[]

	@IsString()
	@MinLength(8)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"ValidDto: The password must have a Uppercase, lowercase letter and a number",
	})
	password: string

	@ValidateNested({ each: true })
	@Type(() => LoginRecordDto)
	@IsArray()
	loginRecords: LoginRecordDto[]

	// ... [otros campos que desees incluir del modelo original]
}
