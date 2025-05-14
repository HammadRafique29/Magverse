const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const image = 'ghcr.io/coqui-ai/tts';
const textToSpeak = 'Hello, this is a test.';
const outputPath = path.resolve(__dirname, 'output.wav');

try {
  // 1. Check if Docker is running
  execSync('docker info', { stdio: 'ignore' });
  console.log('✅ Docker is running');

  // 2. Check if image is available locally
  const images = execSync(`docker images -q ${image}`).toString().trim();
  if (!images) {
    console.log(`⏳ Pulling image ${image}...`);
    execSync(`docker pull ${image}`, { stdio: 'inherit' });
  } else {
    console.log(`✅ Image ${image} is available locally`);
  }

  // 3. Ensure previous output is removed
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  // 4. Run Docker container to generate TTS audio
  const runCommand = `
    docker run --rm \
      -v ${__dirname}:/data \
      ${image} \
      --text "${textToSpeak}" \
      --out_path /data/output.wav
  `;

  console.log('▶️ Generating speech audio...');
  execSync(runCommand, { stdio: 'inherit' });

  // 5. Confirm output
  if (fs.existsSync(outputPath)) {
    console.log('✅ Audio generated successfully: output.wav');
  } else {
    console.error('❌ Failed to generate audio.');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}
