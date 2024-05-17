import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ConfigEnv } from "./config-env.config"
import { JoiValidationSchema } from "./joi.validation"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: ConfigEnv,
			validationSchema: JoiValidationSchema,
			envFilePath: `./src/common/configuration/env/const/${process.env.NODE_ENV}.env`,
		}),
	],
	exports: [ConfigModule],
})
export class ConfigEnvModule {}
