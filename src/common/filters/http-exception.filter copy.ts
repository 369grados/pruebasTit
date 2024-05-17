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
import { MongooseError } from "mongoose"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()

		let status: HttpStatus
		let message: string
		let errorType: string
		let keyDuplicate: object | null = null

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			message = exception.getResponse() as string
			errorType = exception.constructor.name

			switch (exception.constructor) {
				case NotFoundException:
				case BadRequestException:
					break
				case UnauthorizedException:
					message = exception.message
					break
				default:
					// console.error(
					// 	"No se ha establecido ningun caso para este tipo de excepción",
					// 	exception,
					// )
					status = HttpStatus.INTERNAL_SERVER_ERROR
					message = "Internal server error. Please check logs."
					errorType = "InternalServerError"
					break
			}
		} else if (
			this.isMongoError(exception)
			// this.isMongoError(exception) &&
			// this.isDuplicateKeyError(exception)
		) {
			// REVIEW: Revisar esto. Puede que deba sacar un global error a nivel de cada modulo
			status = HttpStatus.BAD_REQUEST
			keyDuplicate = (exception as any).keyPattern
			//keyDuplicate = (exception as MongooseError).keyPattern // REVIEW: DA UN ERROR
			message = "Duplicate entry error. A record already exists."
			errorType = "MongoDuplicateKeyError"
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
			path: request.url,
			message: message,
			...(keyDuplicate && { keyDuplicate: keyDuplicate }),
		}

		response.status(status).json(responseBody)
	}

	private isMongoError(error: any): boolean {
		return error && error.name === "MongoServerError"
	}

	private isDuplicateKeyError(error: any): boolean {
		return error && error.code === 11000
	}
}
