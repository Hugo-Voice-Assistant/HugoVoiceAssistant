require("dotenv").config()
const { execFileSync } = require("child_process")

const { readdirSync } = require("fs")
const { join } = require("path")

const intentCheck = require("./core/intents")
const modulePath = join(__dirname, "modules")
const sound = require("./core/sounds")

const { platform } = require("os")
const macOS = platform() == "darwin"

const hasInternet = require("internet-available")
const internetSettings = {
	timeout: 1000,
	domainName: "github.com"
}

class HugoAssistant {
	constructor(){
		this.recognizer = require("./core/speech-recognition")
		this.modules = new Map()
		for (let module of readdirSync(modulePath)){
			const path = join(modulePath, module) // Module folder

			const header = require(join(path, "hugo.module.json"))
			const index = require(join(path, "index.js"))

			if (!header.id) throw new Error(`'${modulePath}' does not have an id`)
			if (this.modules[header.id]) { console.warn(`[Warning] Duplicate module for id '${header.id}'.`); continue }
			if (!header.intents && !header.modes) { console.warn(`[Warning] Module '${header.id}' contains no intents or modes (malformed hugo.module.json?)`); continue }

			this.modules.set(header, index)
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
				let h;
				for (let header of this.modules.keys()){
					if (header.intents[intent.intent]){
						h = header
						break;
					}
				}
				if (!await this.hasInternet() && h.requiresInternet) return this.say("Sorry, this command needs internet to run.")
				await this.modules.get(h)[intent.intent](this, intent.data)
			})
		}
	}
	say(text){
		this.recognizer.pause()
		execFileSync(macOS ? "say" : "espeak", [text]);
		this.recognizer.resume()
	}
	async hasInternet(){
		try {
			await hasInternet(internetSettings)
			return true
		} catch(e) {
			console.error(e)
			return false
		}
	}
}

const hugo = new HugoAssistant()
