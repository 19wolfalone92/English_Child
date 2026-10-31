# EVA • VISUAL STUDIO QUALITY GATE

This children's visual track adapts the internal quality principles of **Two-Worlds-Studio** to **Eva English Kids** without importing its dark, adult-oriented animation canon.

## Original artwork
- `app/src/main/assets/wolfie.svg`: original mascot, role: friendly guide, no licensed character likeness.
- `app/src/main/assets/eva-valley.svg`: original deterministic vector landscape, role: decorative navigation world with HTML touch targets layered above.
- `app/src/main/assets/magic-world.css`: mobile/touch styling; uses existing user-customizable CSS variables. No CDN, stock imagery, watermarks or external audio.

## Mandatory child-facing review before calling a release production-ready
- **4 sizes**: 320×700, 360×780, 390×844, 600×900 pixels. Main «Продолжить» button visible promptly; taps ≥44×44 logical pixels.
- **Readability**: no text painted into art; screen reader labels belong to actionable HTML; decorative image alternative is descriptive.
- **Safety**: no ads, links, trackers, social sharing, ads from partner SDKs, or paid purchases. Device is offline by default.
- **Light/dark of custom colors**: verify contrast on every preset; a custom palette can reduce contrast, so preview must stay reversible.
- **Motion**: avoid autoplay, flashing and stressful timers. Respect `prefers-reduced-motion`.
- **Learning validity**: an unanswered sound when no TTS is NOT scored as listening proficiency. Praise effort, never shame errors.
- **Licensing**: no third-party image layers are included. Any future AI or studio-generated assets must have documented usage rights and human review.
- **Actual Android**: manually exercise Russian and US TTS installations, Back, keyboard focus, touch, app suspend/relaunch, export/import, signing upgrade, and parental restrictions.

## Automated checks
`scripts/audit_assets.mjs` verifies local resources, safe SVGs and absence of networking/permissions. `scripts/test_course.mjs` covers the course and games in a lightweight simulated DOM. `gradle :app:lintDebug :app:assembleDebug`, ZIP integrity and APK signature checks run in GitHub Actions.

**These automated checks are not a substitute for physical-phone acceptance, nor do they independently certify a CEFR level.**
