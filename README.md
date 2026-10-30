# TallyoraLabs website

Public, bilingual studio/support website for **LUMENFOLD: Pocket Worlds** and **Wonderleaf**. This repository contains website material only, not the game projects, private player data or credentials.

## Local workflow

Node.js is the only prerequisite. No package installation is required.

```powershell
npm run build
npm run check
npm start
```

Preview: `http://127.0.0.1:4187/tallyoralabs-site/`.

Edit `src/content.mjs`, `src/styles.css` and `scripts/build.mjs`; regenerate `docs/`. GitHub Pages serves `main:/docs`. Commit source and generated files together.

## Stable public routes

- `/lumenfold/`, `/lumenfold/privacy/`, `/lumenfold/delete-account/`
- `/wonderleaf/`, `/wonderleaf/privacy/`, `/wonderleaf/delete-account/`
- `/support/`, `/privacy/`
- Greek equivalents under `/el/`.

Planned base URL: `https://vlp3r.github.io/tallyoralabs-site/`. No public Play Store link is invented for either unreleased app.

## Assets

- Tallyora Labs mark: supplied studio artwork from the LUMENFOLD project.
- Wonderleaf castle: static export of the original first castle scene, with no story source or interaction code included.
- LUMENFOLD world: promotional concept SVG, explicitly labelled as illustration on the product page; not represented as a gameplay screenshot.
- No remote fonts, trackers, forms, scripts or external runtime assets. The public site is not the Wonderleaf storybook app.

## Policy review and release boundaries

Notices were written against the reviewed pre-release implementations on 2026-10-30. LUMENFOLD guest/email sessions, profiles/leaderboard, server progression and protected local sessions are distinct from Wonderleaf's offline-only local data. Planned ads, purchases and Google sign-in are explicitly not represented as active SDKs.

Before distributing an app build, review these notices against that exact build, processors, data retention and Google Play Data safety answers. Update notices before enabling advertising, billing, analytics, Google sign-in or other new data practices. Wonderleaf is intended for children; do not reuse LUMENFOLD's audience or data declarations.

The LUMENFOLD website provides an email route to request account deletion; it does not implement backend erasure or an in-app deletion entry point. The game still needs its in-app deletion route, verified ownership/deletion handling and a documented production backup/retention procedure before claiming the full account-deletion requirement is complete. No automatic deletion completion, production retention interval or mail-delivery test is claimed by this site.

The Android games' package identifiers, signing, backend deployment and existing installations are not modified by this website task.
