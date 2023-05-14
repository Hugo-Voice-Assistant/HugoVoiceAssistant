# ![Logo](assets/hugo-logo.png)
Hugo is a Node.js-powered, modular voice assistant, with an easy way to add new features!

**Note: looking for testers for macOS!**
# Features
- Can run completely offline 
- Very customizable
- No 3rd-parties can access your data
- Compatible with Linux (tested), Windows 8+, and macOS

# Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/CharlesBobOmb/HugoVoiceAssistant.git
    cd HugoVoiceAssistant
    ```
2. Download an appropriate speech recognition model from [here](https://alphacephei.com/vosk/models) (recommended model is `vosk-model-small-en-us-0.15`)

3. Extract the contents into a folder called `vosk-model` inside of `core/speech-recognition`

4. [Windows/Linux] Install `espeak-ng` (for text-to-speech) from [this repository](https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md#installation)

5. Setup intents:
    ```sh
    npm run generate-intents
    ```

6. Start Hugo by running:
    ```sh
    node index.js
    ```
## ...and you're done! Congrats!
To test Hugo, make sure a microphone and speaker are connected, run the program, and say "Hugo".
Once a sound is played, ask Hugo "what time is it?" If everything is set up right, Hugo will tell you the time.
## Changing Hugo's name
You can also change Hugo's name by adding a `WAKE_WORD` property to a `.env` file in the root. Make sure that the wake word is contained in your Vosk model (by using the say module), otherwise Hugo won't wake up!

# Modules
## What are modules?
Modules are code files that can be added to Hugo to let him do more things. Every module contains 
1. A `hugo.module.json` file
2. An `index.js` script

To install a module, just move the folder containing these things into the `modules` folder. Then, run `npm run generate-intents` (**YOU MUST DO THIS OR THE MODULE WON'T WORK**). That's it!
## How to create your own module
1. Create a folder with the previously mentioned files
2. Put the following code into `hugo.module.json`:
    ```json
    {
        "id": "example",
        "description": "Example Hugo module",
        "intents": {
            "run": ["run the example module"]
        }
    }
    ```
    This is the header for your Hugo module.
    Next, put the following into the `index.js` file:

    ```js
    module.exports = {
        run(hugo){
            hugo.say("This is the module template!")
        }
    }
    ```
    Now, run `npm run generate-intents`, and you can use your new module. Wake Hugo and say "run the example module" to verify that it works.
    For examples of how to make a module, including using arguments, take a look at the [time module](modules/time) or the [math module](modules/math) included with Hugo.

# Contributing
Any pull requests or issues are greatly appreciated!

## Contributors
None yet!

