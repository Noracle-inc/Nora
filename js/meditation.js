const sessions = {
  reset: {
    label: 'Reset',
    prompt: 'Let the shoulders soften and come back to your breath.',
    cycles: 5
  },
  grounding: {
    label: 'Grounding',
    prompt: 'Notice your feet, your breath, and the chair beneath you.',
    cycles: 8
  },
  focus: {
    label: 'Quiet focus',
    prompt: 'Let one thought become the only thing you pay attention to.',
    cycles: 10
  },
  sleep: {
    label: 'Sleep drift',
    prompt: 'Release the day gently. Nothing needs to be solved right now.',
    cycles: 12
  }
};

const sessionButtons = document.querySelectorAll('[data-session]');
const orb = document.getElementById('meditation-orb');
const status = document.getElementById('meditation-status');
const toggle = document.getElementById('meditation-toggle');

let currentSession = 'reset';
let timer = null;
let count = 0;

const updateSelection = (key) => {
  currentSession = key;
  sessionButtons.forEach((button) => {
    const active = button.getAttribute('data-session') === key;
    button.closest('.mini-card').classList.toggle('active', active);
  });

  const config = sessions[key];
  orb.textContent = config.label;
  status.textContent = config.prompt;
};

const finishSession = () => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
  toggle.textContent = 'Start session';
  count = 0;
  const config = sessions[currentSession];
  orb.textContent = config.label;
  status.textContent = `${config.prompt} Session complete.`;
};

const tick = () => {
  const config = sessions[currentSession];
  count += 1;
  if (count >= config.cycles) {
    finishSession();
    return;
  }

  orb.textContent = `${config.label} · ${config.cycles - count}s`;
  status.textContent = `${config.prompt} Stay with the breath.`;
};

sessionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    updateSelection(button.getAttribute('data-session'));
    toggle.textContent = 'Start session';
    count = 0;
  });
});

toggle.addEventListener('click', () => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
    toggle.textContent = 'Start session';
    status.textContent = sessions[currentSession].prompt;
    orb.textContent = sessions[currentSession].label;
    return;
  }

  count = 0;
  toggle.textContent = 'Pause';
  tick();
  timer = window.setInterval(tick, 1000);
});

updateSelection(currentSession);
