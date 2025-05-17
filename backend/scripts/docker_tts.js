const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const image = 'ghcr.io/coqui-ai/tts';
const outputAudio = path.resolve(__dirname, 'output.wav');
const default_container_name = "ai-video-generator-tts";


function dockerContainerExists(containerName) {
  try {
    const output = execSync(`docker ps -a --format "{{.Names}}"`).toString();
    const containers = output.split('\n').map(name => name.trim());
    return containers.includes(containerName);
  } catch (err) {
    console.error(`Error checking container existence: ${err.message}`);
    return false;
  }
}


/**
 * Generate speech audio using Coqui TTS Docker container with speaker WAV.
 * @param {string} text - Text to convert to speech.
 * @param {string} speakerWavPath - Path to reference speaker .wav file.
 * @returns {string} - Path to generated audio file or error message.
 */
function generateSpeechWithSpeaker(text, speakerAudioPath) {
  try {
    // Check Docker is running
    execSync('docker info', { stdio: 'ignore' });

    // Check if image exists locally
    const imageExists = execSync(`docker images -q ${image}`).toString().trim();
    if (!imageExists) {
      execSync(`docker pull ${image}`, { stdio: 'inherit' });
    }
    // Check speaker WAV file exists
    if (!fs.existsSync(speakerWavPath)) {
      return 'Error: Speaker WAV file does not exist.';
    }
    // Remove previous output
    if (fs.existsSync(outputAudio)) {
      fs.unlinkSync(outputAudio);
    }
    // Normalize paths for volume mount
    const localDir = path.dirname(speakerWavPath);
    const speakerFileName = path.basename(speakerWavPath);

    let command = `
        docker run --name ${default_container_name} --rm \
          -v ${localDir}:/data \
          ${image} \
          --text "${text}" \
          --speaker_wav /data/${speakerFileName} \
          --out_path /data/output.wav`;

    execSync(command, { stdio: 'inherit' });
    
    const finalOutput = path.join(localDir, 'output.wav');
    return fs.existsSync(finalOutput)
      ? finalOutput
      : 'Error: Output audio not created.';
  } catch (err) {
    return `Error: ${err.message}`;
  }
}







module.exports = { generateSpeechWithSpeaker };



// const { generateSpeechWithSpeaker } = require('./generateSpeechWithSpeaker');

// const text = 'This is my voice, generated with your speaker audio.';
// const speakerAudioPath = '/absolute/path/to/your/speaker.wav'; // must be absolute

// const result = generateSpeechWithSpeaker(text, speakerAudioPath);
// console.log('Result:', result);