<p align="center">
  <img src="assets/banner2.png" alt="Fortnite Free Shop Claimer" width="100%">
</p>

# Fortnite Free Shop Claimer

Userscript that claims everything marked **FREE** in the Fortnite Item Shop, so you don't have to click through every offer by hand.

Made for the **Pirate Shop Access** token. Without an active token window the shop has nothing free and the script has nothing to claim.

> Unofficial project, not affiliated with Epic Games. Fortnite is a trademark of Epic Games, Inc.

## Pirate Shop Access

A rare drop from chests in the Treasure Hunters mini-season. Once activated, V-Bucks items in the Item Shop are free for 14 days and you keep what you claim.

- Activate it yourself: Item Shop, **Plunder the Item Shop**, **Activate Now**. The script never does this for you.
- One token gives two activations: the first by **15 Dec 2026**, the second between 1 Jan and 15 Dec 2027.
- Real-money packs, Crew, Battle Pass levels and gifting are not covered.

## Install

1. Get a userscript manager: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. [Install the script](https://github.com/shdwgod/Fortnite-Free-Shop-Claimer/raw/refs/heads/main/fortnite-free-shop-claimer.user.js). Updates come from this repo automatically.
3. Open [fortnite.com/item-shop](https://www.fortnite.com/item-shop) while signed in.

## Usage

The panel shows up in the bottom-right corner and starts **paused**. Press **Start**.

| Button | Does |
| --- | --- |
| Start / Pause | Runs or stops the claimer. A run survives page loads, but a new tab starts paused again. |
| Rescan | Drops the queue and scans the shop from the top. |
| Reset | Clears processed offers, the queue and session counters. |

Drag the header to move the panel, use the arrow to collapse it. Position and the all-time counter are remembered.

## How it works

1. Scrolls the whole shop and collects tiles that are free and not owned. Bundles go first, single items only if no free bundle is left.
2. Opens each offer, checks again that it is free and not owned, then clicks through purchase, warning and confirm dialogs.
3. Counts the claim once the item shows as owned, then moves on. When the queue is empty it scans once more and stops.

Works with English and Polish shop pages and keeps running in a background tab.

## Configuration

Options are in the `CFG` object at the top of the script.

| Option | Default | |
| --- | --- | --- |
| `actionDelayMs` | `300` | Base pause before interacting with a page |
| `scrollDelayMs` | `400` | Wait for tiles to load after each scroll. Raise it on a slow connection |
| `backgroundMode` | `true` | Keeps the script working in a hidden tab |
| `human` | `false` | Slower mode: pointer movement, pauses between offers, breaks every few claims |

## Troubleshooting

- **Nothing happens:** check that you are on `fortnite.com/item-shop`, signed in, and pressed Start.
- **Nothing is claimed:** the shop must actually show FREE prices, so activate the token first.
- **Panel missing:** make sure the script is enabled in your manager and reload the page.
- **Broke after a site update:** the script reads page text and links, so a redesign can break it. Open an issue with your shop language and what you see. Errors are logged to the console with the `[FN Claimer]` prefix.

## Disclaimer

The script automates clicks on your own account in your own browser. That may go against Epic's terms of service. Use it at your own risk.

## License

MIT
