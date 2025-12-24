# Party Stacks - Product Requirements Document

## Executive Summary

**Party Stacks** is a gamified "spray party" decentralized application (dApp) built on the Stacks blockchain that enables content creators, Twitter/X Space hosts, and community leaders to engage their audience through STX distributions. Hosts lock STX into a party pool and can spray (distribute) rewards to participants at any time. Participants can join open parties or parties with optional capacity limits, and claim their accumulated rewards from their dashboard whenever they choose.

**Target Hackathon:** Stacks blockchain hackathon with WalletConnect integration emphasis  
**Target Deployment:** Stacks Testnet (initial), Mainnet (post-hackathon)  
**Competition Goal:** Rank #1 to win 600 $STX reward

---

## Product Vision

### Problem Statement
Content creators, community leaders, and Twitter/X Space hosts lack engaging ways to reward their audience on-chain. Current tipping and reward mechanisms are one-to-one transactions that don't create communal excitement or gamification.

### Solution
Party Stacks creates a gamified reward distribution experience where:
- **Creators** lock STX to create "spray parties" for their audience
- **Participants** join parties and accumulate claimable rewards
- **Hosts** can spray rewards at any time (before or after max capacity)
- **Flexible capacity**: Optional max participants for controlled distribution
- **Dashboard claiming**: Participants see their balance and claim when ready
- Real-time on-chain synchronization creates excitement

### Target Audience
1. **Primary:** Content creators (writers, artists, educators on Stacks)
2. **Secondary:** Twitter/X Space hosts engaging live audiences
3. **Tertiary:** Community leaders running events and campaigns
4. **Hackathon bonus:** Blockchain developers demonstrating social DeFi

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

### 2. Host a Spray Party
**Priority:** P0

**Requirements:**
- Input field for total STX amount (min: 1 STX)
- Input field for max participants (OPTIONAL - can be left empty for unlimited)
- Display of locked STX amount in party
- "Start Spraying" button available immediately (don't wait for max)
- Form validation with helpful error messages
- Transaction confirmation via wallet
- Visual feedback during transaction processing

**User Flow:**
1. Creator/host connects wallet
2. Enters STX amount to lock (e.g., 100 STX)
3. Optionally sets max participants (e.g., 50 people) or leaves unlimited
4. Clicks "Create Spray Party"
5. Wallet prompts for STX lock transaction
6. Party appears in Active Parties list
7. Host can share party link/ID with audience
8. Host can start spraying STX to joined participants at any time
9. Toast notification: "Spray party created! Start inviting participants! 🎉"

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
- "Join Party" button (visible if party not full OR no max set, AND user not participant)
- Free to join (no STX cost to participants)
- Toast notification on join: "You're in the spray zone! Wait for the host to spray! 💦"
- Immediate UI update showing new participant count
- Disabled state if user already joined
- Disabled if max participants reached (when set)
- Loading state during transaction

**User Flow:**
1. User browses active parties (from link, dashboard, or discovery)
2. User clicks "Join Party"
3. Wallet prompts for transaction approval (joining signature, no STX cost)
4. On success: Participant count updates
5. Toast: "You're in the spray zone! Wait for the host to spray! 💦"
6. User sees party in "My Parties" dashboard
7. When host sprays: Balance updates automatically

### 5. Spray & Claim System
**Priority:** P0

**Host Spray Capability:**
- "Spray Now" button available to host at any time
- Can spray full amount or partial amounts
- Can spray before max participants reached
- Distribution splits among current participants
- Each spray updates participant balances

**Participant Dashboard & Claiming:**
- "My Parties" dashboard showing all joined parties
- Display of unclaimed balance per party
- "Claim" button available whenever balance > 0
- NO forced immediate claiming
- Participant can claim anytime (even days/weeks later)
- Multiple partial claims allowed as host sprays more
- Toast notification: "You claimed X STX! 💰"

**User Flow (Claiming):**
1. Participant opens dashboard
2. Sees unclaimed balance (e.g., "3.5 STX from Party #42")
3. Clicks "Claim" when ready
4. Wallet approves transaction
5. STX transferred to wallet
6. Balance updates (shows remaining if any)

**User Flow (Spraying):**
1. Host clicks "Spray Now" on their party
2. Selects distribution mode:
   - **Equal Sharing**: Everyone gets same amount
   - **Random (Party Mode)**: Variable amounts simulate real money spray
3. Enters amount to spray (e.g., 50 STX of 100 locked)
4. Confirms transaction
5. Amount distributed based on selected mode:
   - Equal: 50 STX ÷ 10 participants = 5 STX each
   - Random: Weighted distribution (e.g., 2 STX, 8 STX, 3 STX, 9 STX, etc.)
6. Participant balances update automatically
7. Remaining locked STX can be sprayed later

**Random Distribution Algorithm:**
- Uses deterministic on-chain randomness (block hash seeded)
- Guarantees: Every participant gets SOMETHING (minimum 10% of equal share)
- Maximum: No participant gets more than 3x the equal share
- Total always equals spray amount (no rounding errors)
- Creates excitement: "Who caught the most?"
- Fair enough that nobody feels cheated
- Example for 100 STX to 10 people:
  - Equal would be: 10 STX each
  - Random might be: 4, 15, 8, 12, 6, 18, 9, 11, 7, 10 STX
  - Min guaranteed: 1 STX (10% of 10)
  - Max possible: 30 STX (3x of 10)

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
