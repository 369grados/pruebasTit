import { Injectable } from "@nestjs/common"
import { Connection } from "mongoose"

@Injectable() // REVIEW: Actualmente sin uso. No se puede incorporar correctamente al modulo mondodb
export class MongodbService {
	public connectionEvents(connection: Connection): void {
		console.log("connectionEvents")
		connection.on("connecting", () => {
			console.log("Conectándose a MongoDB...")
		})

		connection.on("connected", () => {
			//console.warn("CONECTADAAA")
			console.log("Conexión a MongoDB establecida.")
		})

		connection.on("error", (error) => {
			//console.error(`Error de conexión a MongoDB: ${error}`)
			console.log(`Error de conexión a MongoDB: ${error}`)
		})

		connection.on("disconnected", () => {
			//console.warn("Conexión a MongoDB desconectada.")
		})

		connection.on("reconnected", () => {
			//console.log("Reconectado a MongoDB.")
		})

		connection.on("close", () => {
			//console.warn("Conexión a MongoDB cerrada.")
		})
	}
}
