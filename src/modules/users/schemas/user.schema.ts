import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
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
import { Document, Types } from "mongoose"
import {
	GenderType,
	PhoneNumbersType,
} from "src/common/interfaces/valid-dataPersonalType"

class OthersEmails {
	@IsEmail()
	@IsNotEmpty()
	address: string

	@IsString()
	type: string

	@IsString()
	@IsNotEmpty()
	description: string
}

class PhoneNumbers {
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

class LoginRecord {
	@IsDate()
	@Type(() => Date)
	loginDate: Date

	@IsString()
	ipAddress: string
}
// REVIEW: Implementar esto de abajo
//   class Activity {
// 	@IsString()
// 	type: string; // Ejemplo: 'post', 'comment'

// 	@IsDate()
// 	@Type(() => Date)
// 	timestamp: Date;

// 	@IsString()
// 	description: string;
//   }

@Schema({ timestamps: true })
export class User extends Document {
	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	@Prop({ required: true, trim: true, lowercase: true })
	firstName: string

	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	@Prop({ required: true, trim: true, lowercase: true })
	lastName1: string

	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	@Prop({ required: true, trim: true, lowercase: true })
	lastName2: string

	@IsEnum(GenderType)
	@Prop()
	gender: GenderType

	@IsDate()
	@Prop()
	dateOfBirth: Date

	@IsISO31661Alpha2()
	@Prop()
	nationality: string

	@IsEmail()
	@Prop({ required: true, unique: true, trim: true, lowercase: true })
	email: string

	@ValidateNested({ each: true })
	@Type(() => PhoneNumbers)
	@IsArray()
	@Prop({ type: [PhoneNumbers] })
	phoneNumbers: PhoneNumbers[]

	@ValidateNested({ each: true })
	@Type(() => OthersEmails)
	@IsArray()
	@Prop({ type: [OthersEmails] })
	othersEmails: OthersEmails[]

	@IsString()
	@MinLength(8)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"ValidDb: The password must have a Uppercase, lowercase letter and a number",
	})
	@Prop({ required: true })
	password: string

	@Prop({ default: true })
	isActive: boolean

	@ValidateNested({ each: true })
	@Type(() => LoginRecord)
	@IsArray()
	@Prop({ type: [LoginRecord] })
	loginRecords: LoginRecord[]

	// REVIEW: Implementar esto de abajo
	// @ValidateNested({ each: true })
	// @Type(() => Activity)
	// @IsArray()
	// @Prop({ type: [Activity] })
	// activities: Activity[]

	// @IsArray()
	// @IsDate({ each: true })
	// @Prop({ type: [Date] })
	// passwordChangeHistory: Date[];

	// @IsBoolean()
	// @IsOptional()
	// @Prop()
	// twoFactorEnabled: boolean;

	// @Prop({ default: true })
	// isActive: boolean

	// @Prop({ type: [{ type: [Types.ObjectId], ref: "Role" }], default: [] })
	// roles?: Types.ObjectId[]
	// // REVIEW: Tengo que hacer que el user-role guard entienda un array de objectIds
}

export const UserSchema = SchemaFactory.createForClass(User)
