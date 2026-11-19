const groups = [
  {
    id: 'eating-disorder',
    name: 'Eating Disorder Recovery',
    tag: 'Recovery',
    memberCount: '3.4k members',
    summary: 'Gentle support around food, body image, recovery, and the pressure to perform wellness.',
    posts: [
      { author: 'anonymous', title: 'What I wish people understood about recovery', excerpt: 'Recovery is not a straight line and it is not just about eating habits. Sometimes it is about learning to feel safe in a body again.', time: '12 min ago' },
      { author: 'anonymous', title: 'A Tuesday check-in', excerpt: 'I am learning to stop treating food as a moral story. I want care, not shame.', time: '1 hour ago' }
    ]
  },
  {
    id: 'rape-assault',
    name: 'Rape & Sexual Assault Survivors',
    tag: 'Trauma',
    memberCount: '2.9k members',
    summary: 'A quiet place for survivors to process impact, boundaries, and the long aftermath of harm.',
    posts: [
      { author: 'anonymous', title: 'The part nobody prepares you for', excerpt: 'I had to learn that recovery is not just surviving the event — it is surviving the moments after, too.', time: '19 min ago' },
      { author: 'anonymous', title: 'A small boundary I am practicing', excerpt: 'I am saying no without giving a long explanation. That feels brave.', time: '3 hours ago' }
    ]
  },
  {
    id: 'disabilities',
    name: 'Disability Justice',
    tag: 'Access',
    memberCount: '4.1k members',
    summary: 'A space for disabled people, caregivers, and allies to share access, dignity, and care.',
    posts: [
      { author: 'anonymous', title: 'The thing that helps more than advice', excerpt: 'I need people to believe me when I say my body has limits. Rest is not laziness.', time: '26 min ago' },
      { author: 'anonymous', title: 'A better kind of accessibility', excerpt: 'What helps most is flexibility without guilt. We do not need to be “productive” to deserve care.', time: '5 hours ago' }
    ]
  },
  {
    id: 'depression',
    name: 'Depression & Loneliness',
    tag: 'Mental health',
    memberCount: '6.3k members',
    summary: 'Honest reflections about sadness, isolation, low energy, and finding support without being fixed.',
    posts: [
      { author: 'anonymous', title: 'Thinly disguised exhaustion', excerpt: 'I am tired in a way that makes even existing feel difficult. I am trying to be gentle with that.', time: '8 min ago' },
      { author: 'anonymous', title: 'When silence feels safer', excerpt: 'Some days I want rest, not advice. I just need someone to witness the heaviness.', time: '2 hours ago' }
    ]
  },
  {
    id: 'religion',
    name: 'Religious Trauma & Faith',
    tag: 'Faith',
    memberCount: '2.6k members',
    summary: 'Harm, doubt, deconstruction, and rebuilding trust in faith, meaning, and self.',
    posts: [
      { author: 'anonymous', title: 'Leaving without a map', excerpt: 'I do not know what to call my spirituality anymore, but I am learning that my fear is not the same as being wrong.', time: '17 min ago' },
      { author: 'anonymous', title: 'What I needed instead of slogans', excerpt: 'I needed someone to ask what I was afraid of, not what I should believe.', time: '4 hours ago' }
    ]
  },
  {
    id: 'anxiety',
    name: 'Anxiety & Panic',
    tag: 'Safety',
    memberCount: '5.8k members',
    summary: 'Shared strategies, panic stories, and the reality of living with racing thoughts and fear responses.',
    posts: [
      { author: 'anonymous', title: 'Anxiety is not a character flaw', excerpt: 'Some days it feels like my nervous system is trying to outrun a threat that is already past.', time: '23 min ago' },
      { author: 'anonymous', title: 'The non-performative way I cope', excerpt: 'I stopped trying to “beat” anxiety and started noticing what calms me in small, honest ways.', time: '7 hours ago' }
    ]
  },
  {
    id: 'trauma',
    name: 'Trauma Recovery',
    tag: 'Healing',
    memberCount: '4.7k members',
    summary: 'Support for nervous system regulation, memory, and the long, non-linear work of healing.',
    posts: [
      { author: 'anonymous', title: 'The flashback I did not expect today', excerpt: 'It is harder than expected to be in a room and feel like you are not quite there. The lesson is not to be ashamed of that.', time: '31 min ago' },
      { author: 'anonymous', title: 'A small piece of safety', excerpt: 'A blanket, a shower, a slow walk, and a quiet voice saying “you are here” helped more than I expected.', time: '9 hours ago' }
    ]
  },
  {
    id: 'adhd',
    name: 'ADHD & Neurodivergence',
    tag: 'Neurodiversity',
    memberCount: '3.8k members',
    summary: 'Practical tools and lived experience for attention, drift, overwhelm, and self-understanding.',
    posts: [
      { author: 'anonymous', title: 'I am not lazy, I am overloaded', excerpt: 'The shame of forgetting tasks is not about effort. It is often about working with a brain that is asking for different conditions.', time: '11 min ago' },
      { author: 'anonymous', title: 'What actually helps me function', excerpt: 'One timer, one list, and fewer moral narratives have changed my week more than a thousand productivity tips.', time: '2 days ago' }
    ]
  },
  {
    id: 'grief',
    name: 'Grief & Loss',
    tag: 'Care',
    memberCount: '2.1k members',
    summary: 'A place to grieve people, identities, plans, and the pieces of life we never expected to lose.',
    posts: [
      { author: 'anonymous', title: 'The grief that no one sees', excerpt: 'I am grieving not just a person, but the version of my life I thought would be there.', time: '35 min ago' },
      { author: 'anonymous', title: 'Grief without performance', excerpt: 'I am not trying to be poetic about it. I am just tired of pretending the weight is gone.', time: '7 hours ago' }
    ]
  },
  {
    id: 'burnout',
    name: 'Burnout & Overwhelm',
    tag: 'Work',
    memberCount: '5.1k members',
    summary: 'Exhaustion, over-functioning, employment pressure, and permission to stop performing productivity.',
    posts: [
      { author: 'anonymous', title: 'I am not “unmotivated”', excerpt: 'I am depleted. That is a different thing, and I want the difference recognized.', time: '16 min ago' },
      { author: 'anonymous', title: 'A softer work week', excerpt: 'Not every week needs to feel like a sprint. I am learning to build margin without apologizing for it.', time: '6 hours ago' }
    ]
  },
  {
    id: 'addiction',
    name: 'Addiction Recovery',
    tag: 'Recovery',
    memberCount: '3.2k members',
    summary: 'Nonjudgmental support for substance use, compulsions, craving, and rebuilding trust in daily life.',
    posts: [
      { author: 'anonymous', title: 'The craving I cannot explain', excerpt: 'Sometimes the urge is not about the thing itself — it is about wanting a break from the ache of being present.', time: '20 min ago' },
      { author: 'anonymous', title: 'Rebuilding rituals that feel safe', excerpt: 'Not every ritual needs to be “productive” or impressive. I am slowly choosing what helps me stay steady.', time: '13 hours ago' }
    ]
  },
  {
    id: 'queer',
    name: 'Queer Identity & Love',
    tag: 'Identity',
    memberCount: '4.8k members',
    summary: 'Stories about identity, belonging, dating, and being loved without erasure or pressure to explain yourself.',
    posts: [
      { author: 'anonymous', title: 'I want a softer way to be seen', excerpt: 'I am not asking for perfect acceptance. I am asking for people to understand that safety matters.', time: '28 min ago' },
      { author: 'anonymous', title: 'The lesson in choosing joy', excerpt: 'Joy is not always loud. Sometimes it is in being able to breathe without rehearsing your story.', time: '1 day ago' }
    ]
  },
  {
    id: 'family',
    name: 'Family Estrangement',
    tag: 'Relationships',
    memberCount: '2.4k members',
    summary: 'Support for fractures, boundaries, guilt, and the complexity of family relationships.',
    posts: [
      { author: 'anonymous', title: 'I keep wondering if I am selfish', excerpt: 'I am trying to separate boundary-setting from cruelty, and it is harder than I thought.', time: '42 min ago' },
      { author: 'anonymous', title: 'My boundaries are not punishment', excerpt: 'I can want peace without pretending the wound never happened.', time: '11 hours ago' }
    ]
  }
];

