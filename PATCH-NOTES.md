# PocketArena 1.1.0 — Patch notes

## Fixed
- Player and CPU move selections are independent; CPU choice is made once per turn.
- Speed determines turn order, with the player first on a tie.
- Battle results persist; actions are blocked after victory or defeat.
- Reset invalidates pending delayed actions before creating a rematch.
- Gamepad input triggers on button press edges, not continuously while held.
- Keyboard arrow shortcuts are scoped to move controls; Enter/Space retain native button behaviour.
- B is explicitly not mapped; the redundant Next/test-turn control is removed.

## Battle mechanics
- Added move type, category, PP, accuracy and effect metadata.
- Added separate Attack, Defence, Special Attack and Special Defence stats.
- Added STAB and a limited type-effectiveness chart for the sample roster.
- Roost heals; Withdraw raises Defence.
- Added a simple CPU move-scoring heuristic.

## Engineering and accessibility
- Separated battle rules into battle.js.
- Added Node.js tests and GitHub Actions checks.
- Improved focus visibility, HP labels, status announcements, target sizing and reduced-motion handling.

## Validation limitations
Automated syntax checks and 10 battle-engine tests pass. Browser/device, controller and screen-reader testing were not performed in this environment.