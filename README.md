# 🎉 Party Stacks

> **Collaborative Rain Parties on the Stacks Blockchain**

Party Stacks is a decentralized application (dApp) that gamifies pooled STX micro-payments. Users can host parties by creating a pool of STX tokens, invite friends to join, and when the party reaches capacity, all participants can claim their proportional share of the "rain."

![Party Stacks Interface](./screenshots/homepage.png)

## ✨ Features

### 🔐 WalletConnect Integration
- Seamless wallet connection via **@stacks/connect**
- Prominent WalletConnect logo for hackathon judging
- Persistent session management
- Support for Stacks testnet and mainnet

### 🎊 Host a Party
- Create STX pools with customizable amounts
- Set maximum participant limits (2-100 people)
- Real-time calculation of rewards per participant
- Transaction confirmations via wallet

### 🌊 Join & Participate
- Browse active parties in real-time
- Join parties with a single click
- Animated progress bars showing participant count
- Classy toast notifications: *"You are in the splash zone!"*

### 💰 Claim Your Rain
- Automatic detection when party reaches capacity
- One-click claim button for participants
- Proportional STX distribution
- Transparent on-chain verification

### 🎨 Premium UI/UX
- **Classy Dark Mode** aesthetic
- Glassmorphism effects throughout
- Stacks brand colors (Orange #ff8c00 / Purple #9b4dff)
- Smooth micro-animations
- Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Goodnessmbakara/partystacks.git
cd partystacks

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your contract address

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running!

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Smart Contract

The **party-rain** Clarity smart contract is located in `/contracts/party-rain.clar`

### Key Functions

#### Public Functions
- `create-party(stx-amount: uint, max-participants: uint)` - Create a new party
- `join-party(party-id: uint)` - Join an existing party
- `claim-rain(party-id: uint)` - Claim your reward when party is full

#### Read-Only Functions
- `get-party(party-id: uint)` - Get party details
- `is-participant(party-id: uint, participant: principal)` - Check participation status
- `get-reward-per-participant(party-id: uint)` - Calculate reward amount

### Deploying to Testnet

```bash
# Install Clarinet (if not already installed)
brew install clarinet

# Deploy to testnet
clarinet deploy --testnet

# Update .env with deployed contract address
VITE_CONTRACT_ADDRESS=<your-contract-address>
VITE_CONTRACT_NAME=party-rain
```

## 🏗️ Architecture

### Tech Stack

**Frontend**
- **Svelte 5** - Reactive UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Vanilla CSS** - Custom design system

**Blockchain**
- **Stacks** - Bitcoin-secured smart contracts
- **Clarity** - Decidable smart contract language
- **@stacks/connect** - Wallet integration
- **@stacks/blockchain-api-client** - Blockchain data

### Project Structure

```
party-stacks/
├── src/
│   ├── lib/
│   │   ├── wallet.ts              # Wallet connection logic
│   │   ├── toastStore.ts          # Toast notifications
│   │   ├── partyStore.ts          # Party state management
│   │   ├── types.ts               # TypeScript interfaces
│   │   └── blockchain-sync.ts     # Real-time polling (TODO)
│   ├── components/
│   │   ├── ConnectWallet.svelte   # Wallet button
│   │   ├── HostParty.svelte       # Create party form
│   │   ├── PartyCard.svelte       # Individual party display
│   │   ├── ActiveParties.svelte   # Party list
│   │   └── Toast.svelte           # Notification system
│   ├── styles/
│   │   └── theme.css              # Design system
│   ├── App.svelte                 # Main app
│   └── main.ts                    # Entry point
├── contracts/
│   └── party-rain.clar            # Clarity smart contract
├── prd.md                         # Product requirements
└── README.md                      # You are here!
```

## 🎯 Hackathon Strategy

This project is optimized for the **Stacks blockchain hackathon**:

### Ranking Factors
1. ✅ **GitHub Progress** - Regular commits every 3-4 hours
2. ✅ **Onchain Progress** - Testnet deployment + test transactions
3. ✅ **WalletConnect Focus** - Prominent logo and integration
4. ✅ **The "Claim" Loop** - 5+ friends creating on-chain activity
5. ✅ **Classy UX** - Premium glassmorphism and animations

### Testnet Activity
```bash
# Create test party
npm run test:create-party

# Invite friends to join
# Each join creates an on-chain transaction signal

# Full party triggers claim availability
npm run test:claim
```

## 🔬 Development

### Running Tests (TODO)
```bash
npm run test
```

### Type Checking
```bash
npm run check
```

### Linting (TODO)
```bash
npm run lint
```

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- **Stacks Foundation** - For the amazing blockchain infrastructure
- **WalletConnect** - For seamless wallet integration
- **Svelte Team** - For the incredible framework
- **Community** - For testing and feedback

## 📧 Contact

**Developer:** Goodness Mbakara  
**GitHub:** [@Goodnessmbakara](https://github.com/Goodnessmbakara)  
**Repository:** [partystacks](https://github.com/Goodnessmbakara/partystacks)

## 🎪 Demo

🔗 **Live Demo:** [Coming soon]  
🎥 **Video Walkthrough:** [Coming soon]  
📷 **Screenshots:** See `/screenshots` folder

---

Built with ❤️ on the Stacks blockchain | **#PartyStacks** 🎉💦
