const SAMPLE_RATE = 16000

const mic = require("mic")
const vosk = require("vosk")
const { join } = require("path")
vosk.setLogLevel(-1)

const model = new vosk.Model(join(__dirname + "/vosk-model"))
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE})
const microphone = mic({
	rate: String(SAMPLE_RATE),
	channels: '1',
	debug: false,
	device: 'default'
});
mic
const micInput = microphone.getAudioStream();
micInput.on('audioProcessExitComplete', () => {
	rec.free();
	model.free();
})

module.exports = {
	pause: microphone.pause,
	resume: microphone.resume,
	listen: () => new Promise((resolve) => {
		async function onData(data){
			if (rec.acceptWaveform(data)){
				micInput.removeListener('data', onData)
				const result = rec.finalResult().text
				resolve(result)
			}
		}
		micInput.on('data', onData)
	})
}

microphone.start();
