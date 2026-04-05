let warned = false;

export function checkPosture(landmarks) {
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const nose = landmarks[1];

  const tilt = Math.abs(leftEye.y - rightEye.y);
  const center = Math.abs(nose.x - (leftEye.x + rightEye.x) / 2);

  return tilt < 0.03 && center < 0.04;
}

export function handlePosture(isGood) {
  if (!isGood && !warned) {
    speak("Sit straight");
    warned = true;
  }

  if (isGood) warned = false;
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}