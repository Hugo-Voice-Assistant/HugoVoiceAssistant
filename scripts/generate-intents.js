const { readdirSync, writeFileSync } = require("fs")
const { join } = require("path") 

const root = join(__dirname, "..")
const modulePath = join(root, "modules")

let intentSet = {
    exit: {"goodbye": "goodbye", "exit": "exit"}
}

// [] become optional, capture all within ()
const stringToTemplate = (s) => new RegExp(s.replaceAll(/\(.+?\)/g, "(.+)").replaceAll(/ \[(.+)\]/g, "(?: $1)"))
function convertAll(obj){
	if (!obj) return {}
	let outputObject = {}
	for (let i of Object.keys(obj)){
		outputObject[i]={}
		obj[i].forEach(n => outputObject[i][n] = stringToTemplate(n).toString().slice(1,-1))
	}
    return outputObject
}
for (let module of readdirSync(modulePath)){
	const m = require(join(modulePath, module, "hugo.module.json"))
	intentSet = {
		...intentSet,
		...convertAll(m.intents),
		...convertAll(m.modes)
	}
}
console.log(intentSet)

writeFileSync(join(root, "core/intents/intents.json"), JSON.stringify(intentSet))
console.log("Sucessfully updated intents!")