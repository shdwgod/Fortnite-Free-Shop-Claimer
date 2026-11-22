# Fortnite Free Shop Claimer

<p align="center">
  <img src="assets/banner.png" alt="Fortnite Free Shop Claimer" width="100%">
</p>

A userscript that automatically claims free bundles and items in the Fortnite Item Shop, with a clean floating control panel. It comes in two variants: a normal one that behaves like a person at the keyboard, and a fast one for when you just want it done.

Built for players who have the **Pirate Shop Access token** activated (also called the Pirate Token), the reward from the Treasure Hunters mini-season that makes V-Bucks Item Shop items free for 14 days.

> Unofficial project. Not affiliated with, endorsed by, or sponsored by Epic Games. Fortnite is a trademark of Epic Games, Inc.

## Features

- Finds and claims every offer priced at **FREE** on `fortnite.com/item-shop`
- Opens free bundles first, then regular items on the next scan
- Saves the queue for the session, so it doesn't rescan the whole shop after each claim
- Works with English and Polish shop pages
- Skips offers you already own and anything that isn't actually free
- Keeps running from a background tab
- Human-like mode (normal version)
  - moves a virtual pointer along curved paths and clicks inside buttons at random points
  - opens offers by clicking their tiles and returns to the shop through the site's own link
  - eased scrolling, random pauses, shuffled order, and a longer break every few claims
- Floating panel in Shadow DOM, so page styles can't break it
  - lifetime and per-session claim counters
  - shop scan progress ring
  - live status and recent activity feed
  - on/off switch, Rescan, Clear history
  - draggable and collapsible, position is remembered

## Variants

| | Normal | Fast |
| --- | --- | --- |
| File | `fortnite-free-shop-claimer.user.js` | `fortnite-free-shop-claimer-fast.user.js` |
| Input | pointer movement, full click sequences, reaction time | direct `.click()` |
| Navigation | clicks tiles and the shop link | loads offer URLs directly |
| Pauses | 2.5 to 7 s between offers, break every 3 to 6 claims | short, a fraction of a second |
| Speed | slow, a claim every ten seconds or more | a few seconds per offer |
| `human` | `true` | `false` |

Install only one of them at a time. They share the same storage keys and would get in each other's way.

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
2. Open the raw script you want and confirm the install:

   - Normal: [`fortnite-free-shop-claimer.user.js`](https://raw.githubusercontent.com/shdwgod/fortnite-free-shop-claimer/main/fortnite-free-shop-claimer.user.js)
   - Fast: [`fortnite-free-shop-claimer-fast.user.js`](https://raw.githubusercontent.com/shdwgod/fortnite-free-shop-claimer/main/fortnite-free-shop-claimer-fast.user.js)

3. Sign in at [fortnite.com/item-shop](https://www.fortnite.com/item-shop). The panel appears in the top-right corner and starts automatically.

## Usage

| Control | What it does |
| --- | --- |
| Auto-claim switch | Pauses or resumes the script. The choice is saved. |
| Rescan | Drops the current queue and starts a fresh scan from the top of the shop. |
| Clear history | Forgets processed offers, the queue, the break counter and the session counters. |
| Chevron (top right) | Collapses or expands the panel. |
| Drag the header | Moves the panel anywhere on screen. |

## How it works

1. On the shop page it waits for tiles to load, then scrolls through the whole shop and collects tiles that are marked free and not owned. Bundles go first, regular items are used only when no free bundle is found.
2. The queue is stored for the session (30 minutes), so the shop is not rescanned between offers.
3. It opens the next offer. The normal version scrolls to the tile and clicks it, the fast version loads the offer URL.
4. On the offer page it verifies that the price is free and that the item isn't owned before doing anything.
5. It clicks through the purchase, warning, and confirmation dialogs, once per button.
6. It checks that the item now shows as owned, counts it, and returns to the shop. The normal version waits a few seconds first and takes a longer break every few claims.
7. When the queue is empty it scans once more to confirm nothing is left, then stops with "Done".

## Configuration

Settings live in the `CFG` object at the top of the script. Values below are the defaults of the normal version, the fast version differs where noted.

### Timing and limits

| Option | Default | Fast | Description |
| --- | --- | --- | --- |
| `actionDelayMs` | `700` | `300` | Base pause before interacting with a page. |
| `scrollStepRatio` | `0.8` | `0.9` | Scroll step as a share of the window height in fast mode. |
| `scrollDelayMs` | `400` | `400` | Wait for tiles to load after scrolling. |
| `maxScrollSteps` | `150` | `150` | Safety limit for one scan. |
| `catalogTimeoutMs` | `15000` | `15000` | Max wait for the shop to load. |
| `detailTimeoutMs` | `12000` | `12000` | Max wait for an offer page to load. |
| `purchaseTimeoutMs` | `20000` | `20000` | Max time for the purchase dialogs. |
| `growTimeoutMs` | `2500` | `1500` | How long to wait for more tiles at the bottom of the shop. |
| `maxReloads` | `2` | `2` | Reload attempts when a page doesn't load. |
| `stuckMs` | `60000` | `60000` | Restart a run that makes no progress for this long. |
| `idleKickMs` | `20000` | `20000` | Restart an idle script after this long. |
| `planTtlMs` | `30 min` | `30 min` | How long a saved queue stays valid. |
| `jitter` | `[0.7, 1.5]` | `[0.3, 0.5]` | Random multiplier applied to pauses. |
| `backgroundMode` | `true` | `true` | Keeps the script working in a background tab. |

### Human-like mode

| Option | Default | Fast | Description |
| --- | --- | --- | --- |
| `human` | `true` | `false` | Master switch. When `false`, clicks and navigation are direct and the options below are ignored. |
| `betweenOffersMs` | `[2500, 7000]` | unused | Pause after finishing an offer. |
| `thinkChance` | `0.06` | unused | Chance of an extra pause on any wait. |
| `thinkMs` | `[1500, 4500]` | unused | Length of that extra pause. |
| `breakEvery` | `[3, 6]` | unused | A longer break after this many claims, chosen at random each time. |
| `breakMs` | `[20000, 60000]` | unused | Length of the longer break. |
| `shuffleQueue` | `true` | unused | Random order inside the bundle or item group. |

If tiles are missed on a slow connection, raise `scrollDelayMs`. For the most natural behavior keep the tab visible and set `backgroundMode` to `false`, because background mode fakes the page visibility state.

## Troubleshooting

- **Nothing is claimed:** make sure your Pirate Shop Access window is active and the shop shows FREE prices.
- **Nothing happens:** make sure the page is `https://www.fortnite.com/item-shop` and that you're signed in.
- **Panel is missing:** check that the script is enabled in your userscript manager, then reload the page.
- **Too slow:** use the fast version, or lower `betweenOffersMs` and raise `breakEvery` in the normal one.
- **Both scripts installed:** disable one of them, they share their storage keys.
- **Stopped working after a Fortnite site update:** the script relies on page text and links, so a redesign can break it. Open an issue with the page language and what you see.
- **Debugging:** errors are logged to the browser console with the `[FN Claimer]` prefix.

## Disclaimer

This script automates clicks on your own account in your own browser. Automation may be against the terms of service of the platform. Human-like pacing makes the script behave more like a person, it does not make automation undetectable or permitted. You use it at your own risk, and the authors take no responsibility for any consequences to your account.

## License

MIT
