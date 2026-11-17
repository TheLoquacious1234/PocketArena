# PocketArena — Pokémon Battle Simulator

PocketArena is a small fan-made browser battle prototype built with HTML, CSS and JavaScript modules. It demonstrates a one-on-one Charizard-versus-Blastoise battle; it is not a complete or generation-accurate Pokémon simulator.

## Features
- Responsive desktop/mobile interface and mouse, keyboard and HTML5 Gamepad API input.
- Independent player/CPU move selection and Speed-based turn order.
- Persistent win/loss states and safe rematches.
- Move PP, type/category/accuracy, Physical/Special stats, STAB and a limited type chart.
- Stat-stage and healing effects; CPU move-scoring heuristic.
- Battle engine separated from DOM code, with Node.js unit tests.
- Accessibility foundations: labelled HP bars, live status announcements, focus styles and reduced-motion support.

## Run
JavaScript ES modules require a local HTTP server. From this folder run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Test
Node.js 20 or later is recommended:

```bash
npm run check
npm test
```

## Controls
- Mouse/touch: select a move.
- Keyboard: Tab to a move; arrow keys change selection; Enter or Space activates it.
- Gamepad: D-pad Up/Down selects; button 0 (commonly A) confirms. B is not mapped.

## Project structure
- `index.html`: page structure and accessible controls.
- `style.css`: responsive styles and focus/reduced-motion support.
- `app.js`: rendering, turn sequencing and input handling.
- `battle.js`: battle data and rules.
- `tests/battle.test.js`: automated battle-engine tests.
- `.github/workflows/ci.yml`: CI syntax and test checks.
- `CHANGELOG.md`: release history.

## Limitations
The type chart only covers matchups needed by the sample roster/moves. Status ailments, switching, items, critical hits, full turn priority, teams and full generation rules are not implemented. Browser/device, physical controller and screen-reader QA remain recommended.

Pokémon is a trademark of Nintendo, Game Freak and The Pokémon Company. This unofficial fan-made project is for educational purposes.