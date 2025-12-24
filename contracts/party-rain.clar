;; Party Stacks - Spray Party Contract
;; Enables creators to lock STX and spray rewards to participants over time

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-joined (err u102))
(define-constant err-party-full (err u103))
(define-constant err-insufficient-locked (err u104))
(define-constant err-not-host (err u105))
(define-constant err-no-balance (err u106))
(define-constant err-invalid-amount (err u107))
(define-constant err-invalid-participants (err u108))

;; Data Variables
(define-data-var party-id-nonce uint u0)

;; Data Maps
(define-map parties
  { party-id: uint }
  {
    host: principal,
    locked-stx: uint,
    sprayed-stx: uint,
    max-participants: (optional uint),  ;; Optional - can be none for unlimited
    current-participants: uint,
    is-active: bool,
    created-at: uint
  }
)

(define-map participant-balances
  { party-id: uint, participant: principal }
  { 
    unclaimed-balance: uint,
    total-claimed: uint,
    joined-at: uint
  }
)

(define-map participant-list
  { party-id: uint, index: uint }
  { participant: principal }
)

;; Read-only functions

(define-read-only (get-party (party-id uint))
  (map-get? parties { party-id: party-id })
)

(define-read-only (get-participant-balance (party-id uint) (participant principal))
  (map-get? participant-balances { party-id: party-id, participant: participant })
)

(define-read-only (is-participant (party-id uint) (participant principal))
  (is-some (map-get? participant-balances { party-id: party-id, participant: participant }))
)

(define-read-only (get-unclaimed-balance (party-id uint) (participant principal))
  (match (get-participant-balance party-id participant)
    balance (ok (get unclaimed-balance balance))
    (err err-not-found)
  )
)

(define-read-only (get-remaining-locked-stx (party-id uint))
  (match (get-party party-id)
    party (ok (- (get locked-stx party) (get sprayed-stx party)))
    (err err-not-found)
  )
)

(define-read-only (get-next-party-id)
  (var-get party-id-nonce)
)

(define-read-only (is-party-full (party-id uint))
  (match (get-party party-id)
    party (match (get max-participants party)
      max-count (ok (>= (get current-participants party) max-count))
      (ok false)  ;; No max set, never full
    )
    (err err-not-found)
  )
)

;; Public functions

