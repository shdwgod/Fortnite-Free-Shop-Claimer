# Fortnite Free Shop Claimer

<p align="center">
  <img src="assets/banner.png" alt="Fortnite Free Shop Claimer" width="100%">
</p>

A userscript that automatically claims free bundles and items in the Fortnite Item Shop, with a clean floating control panel.

Built for players who have the **Pirate Shop Access token** activated (also called the Pirate Token), the reward from the Treasure Hunters mini-season that makes V-Bucks Item Shop items free for 14 days.

> Unofficial project. Not affiliated with, endorsed by, or sponsored by Epic Games. Fortnite is a trademark of Epic Games, Inc.

## Features

- Finds and claims every offer priced at **FREE** on `fortnite.com/item-shop`
- Opens a free bundle first when one is visible, without skipping regular items while hunting for more bundles
- Remembers your scroll position, so it doesn't rescan the whole shop after each claim
- Works with English and Polish shop pages
- Skips offers you already own and anything that isn't actually free
- Randomized short delays between actions
- Floating panel in Shadow DOM, so page styles can't break it
  - lifetime and per-session claim counters
  - shop scan progress ring
  - live status and recent activity feed
  - on/off switch, Rescan, Clear history
  - draggable and collapsible, position is remembered

## Requirements

<p align="center">
  <img src="assets/pirate-token.png" alt="Pirate Shop Access token" width="420">
</p>

This script is meant for accounts with an **active Pirate Shop Access window**. It only claims offers that the shop actually shows as free, so without an active window it has nothing to claim.

- Find the token in Treasure Hunt Chests during the Treasure Hunters mini-season.
- Activate it yourself in the Item Shop (**Plunder the Item Shop**, then **Activate Now**). The script does not activate the token for you.
- The window lasts 14 days from activation. A single token carries two activations, one for 2026 and one for 2027.
- Real-money packs, gifting, Battle Pass levels and Sidekicks you already own are not covered by the token, so they are never claimed.

These details come from third-party reports about the feature. Check Epic's official info for the current rules and dates.

## Installation

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Open the raw script and confirm the install:

   [`fortnite-free-shop-claimer.user.js`](https://raw.githubusercontent.com/shdwgod/fortnite-free-shop-claimer/main/fortnite-free-shop-claimer.user.js)

3. Sign in at [fortnite.com/item-shop](https://www.fortnite.com/item-shop). The panel appears in the top-right corner and starts automatically.

## Usage

| Control | What it does |
| --- | --- |
| Auto-claim switch | Pauses or resumes the script. The choice is saved. |
| Rescan | Starts a fresh scan from the top of the shop. |
| Clear history | Forgets processed offers and the saved scroll position for this session. |
| Chevron (top right) | Collapses or expands the panel. |
| Drag the header | Moves the panel anywhere on screen. |

## How it works

1. On the shop page it looks for tiles marked free that you don't own yet, scrolling down to load more tiles when none are found.
2. It opens the offer and verifies the price is free before doing anything.
3. It clicks through the purchase, warning, and confirmation dialogs, once per button.
4. It checks that the item now shows as owned, counts it, and returns to the shop where it left off.

## Configuration

Settings live in the `CFG` object at the top of the script.

| Option | Default | Description |
| --- | --- | --- |
| `actionDelayMs` | `700` | Base pause before interacting with a page. |
| `scrollStepPx` | `1800` | How far each scroll step moves. |
| `scrollDelayMs` | `450` | Wait for tiles to load after scrolling. |
| `maxScrollSteps` | `60` | Safety limit for one scan. |
| `detailTimeoutMs` | `8000` | Max wait for an offer page to load. |
| `purchaseTimeoutMs` | `15000` | Max time for the purchase dialogs. |
| `jitter` | `[0.7, 1.5]` | Random multiplier applied to pauses. |

If tiles are missed on a slow connection, raise `scrollDelayMs`.

## Troubleshooting

- **Nothing is claimed:** make sure your Pirate Shop Access window is active and the shop shows FREE prices.
- **Nothing happens:** make sure the page is `https://www.fortnite.com/item-shop` and that you're signed in.
- **Panel is missing:** check that the script is enabled in your userscript manager, then reload the page.
- **Stopped working after a Fortnite site update:** the script relies on page text and links, so a redesign can break it. Open an issue with the page language and what you see.
- **Debugging:** errors are logged to the browser console with the `[FN Claimer]` prefix.

## Disclaimer

This script automates clicks on your own account in your own browser. Automation may be against the terms of service of the platform. You use it at your own risk, and the authors take no responsibility for any consequences to your account.

## License

MIT
