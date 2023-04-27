const { createReadStream } = require("fs")
const { join, format } = require("path")
const soundPath = join(__dirname, "wav")
const Speaker = require("speaker")
const wav = require("wav")

module.exports.Sounds = {
    LISTENING: "listening.wav",
    RECOGNIZED: "recognized.wav",
    ERROR: "error.wav"
}

module.exports.play = (sound) => new Promise((resolve) => {
    try {
        const stream = createReadStream(join(soundPath, sound))
        const reader = new wav.Reader();
        reader.on("format", (fmt) => {
            const s = new Speaker(fmt)
            reader.pipe(s)
            s.on("finish", resolve)
        })
        stream.pipe(reader)
    } catch {
        throw new Error("unable to play audio. Make sure the enum value is corect")
    }
})