# Party Stacks - Product Requirements Document

## Executive Summary

**Party Stacks** is a collaborative "rain party" decentralized application (dApp) built on the Stacks blockchain that gamifies pooled STX micro-payments. Users can host parties by creating a pool of STX tokens, invite friends to join, and when the party reaches capacity, all participants can claim their proportional share of the "rain."

**Target Hackathon:** Stacks blockchain hackathon with WalletConnect integration emphasis  
**Target Deployment:** Stacks Testnet (initial), Mainnet (post-hackathon)  
**Competition Goal:** Rank #1 to win 600 $STX reward

---

## Product Vision

### Problem Statement
Current blockchain transactions are often isolated, individual actions. There's limited tooling for collaborative, social, and gamified on-chain interactions that bring people together in a fun, low-stakes environment.

### Solution
Party Stacks creates a social, collaborative blockchain experience where:
- Users pool resources together for shared rewards
- Real-time on-chain synchronization creates excitement and anticipation
- WalletConnect integration makes participation seamless
- Classy UI/UX makes blockchain feel premium and accessible

### Target Audience
1. **Primary:** Blockchain developers and builders participating in hackathons
2. **Secondary:** Crypto enthusiasts interested in social DeFi experiments
3. **Tertiary:** Groups wanting to experiment with collaborative blockchain interactions

---

## Core Features

### 1. Wallet Integration (WalletConnect)
**Priority:** P0 (Critical for hackathon judging)

**Requirements:**
- Prominent WalletConnect logo display
- One-click wallet connection via @stacks/connect
- Persistent wallet session across page reloads
- Connected wallet address display
- Easy disconnect functionality

**Success Metrics:**
- Connection success rate > 95%
- Connection time < 3 seconds

### 2. Host a Party
**Priority:** P0

**Requirements:**
- Input field for total STX amount (min: 1 STX)
- Input field for max participants (min: 2, max: 100)
- Real-time calculation of reward per participant
- Form validation with helpful error messages
- Transaction confirmation via wallet
- Visual feedback during transaction processing

**User Flow:**
1. User connects wallet
2. User enters STX amount and participant count
3. User clicks "Host Party"
4. Wallet prompts for transaction approval
5. On success: Party appears in Active Parties list
6. Toast notification: "Party created! Share with friends! 🎉"

### 3. Active Parties Dashboard
**Priority:** P0

**Requirements:**
- Grid/list view of all active parties
- Each party displays:
  - Party ID
  - Total STX pool
  - Reward per participant
  - Current participants / Max participants
  - Animated progress bar showing fill status
  - Host address (shortened)
- Real-time updates via polling (every 10 seconds)
- Visual distinction between joinable vs full parties
- Responsive design for mobile/desktop

### 4. Join Party Interaction
**Priority:** P0

**Requirements:**
- "Join Party" button (visible only if party not full AND user not participant)
- Wallet transaction approval flow
- Toast notification on join: "You are in the splash zone! Waiting for X more builders..."
- Immediate UI update showing new participant count
- Disabled state if user already joined
- Loading state during transaction

**User Flow:**
1. User browses active parties
2. User clicks "Join Party" on desired party
3. Wallet prompts for transaction approval (STX transfer)
4. On success: Progress bar updates
5. Toast shows remaining participants needed
6. If party fills: All participants can now claim

### 5. Claim My Rain
**Priority:** P0

**Requirements:**
- "Claim My Rain" button (visible only if party full AND user is participant)
- Wallet transaction approval for claim
- Distribution of proportional STX share
- Toast notification: "You claimed X STX! 💰"
- Visual feedback during claim process
- Party marked as completed after all claims

**User Flow:**
1. Party reaches max participants
2. "Claim" button appears for all participants
3. User clicks "Claim My Rain"
4. Wallet prompts for transaction approval
5. STX distributed to user's wallet
6. Success confirmation toast

### 6. Real-time On-chain Synchronization
**Priority:** P0

**Requirements:**
- Poll contract state every 10 seconds using @stacks/blockchain-api-client
- Update participant counts in real-time
- Update party status (active/full/completed)
- Sync across all user sessions
- Handle API errors gracefully
- Show loading states during initial fetch

### 7. Premium "Classy Dark Mode" UI
**Priority:** P0 (Critical for standing out)

