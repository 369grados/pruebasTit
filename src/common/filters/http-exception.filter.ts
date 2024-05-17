import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common"
import { MongoValidationError } from "../database/errors/mongodb.errors"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const responseCtx = ctx.getResponse()
		const requestCtx = ctx.getRequest()

		let status: HttpStatus
		let responseException: any
		let message: string
		let keyDuplicate: object | null = null
		let errorType: string

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			responseException = exception.getResponse()
			errorType = exception.constructor.name

			switch (exception.constructor) {
				case NotFoundException:
				case BadRequestException:
					break
				case UnauthorizedException:
					message = exception.message
					break
				case MongoValidationError: {
					//console.log(exception)
					// message = responseHTTP.errorDetails.name
					// message = responseHTTP.errorDetails.errors
					// Error de validación de datos
					if (responseException.errorDetails.name === "ValidationError") {
						message = responseException.errorDetails.errors
					} else if (
						responseException.errorDetails.name === "MongoServerError"
					) {
						// Error de identificar único
						if (responseException.errorDetails.code === 11000) {
							keyDuplicate = responseException.errorDetails.keyPattern
							message = "Duplicate entry error. A record already exists."
							errorType = "MongoError"
						}
					}
					// Error de identificar único
					break
				}
				default:
					console.error(
						"No se ha establecido ningun caso para este tipo de excepción",
						exception,
					)
					status = HttpStatus.INTERNAL_SERVER_ERROR
					message = "Internal server error. Please check logs."
					//errorType = "InternalServerError"
					break
			}
		} else if (
			// Posible error de mongoose
			// exception instanceof Error &&
			// "name" in exception &&
			// exception.name === "ValidationError"
			exception instanceof MongoValidationError
		) {
			status = HttpStatus.BAD_REQUEST
			keyDuplicate = (exception as any).keyPattern
			//keyDuplicate = (exception as MongooseError).keyPattern // REVIEW: DA UN ERROR
			message = "Duplicate entry error. A record already exists."
			errorType = "MongoError"
			// const mongooseError = exception as unknown as { _message?: string }
			// if (mongooseError._message?.includes("validation failed")) {
			// 	// REVIEW: Revisar esto. Puede que deba sacar un global error a nivel de cada modulo
			// 	status = HttpStatus.BAD_REQUEST
			// 	keyDuplicate = (exception as any).keyPattern
			// 	//keyDuplicate = (exception as MongooseError).keyPattern // REVIEW: DA UN ERROR
			// 	message = "Duplicate entry error. A record already exists."
			// 	errorType = "MongoError"
			// }
		} else {
			console.log("Constructor:" + exception.constructor.name)
			console.error("Unhandled Exception", exception)
			status = HttpStatus.INTERNAL_SERVER_ERROR
			message = "Internal server error. Please check logs."
			errorType = "InternalServerError"
		}

		const responseBody = {
			statusCode: status,
			errorType: errorType,
			timestamp: new Date().toISOString(),
			path: requestCtx.url,
			message: message,
			...(keyDuplicate && { keyDuplicate: keyDuplicate }),
		}

		responseCtx.status(status).json(responseBody)
	}

	// REVIEW: Estos pueden ser guards

	private isValidationError(exception: unknown): exception is Error {
		return exception instanceof Error && exception.name === "ValidationError"
	}

	private isMongoError(error: any): boolean {
		return error && error.name === "MongoServerError"
	}

	private isDuplicateKeyError(error: any): boolean {
		return error && error.code === 11000
	}
}
