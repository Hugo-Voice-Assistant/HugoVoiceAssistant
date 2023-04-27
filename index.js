require("dotenv").config()
const { execFileSync } = require("child_process")

const { readdirSync } = require("fs")
const { join } = require("path")

const intentCheck = require("./core/intents")
const modulePath = join(__dirname, "modules")
const sound = require("./core/sounds")

class HugoAssistant {
	constructor(){
		this.recognizer = require("./core/speech-recognition")
		this.intents = {}, this.modules = []
		for (let module of readdirSync(modulePath)){
			const path = join(modulePath, module) // Module folder

			const header = require(join(path, "hugo.module.json"))
			const index = require(join(path, "index.js"))

			if (!header.id) throw new Error(`'${modulePath}' does not have an id`)
			if (this.modules[header.id]) { console.warn(`[Warning] Duplicate module for id '${header.id}'.`); continue }
			if (!header.intents && !header.modes) { console.warn(`[Warning] Module '${header.id}' contains no intents or modes (malformed hugo.module.json?)`); continue }

			this.modules[header.id] = {}
			this.modules.push(header.id)
			for (let intent of Object.keys(header.intents || {})){
				if (!index[intent]) throw new Error(`missing intent function '${intent}' in module '${header.id}'`)
				if (this.intents[intent]) { console.warn(`[Warning] duplicate intent specified in module '${header.id}' (${intent})`)}
				this.intents[intent] = index[intent]
			}
		}
		console.log("Hugo is now listening!")
		this.handle()
	}
	async handle(){
		while (true){
			if (await this.recognizer.listen() !== process.env.WAKE_WORD) continue
			await sound.play(sound.Sounds.LISTENING)

			const heard = await this.recognizer.listen()
			if (heard == "") continue;
			const intent = intentCheck(heard)
			if (!intent) {
				await sound.play(sound.Sounds.ERROR)
				continue
			}
			if (intent.intent == "exit"){
				this.say("Goodbye");
				process.exit()
			}
			sound.play(sound.Sounds.RECOGNIZED).then(async () => {
				await this.intents[intent.intent](this, intent.data)
			})
		}
	}
	say(text){
		this.recognizer.pause()
		execFileSync("espeak", ["-v", "gmw/en-GB-scotland", text]);
		this.recognizer.resume()
	}
}

const hugo = new HugoAssistant()
