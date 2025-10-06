# Scrabble (Full‑Stack)

<img width="1366" height="768" alt="2 player game in action" src="https://github.com/user-attachments/assets/02a106c7-f36a-4eef-b07d-904d9ef09be3" />

A modern, real‑time, two‑player Scrabble‑style game. The project is split into a React + Vite client and a Node.js + Express + WebSocket server with TypeScript on both sides.

## Quick start

```bash
# In one terminal: start the API/WebSocket server
cd server
npm install
npm run dev
# Server listens on http://localhost:3001 and ws://localhost:3001

# In another terminal: start the web client
cd client
npm install
npm run dev
# Open the printed Vite URL (typically http://localhost:5173)
```

## Requirements

- Node.js 18+
- npm 9+

## Project structure

- `client/`: React 19 app using Vite, Tailwind CSS, Zustand
- `server/`: Express 5 + `ws` WebSocket server, Vitest tests

## Scripts

### Client (`client/package.json`)

- `npm run dev`: Start Vite dev server
- `npm run build`: Type‑check and build for production
- `npm run preview`: Preview the production build
- `npm run lint`: Lint the project

### Server (`server/package.json`)

- `npm run dev`: Run server with tsx in watch mode
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Run compiled server from `dist/`
- `npm test`: Run unit tests with Vitest

## How it works

- **Transport**: The client connects to the server via WebSocket at `ws://<host>:3001` (or `wss://` if served over HTTPS). See `client/src/store/websocket.ts`.
- **HTTP**: Basic health endpoints at `GET /` and `GET /healthy` on the server. See `server/src/index.ts`.
- **Game flow**: The server manages rooms, moves, challenges, swaps, timers, and scoring logic in `server/src/game/*`.
- **State management**: Client state is handled via Zustand.
- **Styling**: Tailwind CSS 4 with a small set of custom styles.

## Configuration & environment

The default local setup assumes:

- Server listens on port `3001` (override with `PORT` env var)
- Client auto‑detects protocol and host, and connects to `ws(s)://<host>:3001`

Environment variables:

- **Server**
  - `PORT` (optional): Port for Express/WebSocket server. Default: `3001`.
- **Client**
  - None required for local. If you deploy the server on a different host/port than the client, update the WebSocket URL logic in `client/src/store/websocket.ts` or introduce an env‑based config.

## Running in production

### Build

```bash
# Build server
cd server
npm install
npm run build

# Build client
cd ../client
npm install
npm run build
# Output in client/dist
```

### Serve

- Serve `client/dist` with any static host (e.g., Nginx, Vercel, Netlify, S3+CloudFront).
- Run the server separately (Node.js process) and expose port `PORT`.
- Ensure the client can reach the WebSocket endpoint at `ws(s)://<server-host>:<PORT>`.

Example Node start:

```bash
cd server
npm ci --omit=dev
npm run build
npm start
```

## Tech stack

- **Client**: React 19, Vite 7, Tailwind CSS 4, Zustand, React Hot Toast
- **Server**: Node.js, Express 5, ws, TypeScript, tsx
- **Testing**: Vitest (server)
- **Tooling**: ESLint, TypeScript

## Development tips

- Start the server before opening the client to avoid WebSocket connection errors.
- If you change server port, update the client connection logic (or add an env var).
- Use `npm run preview` in `client/` to test the production build locally.
