# Tactical Board App

App para tableros tácticos de fútbol con BD para plantillas de ligas.

## Setup

### Backend (tactical-board/server)
1. Configura MongoDB Atlas: Crea cluster gratuito, obtiene URI, reemplaza en .env.
2. `cd tactical-board/server`
3. `npm install`
4. `npm run dev` (usa nodemon para desarrollo)

API endpoints base:
- GET /api/leagues - Lista ligas
- GET /api/teams?leagueId=premier-league - Equipos por liga
- GET /api/formations?teamId=... - Formaciones por equipo

### Frontend (tactical-board/client)
1. `cd tactical-board/client`
2. `npm install` (ya hecho)
3. `npm run dev` - Corre en http://localhost:5173

Proxy API: En vite.config.js, agrega proxy a backend (localhost:5000).

### Seed BD
Ejecuta script seed.js (por agregar) para insertar Premier League data.

## Stack
- Frontend: React + Vite + Tailwind + React DnD + Framer Motion
- Backend: Node/Express + Mongoose + MongoDB Atlas
- Persistencia: localStorage para estados anónimos