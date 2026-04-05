let startTime = null;
let level = 0;

export function trackMeditation(eyesClosed, goodPosture) {
  if (eyesClosed && goodPosture) {
    if (!startTime) startTime = Date.now();

    const duration = (Date.now() - startTime) / 1000;

    if (duration > 120) level = 4;
    else if (duration > 60) level = 3;
    else if (duration > 30) level = 2;
    else if (duration > 10) level = 1;

    return { duration, level };
  } else {
    startTime = null;
    level = 0;
    return { duration: 0, level: 0 };
  }
}