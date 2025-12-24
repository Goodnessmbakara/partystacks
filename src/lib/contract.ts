import { openContractCall } from '@stacks/connect';
import {
  uintCV,
  someCV,
  noneCV
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'party-rain';
const NETWORK_TYPE = import.meta.env.VITE_STACKS_NETWORK || 'testnet';

const network = NETWORK_TYPE === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

// Create a new spray party
export async function createParty(
  stxAmount: number,
  maxParticipants: number | null,
  userAddress: string
): Promise<void> {
  const amountInMicroSTX = Math.floor(stxAmount * 1000000);
  
  const functionArgs = [
    uintCV(amountInMicroSTX),
    maxParticipants !== null ? someCV(uintCV(maxParticipants)) : noneCV()
  ];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-party',
    functionArgs,
    onFinish: (data) => {
      console.log('Party created:', data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
}

// Join an existing party
export async function joinParty(partyId: number): Promise<void> {
  const functionArgs = [uintCV(partyId)];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'join-party',
    functionArgs,
    onFinish: (data) => {
      console.log('Joined party:', data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
}

// Spray STX to participants
export async function spraySTX(
  partyId: number,
  amount: number,
  useRandom: boolean
): Promise<void> {
  const amountInMicroSTX = Math.floor(amount * 1000000);
  const distributionMode = useRandom ? 1 : 0; // MODE_RANDOM = 1, MODE_EQUAL = 0
  
  const functionArgs = [
    uintCV(partyId),
    uintCV(amountInMicroSTX),
    uintCV(distributionMode)
  ];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'spray-stx',
    functionArgs,
    onFinish: (data) => {
      console.log('STX sprayed:', data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
}

// Claim unclaimed balance
export async function claimBalance(partyId: number, userAddress: string): Promise<void> {
  const functionArgs = [uintCV(partyId)];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'claim-balance',
    functionArgs,
    onFinish: (data) => {
      console.log('Balance claimed:', data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
}

// Close a party (host only)
export async function closeParty(partyId: number): Promise<void> {
  const functionArgs = [uintCV(partyId)];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'close-party',
    functionArgs,
    onFinish: (data) => {
      console.log('Party closed:', data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
    },
  });
}

// Read-only: Get party details
export async function getParty(partyId: number): Promise<any> {
  // TODO: Implement using callReadOnlyFunction
  return null;
}

// Read-only: Get unclaimed balance
export async function getUnclaimedBalance(partyId: number, userAddress: string): Promise<number> {
  // TODO: Implement using callReadOnlyFunction
  return 0;
}

// Read-only: Check if user is participant
export async function isParticipant(partyId: number, userAddress: string): Promise<boolean> {
  // TODO: Implement using callReadOnlyFunction
  return false;
}
