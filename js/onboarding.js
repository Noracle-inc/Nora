const accountStep = document.querySelector('.account-entry');
const accountEyebrow = document.querySelector('.onboarding-card > .eyebrow');
const accountHeading = document.querySelector('.onboarding-card > h1');
const preferencesForm = document.getElementById('onboarding-form');
const continueButton = document.getElementById('continue-onboarding');

const showPreferences = () => {
  if (accountStep) accountStep.classList.add('hidden');
  if (preferencesForm) preferencesForm.classList.remove('hidden');
  if (accountEyebrow) accountEyebrow.textContent = 'Step 2 of 2';
  if (accountHeading) accountHeading.textContent = 'Make Noracle feel like yours';
};

continueButton?.addEventListener('click', showPreferences);

if (new URLSearchParams(window.location.search).get('step') === 'preferences') {
  showPreferences();
}

const steps = [...document.querySelectorAll('.step')];
const nextBtn = document.getElementById('next-step');
const prevBtn = document.getElementById('prev-step');
const finishBtn = document.getElementById('finish-step');
const form = document.getElementById('onboarding-form');
let index = 0;

const renderStep = () => {
  steps.forEach((step, stepIndex) => {
    step.classList.toggle('active', stepIndex === index);
  });

  prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  nextBtn.classList.toggle('hidden', index === steps.length - 1);
  finishBtn.classList.toggle('hidden', index !== steps.length - 1);
};

nextBtn.addEventListener('click', () => {
  if (index < steps.length - 1) {
    index += 1;
    renderStep();
  }
});

prevBtn.addEventListener('click', () => {
  if (index > 0) {
    index -= 1;
    renderStep();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location.href = 'dashboard.html';
});

renderStep();
