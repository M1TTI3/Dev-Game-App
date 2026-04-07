# CodeQuest MVP (Mobile-First Prototype)

This is the first prototype for a game-like coding learning app.

## Why this version is scoped this way

- It focuses on one starter path (`Web Dev Explorer`) to keep v1 realistic.
- It includes the full first-run loop:
  1. Welcome
  2. Onboarding questionnaire
  3. Personalized path result
  4. Home dashboard with progression
  5. Mission details
  6. Interactive coding challenge
  7. Reward screen
- It uses lightweight placeholder game logic (XP, coins, streak, level) that can later be connected to a backend.

## Stack

- **React + TypeScript + Vite**
- This gives a modern UI workflow, fast iteration, and a clean path to later move into a mobile wrapper (like Capacitor/React Native migration strategy).

## Local preview

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Next sensible iterations

- Save progression in local storage
- Add mission map and multiple missions
- Add backend auth/profile
- Expand into more paths: game dev, python automation
