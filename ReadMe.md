# GymApp

A modern gym tracking app built with Expo (React Native) and Supabase.

## Overview

GymApp helps users organize, track, and improve their workouts. Users can sort their routines into workouts (e.g., "Pull Day"), with each workout containing specific exercises. When performing an exercise, users can log the weight and reps per set. Sets are automatically grouped based on gym sessions, and the app provides progress insights by comparing the latest session to previous ones.

Additionally, users can share their workout routines, allowing others to easily copy and use them.

## Features

- Organize routines into customizable workouts (Push, Pull, Legs, etc.)
- Add exercises to workouts and track weight, reps, and sets
- Automatic set grouping by gym session
- Progress comparisons between sessions
- Share workout routines; copy routines from other users
- User authentication and data storage via Supabase

## Getting Started

### Prerequisites

- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Supabase](https://supabase.com/) account and project

### 1. Clone the repository

```sh
git clone https://github.com/NichitaCon/GymApp.git
cd GymApp
```

### 2. Install dependencies

```sh
npm install
# or
yarn install
```

### 3. Configure Supabase

- Create a Supabase project at [supabase.com](https://supabase.com/).
- In your project dashboard, go to Project Settings > API and copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

- Create a file called `.env` in the root of your project and add:

  ```
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

- Please email me at NichitaDev@gmail.com So i can send you the database schema for easy replication :)

### 4. Run the project

Start the Expo development server:

```sh
npx expo start
```

Use the Expo Go app (iOS/Android) or an emulator to run the app.

## Usage

1. Register or sign in with your account.
2. Create routines and workouts, and add exercises.
3. When performing an exercise, log your sets (weight & reps).
4. View session history and progress comparisons.
5. Browse and copy community-shared routines.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For questions or feedback, open an issue or contact [NichitaCon](https://github.com/NichitaCon).