;; Create spray party with optional max participants
(define-public (create-party (stx-amount uint) (max-participants-opt (optional uint)))
  (let
    (
      (party-id (var-get party-id-nonce))
    )
    ;; Validate inputs
    (asserts! (> stx-amount u0) err-invalid-amount)
    
    ;; If max-participants is set, ensure it's >= 1
    (match max-participants-opt
      max-count (asserts! (>= max-count u1) err-invalid-participants)
      true
    )
    
    ;; Lock STX from host to contract
    (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
    
    ;; Create party
    (map-set parties
      { party-id: party-id }
      {
        host: tx-sender,
        locked-stx: stx-amount,
        sprayed-stx: u0,
        max-participants: max-participants-opt,
        current-participants: u0,
        is-active: true,
        created-at: block-height
      }
    )
    
    ;; Increment nonce
    (var-set party-id-nonce (+ party-id u1))
    
    (ok party-id)
  )
)

;; Join party (free, no STX cost to participants)
(define-public (join-party (party-id uint))
  (let
    (
      (party (unwrap! (get-party party-id) err-not-found))
      (current-count (get current-participants party))
    )
    ;; Validate party state
    (asserts! (get is-active party) err-not-found)
    (asserts! (not (is-participant party-id tx-sender)) err-already-joined)
    
    ;; Check if party is full (only if max is set)
    (match (get max-participants party)
      max-count (asserts! (< current-count max-count) err-party-full)
      true  ;; No max, always allow joining
    )
    
    ;; Add participant with zero balance initially
    (map-set participant-balances
      { party-id: party-id, participant: tx-sender }
      { 
        unclaimed-balance: u0,
        total-claimed: u0,
        joined-at: block-height
      }
    )
    
    (map-set participant-list
      { party-id: party-id, index: current-count }
      { participant: tx-sender }
    )
    
    ;; Update party participant count
    (map-set parties
      { party-id: party-id }
      (merge party { current-participants: (+ current-count u1) })
    )
    
    (ok (+ current-count u1))
  )
)

;; Host sprays STX to current participants
(define-public (spray-stx (party-id uint) (amount uint))
  (let
    (
      (party (unwrap! (get-party party-id) err-not-found))
      (remaining-locked (- (get locked-stx party) (get sprayed-stx party)))
      (participant-count (get current-participants party))
    )
    ;; Validate
    (asserts! (is-eq tx-sender (get host party)) err-not-host)
    (asserts! (> participant-count u0) err-invalid-participants)
    (asserts! (<= amount remaining-locked) err-insufficient-locked)
    (asserts! (> amount u0) err-invalid-amount)
    
    ;; Calculate amount per participant
    (let
      (
        (amount-per-participant (/ amount participant-count))
      )
      ;; Update all participant balances
      (try! (distribute-to-participants party-id participant-count amount-per-participant))
      
      ;; Update party sprayed amount
      (map-set parties
        { party-id: party-id }
        (merge party { 
          sprayed-stx: (+ (get sprayed-stx party) (* amount-per-participant participant-count))
        })
      )
      
      (ok amount-per-participant)
    )
  )
)

;; Helper function to distribute to all participants
(define-private (distribute-to-participants (party-id uint) (count uint) (amount uint))
  (begin
    (try! (update-participant-balance-at-index party-id u0 amount count))
    (ok true)
  )
)

;; Recursive function to update participant balances
(define-private (update-participant-balance-at-index 
  (party-id uint) 
  (index uint) 
  (amount uint)
  (max-index uint)
)
  (if (< index max-index)
    (match (map-get? participant-list { party-id: party-id, index: index })
      entry 
        (let
          (
            (participant (get participant entry))
          )
          (match (get-participant-balance party-id participant)
            balance
              (begin
                (map-set participant-balances
                  { party-id: party-id, participant: participant }
                  (merge balance { 
                    unclaimed-balance: (+ (get unclaimed-balance balance) amount)
                  })
                )
                (update-participant-balance-at-index party-id (+ index u1) amount max-index)
              )
            (err err-not-found)
          )
        )
      (err err-not-found)
    )
    (ok true)
  )
)

;; Participant claims their unclaimed balance
(define-public (claim-balance (party-id uint))
  (let
    (
      (balance-data (unwrap! (get-participant-balance party-id tx-sender) err-not-found))
      (unclaimed (get unclaimed-balance balance-data))
    )
    ;; Validate
    (asserts! (> unclaimed u0) err-no-balance)
    
    ;; Transfer STX from contract to participant
    (try! (as-contract (stx-transfer? unclaimed tx-sender tx-sender)))
    
    ;; Update participant balance
    (map-set participant-balances
      { party-id: party-id, participant: tx-sender }
      (merge balance-data { 
        unclaimed-balance: u0,
        total-claimed: (+ (get total-claimed balance-data) unclaimed)
      })
    )
    
    (ok unclaimed)
  )
)

;; Host can close party and reclaim remaining locked STX
(define-public (close-party (party-id uint))
  (let
    (
      (party (unwrap! (get-party party-id) err-not-found))
      (remaining (- (get locked-stx party) (get sprayed-stx party)))
    )
    ;; Validate
    (asserts! (is-eq tx-sender (get host party)) err-not-host)
    (asserts! (get is-active party) err-not-found)
    
    ;; Return remaining STX to host
    (if (> remaining u0)
      (try! (as-contract (stx-transfer? remaining tx-sender (get host party))))
      true
    )
    
    ;; Mark party as inactive
    (map-set parties
      { party-id: party-id }
      (merge party { is-active: false })
    )
    
    (ok remaining)
  )
)

;; Initialize
(begin
  (var-set party-id-nonce u0)
)
