# PocketArena — Pokémon Battle Simulator

**Project name:** PocketArena — Pokémon Battle Simulator
**Description:** A lightweight, mobile-first web-based Pokémon battle simulator with keyboard and controller accessibility. Designed for educational and fan-made use; not an official product.

## Features
- Mobile and desktop friendly responsive layout.
- Controller support via the HTML5 Gamepad API (D-pad to select, A to confirm).
- Keyboard navigation (arrow keys + Enter/Space).
- Accessible UI: ARIA attributes, focus management, readable contrast and large interactive controls.
- Simple turn-based battle system with sample Pokémon (Charizard vs Blastoise) and four moves each.
- Easy to extend — add more Pokémon, moves, or mechanics in `app.js`.

## Files
- `index.html` — main app HTML.
- `style.css` — responsive & accessible styles.
- `app.js` — battle engine + controller & keyboard support.
- `README.md` — this file.
- `LICENSE` — MIT license.

## Getting started (development)
1. Clone or download this repository.
2. Open `index.html` in a browser (no server required for basic usage).
3. For local development with live reload, serve with any static server (e.g., `npx serve` or `python -m http.server 8000`).

## Controller mapping (common)
- D-pad Up / Down: Move selection between move buttons.
- A (button 0): Confirm / use selected move.
- B (button 1): Cancel / not used by default.
- Start/Options: Not mapped by default.

Note: Different gamepads may map buttons differently — browsers expose the mapping. If a controller doesn't work, try a different USB/Bluetooth controller or check your browser's gamepad mapping support.

## Extending the simulator
- Add new Pokémon by editing the templates in `app.js`.
- Implement status effects, types, and a full damage formula to get closer to official mechanics.
- Store teams and implement switching, items, and more robust AI.

## Legal / Trademark notice
This project is fan-made and for educational purposes. The term "Pokémon" and character names are trademarks of Nintendo / Game Freak / The Pokémon Company. No infringement intended. Remove official names if you plan to publish widely to avoid trademark issues.

## Contributing
PRs welcome — keep changes small and focused. Please follow standard GitHub PR etiquette.

## License
This project is licensed under the MIT License — see the `LICENSE` file.
