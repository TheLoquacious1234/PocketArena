# Changelog

All notable changes in this repaired PocketArena build are documented here.

## [1.1.0] - 2026-11-17

### Added
- Dedicated battle engine module (`battle.js`) to separate game rules from interface and input handling.
- Move PP tracking, move types and categories, accuracy checks, Physical/Special attack and defence stats, STAB, and a limited type-effectiveness chart.
- Stat-stage effects and recovery effects, including Withdraw (Defence increase) and Roost (healing).
- CPU move-selection scoring to make opponent choices more deliberate.
- Gamepad connection status, edge-triggered button handling, D-pad move selection, and confirm input.
- Keyboard navigation scoped to the move controls, plus mouse selection synchronisation.
- Accessibility improvements: descriptive button labels, live battle announcements, labelled HP progress indicators, visible focus styling, and reduced-motion support.
- Automated battle-engine tests, npm scripts, and a GitHub Actions test workflow.
- Setup instructions, patch notes, repair report, MIT license, and repository housekeeping files.

### Fixed
- Player and CPU move selections are now independent.
- Turn order now uses Speed.
- Battle outcomes persist and prevent additional actions after a win or loss.
- Reset starts a fresh rematch and invalidates pending delayed actions from the previous battle.
- Controller button handling no longer repeatedly triggers while a button is held; the B button is not incorrectly mapped to confirmation.
- Selecting a move with a mouse now updates the selected-move indicator.

### Testing
- `npm run check` passes.
- `npm test` passes (10 tests).
- Physical browser, controller hardware, and screen-reader testing have not yet been completed.

### Notes
- Run the project through a local HTTP server because it uses JavaScript ES modules. For example: `python -m http.server 8000`.
- This is a repaired project snapshot; the original game scope and limited type chart are otherwise retained.
