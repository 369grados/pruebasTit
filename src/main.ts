import { InternalServerErrorException, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as dotenv from "dotenv"
import { Mongoose } from "mongoose"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
dotenv.config()

async function bootstrap() {
	// Create the NestJS application.
	const app = await NestFactory.create(AppModule)

	// Use the Global Filters
	app.useGlobalFilters(new HttpExceptionFilter())

	// Use the ValidationPipe in the whole application.
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true, // Auto transform incoming data to DTOs.
			whitelist: true, // Strip away unknown properties.
			forbidNonWhitelisted: true, // Throw an error if unknown properties are present.
			transformOptions: {
				// Transform the incoming data to DTOs.
				enableImplicitConversion: true, // Convert primitive types to DTOs.
			},
		}),
	)

	// Aggregates prefix to all routes.
	app.setGlobalPrefix("api/v0")

	// Start the server.
	const serverport = process.env.PORT || 3000
	try {
		await app.listen(serverport)
		console.log(`Connected server on port ${serverport}`)
	} catch (error) {
		console.error(`Cannot connect server on port ${serverport}. \n`, error)
		throw new InternalServerErrorException(
			`Cannot connect server on port ${serverport}. Please check logs. `,
		)
	}
}
bootstrap()
