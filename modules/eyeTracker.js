let eyeClosedStart = null;
let warningSpoken = false;

export function checkEyes(landmarks) {
  const top = landmarks[159];
  const bottom = landmarks[145];
  const left = landmarks[33];
  const right = landmarks[133];

  const vertical = Math.abs(top.y - bottom.y);
  const horizontal = Math.abs(left.x - right.x);

  const EAR = vertical / horizontal;

  return EAR < 0.25;
}

export function trackEyeClosure(isClosed) {
  const now = Date.now();

  if (!isClosed) {
    if (!eyeClosedStart) eyeClosedStart = now;

    if (now - eyeClosedStart > 2000 && !warningSpoken) {
      speak("Close your eyes properly");
      warningSpoken = true;
    }
  } else {
    eyeClosedStart = null;
    warningSpoken = false;
  }
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}