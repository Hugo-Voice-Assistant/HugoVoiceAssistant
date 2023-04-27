const intents = require("./intents.json")
const { wordsToNumbers } = require("words-to-numbers")

// identify an intent and return any data
module.exports = (text) => {
	for (const [intent, data] of Object.entries(intents)){
		for (const [string, reg] of Object.entries(data)){
			let outObj = {}
			let matches = text.match(reg)
			if (!matches) continue;
			if (matches.length == 1) return {intent, data: {}}
			matches = matches.slice(1)
			for (let [index, name] of string.match(/(?<=\().+?(?=\))/g).entries()){
				let arg =  matches[index]
				if (name.slice(-1) == "#"){
					name = name.slice(0,-1);
					arg = wordsToNumbers(arg, {"fuzzy": true})
				}
				outObj[name] = arg
			}
			return {intent, data: outObj}
		}
	}
	return null
}
