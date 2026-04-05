import { checkEyes, trackEyeClosure } from "./modules/eyeTracker.js";
import { checkPosture, handlePosture } from "./modules/posture.js";
import { trackMeditation } from "./modules/meditationTimer.js";

const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

let faceMesh;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    video.srcObject = stream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    statusText.innerText = "Camera Started";

    startFaceMesh();

  } catch (err) {
    console.error(err);
    statusText.innerText = "Camera Error";
  }
}

async function startFaceMesh() {
  faceMesh = new FaceMesh({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true
  });

  faceMesh.onResults(onResults);

  detectLoop();
}

async function detectLoop() {
  await faceMesh.send({ image: video });
  requestAnimationFrame(detectLoop);
}

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks) {
    const landmarks = results.multiFaceLandmarks[0];

    drawLandmarks(landmarks);

    const isClosed = checkEyes(landmarks);
    trackEyeClosure(isClosed);

    const isGoodPosture = checkPosture(landmarks);
    handlePosture(isGoodPosture);

    const { duration, level } = trackMeditation(isClosed, isGoodPosture);

    statusText.innerText = `
Eyes: ${isClosed ? "Closed" : "Open"}
Posture: ${isGoodPosture ? "Good" : "Bad"}
Time: ${duration.toFixed(1)}s
Level: ${level}
`;
  }
}

function drawLandmarks(landmarks) {
  ctx.fillStyle = "lime";

  landmarks.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x * canvas.width, point.y * canvas.height, 1, 0, 2 * Math.PI);
    ctx.fill();
  });
}

startBtn.addEventListener("click", startCamera);