# Cheza Pro

A React Native sports tracking app built with Expo. Follow your favourite football teams, track live scores, upcoming fixtures, results, and league standings across top European competitions.

---

## Screenshots

> Home · Matches · Teams · League Detail · Team Detail

---

## Features

- **Live & Upcoming Matches** — fixtures, results, and live scores per league
- **League Standings** — full tables with Champions League / Europa / Relegation zone indicators
- **Team Profiles** — badge, stadium info, formation year, social links, past & upcoming fixtures
- **League Profiles** — banner, teams list, standings, upcoming matches
- **Favorites** — save teams and leagues; persisted across app restarts via AsyncStorage
- **Search** — search teams by name (min 3 characters)
- **Dark / Light Theme** — toggle persisted to storage; defaults to dark
- **Haptic Feedback** — on all interactive elements (tabs, buttons, cards)
- **Skeleton Loading** — animated placeholders while data loads
- **Pull to Refresh** — on all list screens

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Expo](https://expo.dev) ~54.0.0 |
| Navigation | [Expo Router](https://expo.github.io/router) ~6.0.0 (file-based) |
| Styling | [NativeWind](https://www.nativewind.dev) v4 + Tailwind CSS |
| Gradients | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) |
| Icons | [@expo/vector-icons](https://docs.expo.dev/guides/icons/) (Ionicons) |
| Haptics | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) |
| Images | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| HTTP | [axios](https://axios-http.com) |
| Storage | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| Animations | React Native `Animated` API |
| Language | TypeScript |

---

## Data Source

All sports data is provided by [TheSportsDB](https://www.thesportsdb.com/) free API.

- **API Key:** `123` (free tier, publicly documented)
- **Base URL:** `https://www.thesportsdb.com/api`
- No registration required for the free tier

### Supported Leagues

| League | ID |
|---|---|
| English Premier League | 4328 |
| La Liga | 4335 |
| Bundesliga | 4331 |
| Serie A | 4332 |
| Ligue 1 | 4334 |
| UEFA Champions League | 4480 |

---

## Project Structure

```
sports/
├── app/
│   ├── _layout.tsx              # Root layout (providers, stack navigator)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar with Ionicons + haptics
│   │   ├── index.tsx            # Home — hero banner, leagues, upcoming matches
│   │   ├── matches.tsx          # Matches — upcoming/results toggle, league filter
│   │   ├── teams.tsx            # Teams & Leagues — search, league filter
│   │   └── favorites.tsx        # Saved teams and leagues
│   ├── team/
│   │   └── [id].tsx             # Team detail — fixtures, results, info
│   └── league/
│       └── [id].tsx             # League detail — fixtures, table, teams
├── src/
│   ├── components/
│   │   ├── Header.tsx           # App header with back, theme toggle, favorite button
│   │   ├── MatchCard.tsx        # Match card with live pulse, WIN/LOSS/DRAW labels
│   │   ├── TeamCard.tsx         # Team card (compact + full modes)
│   │   ├── LeagueCard.tsx       # League card (compact + full modes)
│   │   ├── StandingRow.tsx      # Standing row with rank color indicator
│   │   ├── LoadingSpinner.tsx   # Animated skeleton loader
│   │   ├── SearchBar.tsx        # Search input with clear button
│   │   ├── EmptyState.tsx       # Empty list placeholder with icon
│   │   ├── ErrorMessage.tsx     # Error display with retry button
│   │   └── index.ts             # Barrel exports
│   ├── context/
│   │   ├── ThemeContext.tsx      # Dark/light/system theme with persistence
│   │   └── FavoritesContext.tsx  # Favorites state with AsyncStorage persistence
│   ├── hooks/
│   │   └── useApi.ts            # Generic data fetching hook with loading/error state
│   ├── services/
│   │   └── api.ts               # TheSportsDB API calls
│   ├── constants/
│   │   └── index.ts             # League IDs, league names, app config
│   └── types/
│       └── index.ts             # TypeScript interfaces (Team, League, Match, Standing)
├── assets/                      # Icons, splash screen, adaptive icon
├── global.css                   # Tailwind directives
├── tailwind.config.js           # Theme tokens (primary green, dark palette, accents)
├── babel.config.js              # NativeWind + Reanimated babel config
├── app.json                     # Expo app config
├── eas.json                     # EAS Build profiles
└── .env                         # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [EAS CLI](https://docs.expo.dev/eas/) — `npm install -g eas-cli` (for builds)
- Android Studio or Xcode (for emulators), or the Expo Go app on a physical device

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sports

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root (already gitignored):

```env
EXPO_PUBLIC_THE_SPORTS_DB_KEY=123
EXPO_PUBLIC_THE_SPORTS_DB_BASE_URL=https://www.thesportsdb.com/api
```

> The free API key is `123` as per the official TheSportsDB documentation.

### Running Locally

```bash
# Start Expo dev server
npm start

# Run on Android emulator / device
npm run android

# Run on iOS simulator / device
npm run ios

# Run in browser
npm run web
```

---

## Building

All builds use [EAS Build](https://docs.expo.dev/build/introduction/).

### Build Profiles

| Profile | Command | Output | Use case |
|---|---|---|---|
| Development | `eas build --platform android --profile development` | APK (internal) | Dev client with debugger |
| Preview | `eas build --platform android --profile preview` | APK (internal) | Internal testing |
| APK Release | `eas build --platform android --profile apk` | APK (internal) | Sideloading |
| Production | `eas build --platform android --profile production` | AAB | Google Play Store |

### Over-the-Air Updates (Expo)

Push a JS bundle update directly to users without a new store submission:

```bash
eas update --branch production --message "your update message"
```

### Submit to Google Play

```bash
eas submit --platform android --profile production
```

---

## Design System

| Token | Dark | Light |
|---|---|---|
| Background | `#0f0f1a` | `#f8fafc` |
| Surface | `#161626` | `#ffffff` |
| Border | `#252545` | `#e2e8f0` |
| Accent (primary) | `#22c55e` | `#22c55e` |
| Text primary | `#ffffff` | `#0f172a` |
| Text muted | `#6b7280` | `#94a3b8` |

Standing row colors:
- **Green** — Champions League positions (top 4)
- **Blue** — Europa League positions (5–6)
- **Red** — Relegation zone (18+)

---

## Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_THE_SPORTS_DB_KEY` | TheSportsDB API key | `123` |
| `EXPO_PUBLIC_THE_SPORTS_DB_BASE_URL` | TheSportsDB base URL | `https://www.thesportsdb.com/api` |

All variables prefixed with `EXPO_PUBLIC_` are bundled into the client. Never store private keys this way.

---

## App Config

- **Bundle ID (iOS):** `com.sports.tracker`
- **Package (Android):** `com.sports.tracker`
- **EAS Project ID:** `01fb33eb-9dc2-4d9e-802d-f7f25a96e9b4`
- **Owner:** `mainaport`
- **Orientation:** Portrait only
- **Typed Routes:** Enabled

---

## License

Private — all rights reserved.