const visibilityOptions = ['anonymous', 'alias', 'public'];
const state = {
  activeGroupId: groups[0].id,
  visibilityIndex: 0
};

const groupList = document.getElementById('group-list');
const selectedName = document.getElementById('selected-name');
const selectedTag = document.getElementById('selected-tag');
const detail = document.getElementById('community-detail');
const anonStatus = document.getElementById('anon-status');
const toggleIdentityButton = document.getElementById('toggle-identity');
const joinButton = document.getElementById('join-community');

const visibilityLabelMap = {
  anonymous: 'You are anonymous by default.',
  alias: 'You are visible with an alias.',
  public: 'You are visible publicly in this group.'
};

const renderGroupList = () => {
  groupList.innerHTML = '';

  groups.forEach((group) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `group-item ${group.id === state.activeGroupId ? 'selected' : ''}`;
    button.innerHTML = `
      <div class="group-item-top">
        <span class="group-tag">${group.tag}</span>
        <span class="group-dot"></span>
      </div>
      <strong>${group.name}</strong>
      <small>${group.memberCount}</small>
    `;

    button.addEventListener('click', () => {
      state.activeGroupId = group.id;
      renderSelectedGroup();
      renderGroupList();
    });

    groupList.appendChild(button);
  });
};

const renderSelectedGroup = () => {
  const group = groups.find((item) => item.id === state.activeGroupId) || groups[0];
  selectedName.textContent = group.name;
  selectedTag.textContent = group.tag;

  detail.innerHTML = `
    <div class="community-description">
      <div>
        <p class="eyebrow">${group.memberCount}</p>
        <p>${group.summary}</p>
      </div>
      <div class="tag-row">
        <span class="tag">Anonymous by default</span>
        <span class="tag">Selective visibility</span>
        <span class="tag">Supportive reading</span>
      </div>
    </div>

    <div class="post-list">
      ${group.posts
        .map(
          (post) => `
            <article class="post-card">
              <div class="post-meta">
                <span>${post.author}</span>
                <span>${post.time}</span>
              </div>
              <h3>${post.title}</h3>
              <p>${post.excerpt}</p>
              <div class="post-actions">
                <button type="button" class="btn ghost">Reply quietly</button>
                <button type="button" class="btn secondary">Save for later</button>
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  `;
};

const updateVisibility = () => {
  const current = visibilityOptions[state.visibilityIndex];
  anonStatus.textContent = visibilityLabelMap[current];

  if (current === 'anonymous') {
    toggleIdentityButton.textContent = 'Change visibility';
  } else if (current === 'alias') {
    toggleIdentityButton.textContent = 'Use alias';
  } else {
    toggleIdentityButton.textContent = 'Show publicly';
  }
};

const cycleVisibility = () => {
  state.visibilityIndex = (state.visibilityIndex + 1) % visibilityOptions.length;
  updateVisibility();
};

joinButton.addEventListener('click', () => {
  const current = visibilityOptions[state.visibilityIndex];
  const message = current === 'anonymous'
    ? 'Joined anonymously.'
    : current === 'alias'
      ? 'Joined with your chosen alias.'
      : 'Joined publicly in this circle.';

  joinButton.textContent = message;
  window.setTimeout(() => {
    joinButton.textContent = 'Join anonymously';
  }, 1200);
});

toggleIdentityButton.addEventListener('click', cycleVisibility);

renderGroupList();
renderSelectedGroup();
updateVisibility();
