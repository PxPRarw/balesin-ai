# Supabase Auth Email Templates (cartoon design)

Supabase Auth's transactional emails (verify, magic link, reset, change email) are
configured in the Supabase dashboard, not in the application code. To match the
BalesinAI cartoon aesthetic, paste each HTML file below into the corresponding
template at:

https://supabase.com/dashboard/project/hxzbvgizfkihvzaiwwfd/auth/templates

| File                       | Supabase template name |
| -------------------------- | ----------------------- |
| `CONFIRM_SIGNUP.html`      | Confirm signup          |
| `MAGIC_LINK.html`          | Magic Link              |
| `RESET_PASSWORD.html`      | Reset Password          |
| `CHANGE_EMAIL.html`        | Change Email Address    |

Templates use Supabase variables `{{ .ConfirmationURL }}` and `{{ .NewEmail }}`.
After pasting, click **Save** for each tab.

Sender info (also in dashboard → Auth → SMTP Settings) is already wired to Brevo:
- Sender email: `verification@kyxn.dev`
- SMTP host: `smtp-relay.brevo.com:587`
