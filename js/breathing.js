const orb = document.getElementById('breath-orb');
const startBtn = document.getElementById('start-breathing');
const stopBtn = document.getElementById('stop-breathing');
const emotionSelect = document.getElementById('emotion-select');
const guide = document.getElementById('breath-guide');

const emotionPatterns = {
  anxious: { times: [4, 4, 6], text: 'Let the body soften. The breath is not a test.' },
  sad: { times: [4, 2, 6], text: 'Breathe like you are trying to comfort yourself.' },
  angry: { times: [4, 2, 8], text: 'Let the exhale be longer than the rush.' },
  overwhelmed: { times: [5, 3, 7], text: 'Release the pressure, one breath at a time.' },
  tired: { times: [3, 1, 4], text: 'Rest in the easy part of the breath.' },
  calm: { times: [4, 4, 5], text: 'Enjoy the steadiness and keep it soft.' }
};

let timer = null;
let stepIndex = 0;

const cyclePhase = () => {
  const key = emotionSelect.value;
  const pattern = emotionPatterns[key];
  const phases = ['Inhale', 'Hold', 'Exhale'];
  const duration = pattern.times[stepIndex % phases.length];

  orb.textContent = phases[stepIndex % phases.length];
  guide.textContent = `${pattern.text} ${duration}s ${phases[stepIndex % phases.length].toLowerCase()} cycle.`;
  stepIndex += 1;
};

const syncPattern = () => {
  const key = emotionSelect.value;
  const pattern = emotionPatterns[key];
  guide.textContent = `${pattern.text} Follow the rhythm for this emotion.`;
};

emotionSelect.addEventListener('change', () => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
  stepIndex = 0;
  syncPattern();
  orb.textContent = 'Ready';
});

startBtn.addEventListener('click', () => {
  if (timer) return;
  stepIndex = 0;
  cyclePhase();
  timer = window.setInterval(cyclePhase, 2000);
});

stopBtn.addEventListener('click', () => {
  if (!timer) return;
  window.clearInterval(timer);
  timer = null;
  orb.textContent = 'Paused';
  guide.textContent = 'You can pause and begin again whenever you are ready.';
});

syncPattern();
