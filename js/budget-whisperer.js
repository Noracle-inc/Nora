const mood = document.getElementById('budget-mood');
const suggestion = document.getElementById('budget-suggestion');

const whispers = [
  {
    mood: 'Your budget is not a punishment. It is a way to protect your peace.',
    suggestion: 'Start with food, transport, and rent. Then leave a small margin for rest.'
  },
  {
    mood: 'This plan is trying to be realistic, not rigid.',
    suggestion: 'Cut one optional cost this week and give that money back to your nervous system.'
  },
  {
    mood: 'You do not need to be perfect to be stable.',
    suggestion: 'A gentle spending plan beats a dramatic one. Keep it simple and sustainable.'
  }
];

const next = whispers[Math.floor(Math.random() * whispers.length)];
mood.textContent = next.mood;
suggestion.textContent = next.suggestion;
