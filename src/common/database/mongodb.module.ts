import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.getOrThrow<string>("mongodb.uri"), // REVIEW: ver el archivo de notas
				connectionFactory: (connection) => {
					connection.on("connecting", () => {
						console.log("Conectándose a MongoDB...")
					})

					connection.on("connected", () => {
						console.warn("CONECTADAAA")
						console.log("Conexión a MongoDB establecida.")
					})

					connection.on("error", (error) => {
						console.error(`Error de conexión a MongoDB: ${error}`)
					})

					connection.on("disconnected", () => {
						console.warn("Conexión a MongoDB desconectada.")
					})

					connection.on("reconnected", () => {
						console.log("Reconectado a MongoDB.")
					})

					connection.on("close", () => {
						console.warn("Conexión a MongoDB cerrada.")
					})
					return connection
				},
			}),
			inject: [ConfigService],
		}),
	],
	exports: [MongooseModule],
})
export class MongodbModule {}
