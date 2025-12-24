# UI Updates Required for Spray Party Mechanics

## Summary of Changes

The product vision has been updated from a "rain party" (wait until full, then claim) to a "spray party" (creators spray rewards over time, participants claim from dashboard).

## Components to Update

### 1. HostParty.svelte ✏️ HIGH PRIORITY

**Current:** Requires both STX amount and participant count  
**New Required:**
- Make "Max Participants" field **optional**
- Add checkbox/toggle: "Set participant limit" (optional)
- If unchecked: Create party with unlimited participants
- Update preview text: "Locked STX: X STX" instead of "per participant"
- Change button text: "Create Spray Party" instead of "Host Party"
- Add "Spray Now" button for host on their own parties
- Spray amount input (can be partial amount of locked STX)

**UI Flow:**
```
STX Amount: [100] STX ✓
□ Set participant limit
  └─ [Disabled input when unchecked]

Locked STX: 100 STX
Available to spray: 100 STX

[Create Spray Party]
```

### 2. PartyCard.svelte ✏️ HIGH PRIORITY

**Current:** Shows "Join" when not full, "Claim" when full  
**New Required:**
- Remove "per participant" calculation (host sprays variable amounts)
- Show "Locked STX" and "Sprayed STX" separately
- For participants: Show "Your unclaimed balance: X STX"
- "Join Party" button should be FREE (no STX cost mentioned)
- Remove progress bar IF max participants is not set
- If max IS set: Keep progress bar (e.g., "23/50 joined")
- If max NOT set: Show "∞ participants" or "Unlimited"
- Toast on join: "You're in the spray zone! Wait for the host to spray!"

**Host view (their own party):**
```
Party #1 (You're hosting)
Locked: 100 STX
Sprayed: 0 STX
Remaining: 100 STX
Participants: 5 (unlimited)

[Spray Now] button
```

**Participant view:**
```
Party #1
Locked: 100 STX
Sprayed: 45 STX
Your unclaimed: 3.5 STX
Participants: 12/50

[Claim 3.5 STX] button (if balance > 0)
[Join Party] button (if not participant)
```

### 3. NEW: MyParties.svelte (Dashboard) 🆕 HIGH PRIORITY

**Purpose:** Participants see all parties they've joined and unclaimed balances

**Features:**
- List of all joined parties
- For each party show:
  - Party ID
  - Host address
  - Unclaimed balance
  - Total claimed so far
  - Status (active/closed)
- "Claim" button for each party with balance > 0
- Filter: "Has unclaimed balance" / "All parties"

**UI Example:**
```
My Spray Parties

[V] Has unclaimed balance [ ] All parties

┌─ Party #42 ─────────────────────┐
│ Host: SP2J6Z...EJ7              │
│ Your unclaimed: 5.2 STX         │
│ Total claimed: 12.8 STX         │
│ Status: Active                  │
│ [Claim 5.2 STX]                 │
└──────────────────────────────────┘

┌─ Party #38 ─────────────────────┐
│ Host: SP3FBR...NJY              │
│ Your unclaimed: 0 STX           │
│ Total claimed: 20.0 STX         │
│ Status: Closed                  │
└──────────────────────────────────┘
```

### 4. NEW: SprayModal.svelte 🆕 MEDIUM PRIORITY

**Purpose:** Host sprays STX to participants

**Features:**
- Shows total locked, already sprayed, remaining
- Input for amount to spray
- Shows participants count
- Calculates amount per participant
- Preview: "Spray 50 STX to 10 participants = 5 STX each"
- Confirmation button

**UI:**
```
Spray to Party #42

Locked STX: 100 STX
Already sprayed: 0 STX
Remaining: 100 STX

Current participants: 10

Amount to spray: [50] STX

Each participant receives: 5 STX
Remaining after spray: 50 STX

[Spray Now]  [Cancel]
```

### 5. ActiveParties.svelte ✏️ LOW PRIORITY

**Current:** Just displays list  
**Updates:**
- Add tab/filter for "My Joined Parties" vs "Discover"
- Maybe add "Host Dashboard" view showing parties you created

### 6. Toast Messages ✏️ LOW PRIORITY

**Update toast messages:**
- ❌ OLD: "You are in the splash zone! Waiting for X more builders..."
- ✅ NEW: "You're in the spray zone! Wait for the host to spray! 💦"
- ADD: "Host sprayed! You received X STX! Check your dashboard."
- ADD: "You claimed X STX from Party #Y! 💰"

### 7. partyStore.ts ✏️ MEDIUM PRIORITY

** Update Party interface:**
```typescript
export interface Party {
  id: number;
  host: string;
  lockedStx: number;
  sprayedStx: number;
  maxParticipants: number | null;  // null = unlimited
  currentParticipants: number;
  participants: string[];
  isActive: boolean;
}

export interface ParticipantBalance {
  partyId: number;
  unclaimedBalance: number;
  totalClaimed: number;
  joinedAt: number;
}
```

## Priority Order

1. **HIGH:** Update PartyCard to show unclaimed balances
2. **HIGH:** Update HostParty for optional max participants  
3. **HIGH:** Create MyParties dashboard component
4. **MEDIUM:** Create SprayModal for hosts
5. **MEDIUM:** Update party store interfaces
6. **LOW:** Update toast messages
7. **LOW:** Add filtering to ActiveParties

## Technical Notes

- Joining should be **free** (no STX transfer from participant)
- Only host pays STX (locks it in contract)
- Contract functions to integrate:
  - `create-party(stx-amount: uint, max-participants: (optional uint))`
  - `join-party(party-id: uint)` - FREE
  - `spray-stx(party-id: uint, amount: uint)` - HOST ONLY
  - `claim-balance(party-id: uint)` - PARTICIPANT
  - `get-unclaimed-balance(party-id: uint, participant: principal)` - READ

## Mock Data Updates

Update mock parties to reflect new structure:
```typescript
{
  id: 1,
  host: 'SP2J6ZY48...',
  lockedStx: 100,
  sprayedStx: 45,  // Host already sprayed 45
  maxParticipants: null,  // Unlimited
  currentParticipants: 12,
  participants: [...],
  isActive: true
}
```

---

These changes transform Party Stacks from a "pool and distribute" model to a "creator rewards platform" model - much more powerful for content creators and community engagement!
