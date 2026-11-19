const storageKey = 'noracle-vault-items';
const list = document.querySelector('.vault-grid');

const readItems = () => JSON.parse(localStorage.getItem(storageKey) || '[]');

const renderVault = () => {
  const items = readItems();
  if (!items.length) {
    list.innerHTML = `
      <article class="vault-item">
        <h3>Nothing stored yet</h3>
        <p>Your private notes will appear here when you choose to tuck them away.</p>
      </article>
    `;
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="vault-item">
      <h3>${item.title}</h3>
      <p>${item.note}</p>
    </article>
  `).join('');
};

if (!readItems().length) {
  localStorage.setItem(storageKey, JSON.stringify([
    {
      title: 'Private pattern',
      note: 'This room is for your own keeping. Nothing is forced to be shared.'
    }
  ]));
}

renderVault();