**Requirements:**
- Dark mode base with Stacks brand colors:
  - Primary: Deep blacks (#0a0a0f, #16161f)
  - Accents: Orange (#ff8c00) and Purple (#9b4dff)
- Glassmorphism effects on all cards
- Smooth micro-animations (hover, transitions)
- Gradient text for headings
- Premium typography (Inter, SF Mono)
- Animated progress bars with shimmer effect
- Toast notifications with slide-in animations
- Responsive design (mobile-first)

**Design Principles:**
- **Premium:** Make users say "wow" on first glance
- **Classy:** Sophisticated, not garish
- **Engaging:** Subtle animations that delight
- **Branded:** Embrace Stacks orange/purple identity

### 8. Transaction Toasts (The "Classy" Detail)
**Priority:** P0

**Toast Types:**
- **Success:** "✅ Party created! Share with friends!"
- **Splash (Join):** "💦 You are in the splash zone! Waiting for X more builders..."
- **Full:** "🎊 Party is full! You can now claim your rain!"
- **Claim:** "💰 You claimed X STX!"
- **Error:** "❌ [Error message]"

**Features:**
- Glassmorphism background
- Auto-dismiss after 5 seconds
- Slide-in from right animation
- Manual close button
- Multiple toast queueing

---

## Technical Architecture

### Frontend Stack
- **Framework:** Svelte 5 + TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS with custom theme
- **State Management:** Svelte stores

### Blockchain Integration
- **Chain:** Stacks Blockchain (Testnet → Mainnet)
- **Wallet:** @stacks/connect with WalletConnect
- **Contract Language:** Clarity
- **API Client:** @stacks/blockchain-api-client
- **Network Library:** @stacks/network
- **Transactions:** @stacks/transactions

### Smart Contract (Clarity)

**Contract Name:** `party-rain`

**Data Structures:**
```clarity
;; Party map
(define-map parties
  { party-id: uint }
  {
    host: principal,
    stx-amount: uint,
    max-participants: uint,
    current-participants: uint,
    is-active: bool,
    is-full: bool
  }
)

;; Participant map
(define-map participants
  { party-id: uint, participant: principal }
  { has-claimed: bool }
)
```

**Public Functions:**
- `create-party(stx-amount: uint, max-participants: uint)`
- `join-party(party-id: uint)`
- `claim-rain(party-id: uint)`

**Read-only Functions:**
- `get-party(party-id: uint)`
- `get-participant-count(party-id: uint)`
- `is-participant(party-id: uint, address: principal)`

### Real-time Sync Strategy
1. On app load: Fetch all active parties
2. Every 10 seconds: Poll contract for updates
3. On user action: Optimistic UI update + background verification
4. On blockchain event: Update local state

### File Structure
```
wallet-connect/
├── src/
│   ├── lib/
│   │   ├── wallet.ts          # Wallet connection utilities
│   │   ├── toastStore.ts      # Toast notification store
│   │   ├── partyStore.ts      # Party state management
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── blockchain-sync.ts # Polling & sync logic
│   ├── components/
│   │   ├── ConnectWallet.svelte
│   │   ├── HostParty.svelte
│   │   ├── PartyCard.svelte
│   │   ├── ActiveParties.svelte
│   │   └── Toast.svelte
│   ├── styles/
│   │   └── theme.css          # Global theme & utilities
│   ├── App.svelte             # Main app component
│   └── main.ts                # Entry point
├── contracts/
│   └── party-rain.clar        # Clarity smart contract
├── .env                       # Environment variables
└── package.json
```

---

## Hackathon Success Strategy

### Ranking #1 Checklist

#### ✅ GitHub Progress (Commit Frequency)
**Strategy:** Commit every 3-4 hours
- Initial setup commit
- Component implementation commits
- Smart contract commits
- Styling & polish commits
- Documentation commits
- Total target: 6-8 commits in 24 hours

#### ✅ Onchain Progress (Testnet Activity)
**Strategy:** Deploy contract ASAP
- Deploy contract to testnet today
- Create test parties on-chain
- Execute join transactions
- Execute claim transactions
- Invite 5+ friends to interact (5 on-chain signals)

#### ✅ WalletConnect Focus
**Strategy:** Prominent integration
- WalletConnect logo in header (always visible)
- Mention in README
- Screenshot showing WalletConnect modal
- Demo video highlighting the integration

#### ✅ The "Claim" Loop
**Strategy:** Generate on-chain activity
- Ask 5 friends to join a test party
- Each join = unique on-chain transaction
- Creates 5+ blockchain signals tied to project
- Demonstrates real usage

#### ✅ "Classy" UX Detail
**Strategy:** Stand out with polish
- Premium glassmorphism throughout
- Animated transaction toasts
- Smooth transitions on all interactions
- No generic UI components
- Professional typography and spacing

---

## Success Metrics

### Hackathon KPIs
- **Primary:** Achieve #1 ranking (win 600 $STX)
- GitHub commits: 6-8 in 24 hours
- Testnet deployment: Complete within 6 hours
- On-chain transactions: 10+ test interactions
- Demo video: Published with WalletConnect showcase

### Product KPIs
- Wallet connection success rate: > 95%
- Average party fill time: < 5 minutes (testnet)
- User satisfaction (if tested): NPS > 8
- Zero critical bugs during demo

### Technical KPIs
- Page load time: < 2 seconds
- Transaction confirmation time: < 30 seconds (testnet)
- Polling reliability: 99% uptime
- Mobile responsiveness: 100% feature parity

---

## Development Phases

### Phase 1: Foundation (Hours 1-4) ✅ IN PROGRESS
- [x] Project setup (Svelte + Vite + TypeScript)
- [x] Install Stacks dependencies
- [x] Create theme & design system
- [x] Build wallet integration
- [/] Create core components
- [ ] Smart contract skeleton

### Phase 2: Core Features (Hours 5-8)
- [ ] Complete HostParty functionality
- [ ] Complete ActiveParties list
- [ ] Complete PartyCard interactions
- [ ] Deploy contract to testnet
- [ ] Integrate real contract calls

### Phase 3: Real-time Sync (Hours 9-12)
- [ ] Implement blockchain polling
- [ ] Connect API client to contract
- [ ] Real-time updates in UI
- [ ] Error handling & retry logic

### Phase 4: Polish & Testing (Hours 13-18)
- [ ] End-to-end testing
- [ ] Mobile responsive refinements
- [ ] Animation polish
- [ ] Performance optimization
- [ ] Screenshot & video creation

### Phase 5: Deployment & Documentation (Hours 19-24)
- [ ] Deploy frontend to hosting
- [ ] Update README with demo link
- [ ] Create walkthrough video
- [ ] Final commits to GitHub
- [ ] Invite friends for test transactions

---

## Risk Management

### Technical Risks

**Risk:** Testnet reliability issues  
**Mitigation:** Build with mock data fallback; test early and often

**Risk:** WalletConnect integration bugs  
**Mitigation:** Use official @stacks/connect examples; test on multiple browsers

**Risk:** Smart contract vulnerabilities  
**Mitigation:** Keep contract logic simple; peer review before deployment

**Risk:** Real-time polling performance issues  
**Mitigation:** Optimize poll frequency; implement debouncing

### Hackathon Risks

**Risk:** Late submission  
**Mitigation:** Set internal deadline 2 hours before official deadline

**Risk:** Missing key features  
**Mitigation:** MVP-first approach; polish is secondary to functionality

**Risk:** Low on-chain activity  
**Mitigation:** Proactively recruit 5+ friends for testing early

---

## Future Enhancements (Post-Hackathon)

### V2 Features
- Party chat/comments
- NFT badges for party hosts
- Leaderboards (most parties hosted/joined)
- Scheduled parties (time-based starts)
- Private parties (invite-only)
- Multi-token support (not just STX)
- Party themes/customization

### Advanced Features
- Integration with Stacks NFT marketplaces
- Cross-chain party support
- DAO governance for platform fees
- Mobile app (iOS/Android)
- Social sharing (Twitter integration)

---

## Appendix

### Key Resources
- **Stacks Docs:** https://docs.stacks.co
- **@stacks/connect:** https://github.com/hirosystems/connect
- **Clarity Docs:** https://docs.stacks.co/clarity
- **WalletConnect:** https://walletconnect.com

### Competition Details
- **Hackathon Platform:** [Link from screenshot]
- **Deadline:** [To be determined]
- **Prize:** 600 $STX for #1 rank
- **Judging Criteria:** GitHub progress, Onchain progress, WalletConnect integration

### Contact & Team
- **Developer:** [Your name/handle]
- **Repository:** https://github.com/Goodnessmbakara/partystacks
- **Demo URL:** [To be deployed]

---

**Document Version:** 1.0  
**Last Updated:** December 24, 2025  
**Status:** In Active Development
