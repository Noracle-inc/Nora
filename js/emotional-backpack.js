const form = document.getElementById('burden-form');
const formPanel = document.getElementById('burden-form-panel');
const showFormButton = document.getElementById('show-burden-form');
const closeFormButton = document.getElementById('close-burden-form');
const cancelFormButton = document.getElementById('cancel-burden');
const burdenList = document.getElementById('burden-list');
const burdenDetail = document.getElementById('burden-detail');
const storageKey = 'noracle-backpack-burdens';
const transferKey = 'noracle-mask-transfer';

const readBurdens = () => JSON.parse(localStorage.getItem(storageKey) || '[]');

const writeBurdens = (burdens) => {
  localStorage.setItem(storageKey, JSON.stringify(burdens));
};

const openDrawer = () => formPanel.classList.remove('hidden');
const closeDrawer = () => formPanel.classList.add('hidden');

const renderBurdenDetail = (burden) => {
  if (!burden) {
    burdenDetail.className = 'burden-detail empty-state';
    burdenDetail.innerHTML = `
      <h2>Select a burden</h2>
      <p>Choose a burden to unpack it gently and reflect on what feels heavy right now.</p>
    `;
    return;
  }

  burdenDetail.className = 'burden-detail';
  burdenDetail.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${burden.category}</p>
        <h2>${burden.title}</h2>
      </div>
      <span class="intensity-badge ${burden.intensity.toLowerCase().replace(/\s+/g, '-')}">${burden.intensity}</span>
    </div>
    <div class="burden-meta">
      <span>Duration: ${burden.duration || 'Not specified'}</span>
      <span>Status: ${burden.status || 'Active'}</span>
    </div>
    <p>${burden.description || 'No description provided yet.'}</p>
    <p class="muted-copy">${burden.context || 'This remains a private note, not a diagnosis or verdict.'}</p>
    <div class="detail-actions">
      <button class="btn primary" type="button" data-action="lighten">Lighten</button>
      <button class="btn secondary" type="button" data-action="release">Release</button>
      <button class="btn ghost" type="button" data-action="revisit">Revisit later</button>
    </div>
  `;

  const buttons = burdenDetail.querySelectorAll('[data-action]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const burdens = readBurdens();
      const index = burdens.findIndex((item) => item.id === burden.id);

      if (index !== -1) {
        const action = button.getAttribute('data-action');
        const statusMap = {
          lighten: 'Lightened',
          release: 'Released',
          revisit: 'Revisit later'
        };

        burdens[index].status = statusMap[action] || 'Active';
        if (action === 'release') {
          burdens[index].released = true;
        }
        writeBurdens(burdens);
        renderBurdenList();
        renderBurdenDetail(burdens[index]);
      }
    });
  });
};

const renderBurdenList = () => {
  const burdens = readBurdens();
  burdenList.innerHTML = '';

  if (!burdens.length) {
    burdenList.innerHTML = '<p class="muted-copy">No burdens yet. Add one when you are ready.</p>';
    return;
  }

  burdens.forEach((burden) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'burden-item';
    item.innerHTML = `
      <span class="burden-title">${burden.title}</span>
      <span class="burden-meta-line">${burden.category} · ${burden.status || 'Active'}</span>
    `;

    item.addEventListener('click', () => {
      renderBurdenDetail(burden);
    });

    burdenList.appendChild(item);
  });
};

const hydrateTransfer = () => {
  const transferred = JSON.parse(localStorage.getItem(transferKey) || 'null');
  if (!transferred) return;

  const burdens = readBurdens();
  if (!burdens.some((burden) => burden.title === transferred.title)) {
    burdens.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `burden-${Date.now()}`,
      title: transferred.title,
      description: transferred.description,
      category: transferred.category,
      intensity: transferred.intensity,
      duration: transferred.duration,
      context: transferred.context,
      status: 'Active'
    });
    writeBurdens(burdens);
  }

  localStorage.removeItem(transferKey);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const burden = {
    id: crypto.randomUUID ? crypto.randomUUID() : `burden-${Date.now()}`,
    title: (formData.get('title') || '').toString().trim(),
    description: (formData.get('description') || '').toString().trim() || 'No additional context provided yet.',
    category: (formData.get('category') || 'Other').toString(),
    intensity: (formData.get('intensity') || 'Moderate').toString(),
    duration: (formData.get('duration') || 'Recently').toString(),
    context: (formData.get('context') || '').toString().trim() || 'This remains private and is not a diagnosis or a verdict.',
    status: 'Active'
  };

  if (!burden.title) {
    return;
  }

  const burdens = readBurdens();
  burdens.unshift(burden);
  writeBurdens(burdens);
  form.reset();
  closeDrawer();
  renderBurdenList();
  renderBurdenDetail(burden);
});

showFormButton.addEventListener('click', openDrawer);
closeFormButton.addEventListener('click', closeDrawer);
cancelFormButton.addEventListener('click', closeDrawer);

hydrateTransfer();
renderBurdenList();
renderBurdenDetail(readBurdens()[0] || null);
