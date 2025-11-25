# Out&Abt

Welcome to **Out&Abt** - a React Native app built with Expo by the out&abt team.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go app](https://expo.dev/go) on your iOS or Android device (for testing on a real device)
- A free [Supabase](https://supabase.com) account

## Getting Started

Follow these steps to get the project running on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/gabeferreiraa/outandabt.git
cd outandabt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase environment variables (Required!)

This project uses Supabase for the backend. You need to add your Supabase credentials.

1. Go to [https://supabase.com](https://supabase.com) and create a new project (or use an existing one)
2. In your Supabase dashboard, go to **Settings → API**
3. Copy your **Project URL** and **anon public** key
4. Copy the example env file:

```bash
cp example.env .env
```

5. Open the new `.env` file and replace the values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

The app will not work without these!

### 4. Start the development server

```bash
npx expo start
```

Or clear cache if you're having issues:

```bash
npx expo start -c
```

### 5. Run the app

After starting the server, you'll see a QR code:

#### Option A: On your phone (recommended)

- Open the **Expo Go** app on iOS or Android
- Scan the QR code

#### Option B: iOS Simulator (macOS only)

- Press `i` in the terminal

#### Option C: Android Emulator

- Press `a` in the terminal

## Project Structure

- **app/** - Main application code with file-based routing
- **assets/** - Images, fonts, and other static files
- **components/** - Reusable React components
- **hooks/** - Custom hooks (like useActivitySheet)
- **lib/** - Supabase client and utilities

## Development

Edit files in the **app** directory. Changes reload automatically thanks to Expo.

This project uses:

- Expo Router (file-based routing)
- Supabase (database + auth)
- Zustand (global state)
- @gorhom/bottom-sheet (full-screen modals)
- react-native-maps
- TypeScript

## Useful Commands

```bash
npx expo start          # Start dev server
npx expo start -c       # Start with cleared cache
eas build --platform all # Build for iOS & Android
```

## Deploying

When ready to ship:

```bash
eas build --platform all     # Production build
eas submit                   # Submit to App Store / Google Play
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## Team

Built with love by the **out&abt** team

## Support

Questions? Issues?  
Open a GitHub issue or reach out to the team.

Let’s go **Out&Abt**!
