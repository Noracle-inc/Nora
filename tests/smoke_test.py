from pathlib import Path

root = Path(__file__).resolve().parent.parent

required = [
    'index.html',
    'onboarding.html',
    'dashboard.html',
    'chat.html',
    'journal.html',
    'mood.html',
    'breathing.html',
    'meditation.html',
    'community.html',
    'therapists.html',
    'profile.html',
    'settings.html',
    'css/main.css',
    'docs/SAFETY.md',
    'docs/SECURITY.md',
    'docs/PRIVACY-NOTES.md',
    'config/crisis-resources.json'
]

missing = [p for p in required if not (root / p).exists()]
if missing:
    raise SystemExit(f'Missing required files: {missing}')

main_html = (root / 'index.html').read_text(encoding='utf-8')
assert 'Noracle' in main_html
assert 'Start your journey' in main_html
print('Smoke test passed: required Noracle scaffold files exist and landing page contains key content.')
