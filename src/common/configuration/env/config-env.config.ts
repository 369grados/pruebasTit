import { registerAs } from "@nestjs/config"

export const mongodbConfig = registerAs("mongodb", () => {
	const {
		MONGODB_HOST: host,
		MONGODB_PORT: port,
		MONGODB_DB: db,
		MONGODB_USERNAME: username,
		MONGODB_PASSWORD: password,
	} = process.env

	const uri = `mongodb://${username}:${password}@${host}:${port}/${db}?authMechanism=DEFAULT&authSource=admin` // REVIEW: La parte final de mecanismos de verificación debo comprobar si tiene o no que estar aquí.

	return {
		uri,
		db,
	}
})

export const emailConfig = registerAs("email", () => ({
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT, 10),
	username: process.env.EMAIL_USERNAME,
	password: process.env.EMAIL_PASSWORD,
	tls: process.env.EMAIL_TLS === "true",
}))

export const authConfig = registerAs("auth", () => ({
	secret: process.env.JWT_SECRET,
	expired: process.env.JWT_EXPIRED,
}))

export const ConfigEnv = [mongodbConfig, emailConfig, authConfig]
