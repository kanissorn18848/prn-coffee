# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PRN Coffee is a static, no-build frontend for a coffee pre-order system used by students. Orders are submitted to a Google Apps Script backend that writes to Google Sheets. The site is hosted via GitHub Pages.

## Architecture

The app is a single HTML page (`index.html`) with three vanilla JS modules loaded in order:

1. `scripts/main.js` — Defines `SCRIPT_URL` (the Google Apps Script endpoint) and `apiFetch()`. Bootstraps the app on `DOMContentLoaded` by calling `checkDailyStock()` and `updateSummary()`, and wires all event listeners.
2. `scripts/stock.js` — Fetches shop status (open/closed, sold-out, remaining cups, schedule, announcement) from the backend via GET. Drives the status indicator and disables ordering when closed or sold out.
3. `scripts/order.js` — Handles the order form: live summary/price calculation (`updateSummary`), form reset (`clearForm`), honeypot spam check, and order submission (`submitOrder`) via POST with `mode: "no-cors"`.

Scripts depend on each other in load order — `stock.js` and `order.js` call `apiFetch` defined in `main.js`. Load order in `index.html` must be preserved.

## Backend

The backend is a Google Apps Script web app at the URL in `SCRIPT_URL` (`main.js:1`). It handles:

- **GET** → returns JSON: `{ isShopOpen, isSoldOut, remaining, schedule, announcement }`
- **POST** → accepts JSON order body and appends a row to Google Sheets

The backend is managed separately (not in this repo). Changes to the request/response shape must be coordinated with the Apps Script.

## Key Conventions

- Prices are computed client-side from `data-price` attributes on `<option>` elements. Cold +5฿, extra shot +5฿, oat milk +5฿.
- All user-facing string values that go to Google Sheets are sanitized via `sanitizeForSheets()` (strips CSV injection prefixes).
- Student ID is optional but validated as exactly 7 digits before submission.
- The `#hp-field` hidden input is a honeypot — orders are silently dropped if it has a value.
- POST responses are ignored (`mode: "no-cors"` returns opaque response), so success is assumed after the fetch resolves without error.

## Development

No build step. Open `index.html` directly in a browser or serve it with any static file server:

```bash
python3 -m http.server 8080
```

To test against the live backend, no additional setup is needed — the `SCRIPT_URL` in `main.js` is the production endpoint.
