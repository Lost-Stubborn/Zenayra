const startButton = document.getElementById('startButton');
const video = document.getElementById('video');
const textbox = document.getElementById('textbox');
const instructions = document.getElementById('instructions');

startButton.addEventListener('click', startStreaming);

let stream;
let timer;

async function startStreaming() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
    startButton.disabled = true;
    startSpeechRecognition();
    startCameraTimer();
  } catch (err) {
    console.error('Error accessing media devices', err);
  }
}

function startSpeechRecognition() {
  const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    instructions.textContent = 'Speech recognition started. Speak into the microphone.';
  };

  recognition.onresult = function(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    textbox.value = ''; // Clear the textbox content before appending the new transcript
    textbox.value += transcript;
  };

  recognition.onend = function() {
    instructions.textContent = 'Speech recognition ended. Press the start button to begin again.';
    recognition.start();
  };

  recognition.start();
}

function startCameraTimer() {
  timer = setTimeout(stopStreaming, 10000000000); 
}

function stopStreaming() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    startButton.disabled = false;
    clearTimeout(timer);
  }
}