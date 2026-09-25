# Moimoi Shield Quest

A mobile-first Android app that helps users practice recognizing phishing, fake airdrops, and suspicious Solana links through short learning sessions.

Built by solo developer **moimoi**, under **MOIMOI LABS**, for CLOCK IN — A Solana Mobile Hackathon.

## Features

### Shield Quest
- A 60-second SAFE/DANGER learning game.
- Three difficulty levels.
- Scores, consecutive correct answers, and learning stamps.

### QR Safety Checker
- Scan QR codes using the device camera.
- View decoded content and educational warnings about URLs and Solana URIs.
- The checker does not open scanned links, request signatures, or send transactions.
- Its warnings are educational and do not guarantee that a link is safe.

### Stamp Passport
- Track learning stamps and progress on the device.
- Progress is stored locally with AsyncStorage.
- Stamps are learning records, not NFTs or on-chain rewards.

### Japanese and English
- Language switching for the core learning experience, including Home, QR checking, Shield Quest, and Stamp Passport.

### Wallet Lab
- A separate experimental area using Solana Mobile Wallet Adapter.
- Supports wallet connection and test-network experiments.
- Includes message signing and test-network transaction functionality.
- Use Devnet and test funds for demonstrations.

## Technology

- React Native and Expo
- TypeScript and Expo Router
- Solana Mobile Wallet Adapter
- @wallet-ui/react-native-kit
- Expo Camera
- AsyncStorage

## Suggested Demo Flow

1. Open the app and choose Japanese or English.
2. Play a 60-second Shield Quest.
3. Open Stamp Passport to review learning progress.
4. Scan a sample QR code and inspect its content and warnings.
5. Explore Wallet Lab separately using Devnet.

## Project Status

The source code is available in this repository.

The submission APK, demo video, and pitch deck are being prepared. Links will be added when available.

There is currently no SKR integration.

## Credits and License

This project builds on the Expo example for @wallet-ui/react-native-kit.

The original wallet integration foundation is retained alongside the Moimoi Shield Quest learning features.

See [LICENSE](./LICENSE) for the Apache-2.0 license.
