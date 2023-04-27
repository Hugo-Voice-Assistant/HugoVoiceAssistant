const neg = (num) => String(num).replace("-", "negative ")
module.exports = {
	add(hugo, data){
		hugo.say(`${neg(data.first)} plus ${neg(data.second)} equals ${neg(data.first + data.second)}`)
	},
	subtract(hugo, data){
		hugo.say(`${neg(data.first)} minus ${neg(data.second)} equals ${neg(data.first - data.second)}`)
	},
	multiply(hugo, data){
		hugo.say(`${neg(data.first)} times ${neg(data.second)} equals ${neg(data.first * data.second)}`)
	},
	divide(hugo, data){
		let div = data.first / data.second
		hugo.say(`${neg(data.first)} divided by ${neg(data.second)} equals ${div.toFixed(2) != div ? "approximately " : ""} ${div.toFixed(2)}`)
	},
	exp(hugo, data){
		hugo.say(`${neg(data.first)} to the ${neg(data.second)} power is ${neg(Math.pow(data.first, data.second))}`)
	}
}
