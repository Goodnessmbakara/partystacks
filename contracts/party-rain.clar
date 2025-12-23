;; Party Rain - Collaborative STX Pool Contract
;; Allows users to create parties, join them, and claim proportional rewards

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-joined (err u102))
(define-constant err-party-full (err u103))
(define-constant err-party-not-full (err u104))
(define-constant err-already-claimed (err u105))
(define-constant err-not-participant (err u106))
(define-constant err-invalid-amount (err u107))
(define-constant err-invalid-participants (err u108))

;; Data Variables
(define-data-var party-id-nonce uint u0)

;; Data Maps
(define-map parties
  { party-id: uint }
  {
    host: principal,
    stx-amount: uint,
    max-participants: uint,
    current-participants: uint,
    is-active: bool,
    is-full: bool,
    created-at: uint
  }
)

(define-map participants
  { party-id: uint, participant: principal }
  { 
    joined-at: uint,
    has-claimed: bool
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

(define-read-only (get-participant (party-id uint) (participant principal))
  (map-get? participants { party-id: party-id, participant: participant })
)

(define-read-only (is-participant (party-id uint) (participant principal))
  (is-some (map-get? participants { party-id: party-id, participant: participant }))
)

(define-read-only (get-reward-per-participant (party-id uint))
  (match (get-party party-id)
    party (ok (/ (get stx-amount party) (get max-participants party)))
    (err err-not-found)
  )
)

(define-read-only (get-next-party-id)
  (var-get party-id-nonce)
)

;; Public functions

(define-public (create-party (stx-amount uint) (max-participants uint))
  (let
    (
      (party-id (var-get party-id-nonce))
    )
    ;; Validate inputs
    (asserts! (> stx-amount u0) err-invalid-amount)
    (asserts! (>= max-participants u2) err-invalid-participants)
    
    ;; Transfer STX from host to contract
    (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
    
    ;; Create party
    (map-set parties
      { party-id: party-id }
      {
        host: tx-sender,
        stx-amount: stx-amount,
        max-participants: max-participants,
        current-participants: u1,
        is-active: true,
        is-full: false,
        created-at: block-height
      }
    )
    
    ;; Add host as first participant
    (map-set participants
      { party-id: party-id, participant: tx-sender }
      { joined-at: block-height, has-claimed: false }
    )
    
    (map-set participant-list
      { party-id: party-id, index: u0 }
      { participant: tx-sender }
    )
    
    ;; Increment nonce
    (var-set party-id-nonce (+ party-id u1))
    
    (ok party-id)
  )
)

(define-public (join-party (party-id uint))
  (let
    (
      (party (unwrap! (get-party party-id) err-not-found))
      (current-count (get current-participants party))
      (max-count (get max-participants party))
    )
    ;; Validate party state
    (asserts! (get is-active party) err-not-found)
    (asserts! (< current-count max-count) err-party-full)
    (asserts! (not (is-participant party-id tx-sender)) err-already-joined)
    
    ;; Calculate join amount (proportional share)
    (let
      (
        (join-amount (/ (get stx-amount party) max-count))
      )
      ;; Transfer STX from joiner to contract
      (try! (stx-transfer? join-amount tx-sender (as-contract tx-sender)))
      
      ;; Add participant
      (map-set participants
        { party-id: party-id, participant: tx-sender }
        { joined-at: block-height, has-claimed: false }
      )
      
      (map-set participant-list
        { party-id: party-id, index: current-count }
        { participant: tx-sender }
      )
      
      ;; Update party
      (let
        (
          (new-count (+ current-count u1))
          (is-now-full (>= new-count max-count))
        )
        (map-set parties
          { party-id: party-id }
          (merge party {
            current-participants: new-count,
            is-full: is-now-full
          })
        )
        
        (ok new-count)
      )
    )
  )
)

(define-public (claim-rain (party-id uint))
  (let
    (
      (party (unwrap! (get-party party-id) err-not-found))
      (participant-data (unwrap! (get-participant party-id tx-sender) err-not-participant))
    )
    ;; Validate claim conditions
    (asserts! (get is-full party) err-party-not-full)
    (asserts! (not (get has-claimed participant-data)) err-already-claimed)
    
    ;; Calculate reward
    (let
      (
        (reward (/ (get stx-amount party) (get max-participants party)))
      )
      ;; Transfer reward from contract to participant
      (try! (as-contract (stx-transfer? reward tx-sender (unwrap-panic (get participant tx-sender)))))
      
      ;; Mark as claimed
      (map-set participants
        { party-id: party-id, participant: tx-sender }
        (merge participant-data { has-claimed: true })
      )
      
      (ok reward)
    )
  )
)

;; Initialize
(begin
  (var-set party-id-nonce u0)
)
