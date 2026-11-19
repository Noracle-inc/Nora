# Noracle Safety Notes

## Principles

- Human safety outranks engagement.
- Crisis support must be immediate, calm and clear.
- AI must never claim to be human or a therapist.
- Safety flows must work without user payment.
- Anything unverified is marked TODO(verify).

## Crisis mode

- Use a dedicated risk triage layer.
- Escalate to a calm, brief crisis response when imminent danger is detected.
- Recommend trusted human support and emergency services when appropriate.
- The current backend uses a limited keyword signal only; it is not clinical triage. No hotline/resource list is configured until locally verified.
- Never provide medication, diagnosis, or crisis advice for self-harm in a way that substitutes for professional help.

## Dependency prevention

- Avoid guilt, abandonment language, and emotional dependency hooks.
- Keep healthy human connection and professional support visible.
- Conversation history is off by default. Saving it requires turning off private mode and separately enabling optional history in Settings.
- Signed-out journal and mood entries are browser-local and are never silently synced when a person later signs in.
