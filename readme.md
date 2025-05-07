# 🎬 AI Story Video Generator (UNDER DEVELOPMENT)

Turn a single line of text ✍️ into a complete story video 📽️, all on your desktop!
**AI Story Video Generator** is a powerful and creative Electron-based desktop app that uses cutting-edge open-source AI tools to generate story-based videos from just a one-line idea.

<br>

## ✨ Features

- 🧠 Powered by **Ollama AI** for text-to-story generation
- 🖼️ Uses open-source **image generation models** to visualize scenes
- 🎧 Integrated with **xtts-v2** for natural-sounding voice narration
- 🖥️ Cross-platform desktop app built with **Electron**
- 🔓 100% open-source — customize or extend as you wish

<br>

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HammadRafique29/AI-Story-Video-Generator.git
cd AI-Story-Video-Generator
````


### 2. Install Dependencies

Make sure you have [Node.js and npm](https://nodejs.org/en/download/) installed.

```bash
npm install
```



### 3. Install Ollama

Ollama is used to run local AI models like `llama2`, `mistral`, or `gemma`.
Follow official instructions here: [https://ollama.com/download](https://ollama.com/download)


```bash
ollama run llama2
```


### 4. Install xtts-v2 (Text-to-Speech)

You’ll need to set up `xtts-v2` locally. The easiest way is using Docker. Below command will starts the TTS service used to narrate your generated story.

```bash
docker run -it -p 8020:8020 cugui/xtts-api
```



### 5. Run the App

```bash
npm start
```


<br>

## 📁 Project Structure

```
📦AI-Story-Video-Generator
├── 📜main.js                # Electron main process
├── 📜preload.js             # Preload script to expose APIs to renderer
├── 📜package.json
├── 📁renderer/              # Frontend files (HTML/CSS/JS)
│   ├── 📜index.html
│   ├── 📁styles/
│   │   └📜main.css
│   └── 📁scripts/
│       ├📜main.js           # Handles routing, UI logic
│       └📜api.js            # API call functions
├── 📁backend/               # Custom API logic handled by Node
│   └── 📁routes/
│       ├📜index.js          # API route registration
│       └📜example.js        # Example API route
├── 📁public/                # Static files (images, icons)
│   └📜favicon.ico
└── 📁assets/                # Optional: Fonts, sounds, etc.
```


## 🚀 Coming Soon

* GUI for selecting voice/speaker
* Model selection for advanced users
* Export options (MP4, GIF)
* Story templates & genres



## 📄 License

This project is licensed under the **MIT License**, feel free to use, modify, and distribute.


## 🙌 Credits

Made with ❤️ by **Hammad Rafique**.
 Thanks to the open-source community for Ollama, xtts-v2, and the amazing image generation models that make this magic possible! 💫

## 🤝 Contributing

PRs and suggestions welcome! Open an issue or submit a pull request if you'd like to improve or extend the app.


## 💬 Questions?

Feel free to reach out via [GitHub Issues](https://github.com/HammadRafique29/AI-Story-Video-Generator/issues)
