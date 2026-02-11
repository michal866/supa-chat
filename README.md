# Supabase Chat

Angular chat application using Supabase for authentication and real-time features.
Built to learn and experiment with Angular framework and Angular Material UI library.

## Features

- Email/password and passwordless authentication flows (via Supabase Auth).
- Real-time chat rooms (Supabase Realtime/Postgres).
- Material Design UI (Angular Material) with custom M3 theme schematic.
- Work in progress: features and UI are under active development.

## Tech Stack

- **Framework:** Angular 19 (standalone components, zoneless change detection, lazy-loading)
- **Language:** TypeScript
- **Backend as a Service:** Supabase (Auth, Postgres, Realtime, Storage)
- **State/Async:** RxJS, Angular Signals
- **UI Library:** Angular Material
- **Code Quality:** ESLint, Prettier

## Project layout (high level)

```
src/
├── app/
│   ├── app.config.ts      # Global providers (Zoneless, Router, HttpClient)
│   ├── app.routes.ts      # Route definitions
│   ├── auth/              # Sign in / Sign up / Magic Links
│   ├── chat-room/         # Main chat interface
│   ├── services/          # Supabase client wrappers
│   └── guards/            # Auth guards
├── assets/                # Static assets & M3 theme
└── styles.scss            # Global styles
```
