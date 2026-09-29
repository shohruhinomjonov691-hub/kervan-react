# Kervan · Restaurant Web Application

A restaurant frontend that connects menu discovery, a shopping basket, customer orders, and branch information in one application. Kervan is my second major full-stack project; this repository contains its React client.

[Backend repository](https://github.com/shohruhinomjonov691-hub/kervan) · [Application](http://kervan.uz/)

## Features

- Browse dishes with search, collection filters, sorting, and pagination.
- Open individual dishes and add items to a basket with quantity controls.
- Create orders and review paused, processing, and completed orders.
- Register, sign in, and update account details and profile images.
- Browse restaurant branches and submit reservation requests and customer inquiries through the backend's Telegram relay.
- Read and submit customer comments.
- Explore popular dishes, new dishes, restaurant statistics, and active users on the home page.

## Technology

React 18, TypeScript, Redux Toolkit, React Router, Material UI, Axios, Socket.IO client, styled-components, and Swiper. The application uses Create React App through `react-scripts`.

## Architecture

```text
React screens → service classes / Axios → Kervan REST API → MongoDB
      ↓
Redux Toolkit slices and selectors
```

Screens live in [`src/app/screens`](src/app/screens), API access is organized in [`src/app/services`](src/app/services), and shared configuration and types live in [`src/lib`](src/lib). Context providers handle application-wide member/socket state.

## Run locally

Start the [Kervan backend](https://github.com/shohruhinomjonov691-hub/kervan) first. Use a Node.js runtime compatible with `react-scripts` and the backend; Node.js 20 matches the setup described here.

```bash
git clone --branch develop https://github.com/shohruhinomjonov691-hub/kervan-react.git
cd kervan-react
npm install
```

Create `.env` in the repository root:

```dotenv
REACT_APP_API_URL=http://localhost:3003
```

```bash
npm start
```

Open `http://localhost:3000`. Set the backend's `FRONTEND_URL` to this same origin so credentialed requests work. `REACT_APP_` variables are included in the browser bundle; keep API keys and Telegram credentials on the backend.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Development server |
| `npm run build` | Production assets in `build/` |
| `npm test` | React test runner |
| `npm run start:prod` | Serve the build on port 3000; requires `serve` to be installed separately |

Environment values are embedded at build time. Configure the deployed API URL before building, and configure the hosting server to return `index.html` for client-side routes.

## Project scope

The payment-method screen is a **demo flow**. It validates card-shaped inputs and stores masked card metadata through the backend, but it does not charge a card or integrate a payment processor. Use synthetic demo values only.

This is a completed portfolio application. The repository contains a starter test, rather than a comprehensive automated test suite; availability of a test command should not be interpreted as verified coverage of every user flow.

## Author

[Shokhrukhbek Inomjonov](https://github.com/shohruhinomjonov691-hub)
