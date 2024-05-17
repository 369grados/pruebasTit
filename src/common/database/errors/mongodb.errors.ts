import { HttpException, HttpStatus } from "@nestjs/common"

export class MongoValidationError extends HttpException {
	constructor(error: any) {
		const response = {
			message: `Exception MongoDB: ${error.message}`,
			errorDetails: error, // Incluye los detalles adicionales aquí
		}
		super(response, HttpStatus.BAD_REQUEST)
	}
}

export class MongoDuplicateError extends HttpException {
	constructor(error: any) {
		const response = {
			message: `Exception MongoDB: ${error.message}`,
			errorDetails: error, // Incluye los detalles adicionales aquí
		}
		super(response, HttpStatus.BAD_REQUEST)
	}
}
