let timesCalled = 0
setInterval(() => timesCalled = 0, 1000 * 60 * 3)

const rules = new Intl.PluralRules("en-US", { type: "ordinal" });

const sx = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

function ordinal(number){
	return `${number}${sx.get(rules.select(number))}`
}
module.exports = {
	time(hugo){
		timesCalled += 1
		if (timesCalled == 3) {
			hugo.say("It's time for you to get a watch. Ha ha ha");
			timesCalled = 0
		}
		const time = new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true }).replace(":00", "oh clock ").replace(":0", " oh ")
		hugo.say(`It's ${time}`)
	},
	date(hugo){
		const date = new Date()
		let parts = date.toLocaleDateString("en-US", {month: "long", year: "numeric"}).split(" ")
		parts.splice(1, 0, ordinal(date.getDate()))
		hugo.say(`Today is ${parts.join(" ")}`)
	}
}
