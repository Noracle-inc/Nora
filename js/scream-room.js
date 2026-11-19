const textArea = document.getElementById('scream-text');
const clearRoomBtn = document.getElementById('clear-room');
const clearTextBtn = document.getElementById('clear-text');
const saveTextBtn = document.getElementById('save-text');
const recordButton = document.getElementById('record-button');
const stopRecordingButton = document.getElementById('stop-recording');
const voiceList = document.getElementById('voice-list');
const recordStatus = document.getElementById('record-status');

const sessionMemory = {
  text: [],
  voiceNotes: []
};

const clearSessionMemory = () => {
  sessionMemory.text = [];
  sessionMemory.voiceNotes = [];
  textArea.value = '';
  voiceList.innerHTML = '';
  recordStatus.textContent = 'Session cleared. Nothing persists after you leave.';
};

const clearText = () => {
  textArea.value = '';
};

const saveCurrentText = () => {
  const value = textArea.value.trim();
  if (!value) return;
  sessionMemory.text.push(value);
  const entry = document.createElement('div');
  entry.className = 'voice-entry';
  entry.textContent = `Text saved for this session: “${value.slice(0, 80)}${value.length > 80 ? '…' : ''}”`;
  voiceList.prepend(entry);
  textArea.value = '';
};

clearRoomBtn.addEventListener('click', clearSessionMemory);
clearTextBtn.addEventListener('click', clearText);
saveTextBtn.addEventListener('click', saveCurrentText);

const startVoiceNote = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const entry = document.createElement('div');
      entry.className = 'voice-entry';
      entry.innerHTML = `<audio controls src="${url}"></audio><div>Voice note recorded for this session only.</div>`;
      voiceList.prepend(entry);
      sessionMemory.voiceNotes.push({ url, blob });
      stream.getTracks().forEach((track) => track.stop());
      recordStatus.textContent = 'Voice notes stay only for this session and are cleared on exit.';
    };

    mediaRecorder.start();
    recordButton.classList.add('hidden');
    stopRecordingButton.classList.remove('hidden');
    recordStatus.textContent = 'Recording voice note…';

    stopRecordingButton.onclick = () => {
      mediaRecorder.stop();
      stopRecordingButton.classList.add('hidden');
      recordButton.classList.remove('hidden');
    };
  } catch (error) {
    recordStatus.textContent = 'Microphone access was blocked. This room still keeps text ephemeral and local to the current session.';
    console.warn('Voice capture unavailable:', error);
  }
};

recordButton.addEventListener('click', startVoiceNote);

window.addEventListener('beforeunload', () => {
  clearSessionMemory();
});

window.addEventListener('pagehide', () => {
  clearSessionMemory();
});
