import { writable } from 'svelte/store';
import type { Party } from './types';

// Mock data for development - will be replaced with real blockchain data
export const parties = writable<Party[]>([
  {
    id: 1,
    host: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    stxAmount: 100,
    maxParticipants: 10,
    currentParticipants: 7,
    participants: [
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      'SP3FGQ8Z7JY9EMJXVYF47K8K5D578K5K5K5K5K5K5',
      'SP1HJQKZ3N6V9T5Y3D4N0E3X9M8Z7Y6X5W4V3U2T1',
      'SP2ABCDEF1234567890ABCDEF1234567890ABCDE',
      'SP3QRSTUVWXYZ123456789QRSTUVWXYZ123456',
      'SP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'SP9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA'
    ],
    isActive: true,
    isFull: false,
  },
  {
    id: 2,
    host: 'SP3FBR2AGK5H9QBDH3EBC4V68H2D3AP6TCGQ64NJY',
    stxAmount: 50,
    maxParticipants: 5,
    currentParticipants: 5,
    participants: [
      'SP3FBR2AGK5H9QBDH3EBC4V68H2D3AP6TCGQ64NJY',
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      'SP3FGQ8Z7JY9EMJXVYF47K8K5D578K5K5K5K5K5K5',
      'SP1HJQKZ3N6V9T5Y3D4N0E3X9M8Z7Y6X5W4V3U2T1',
      'SP2ABCDEF1234567890ABCDEF1234567890ABCDE'
    ],
    isActive: true,
    isFull: true,
  },
  {
    id: 3,
    host: 'SP1HJQKZ3N6V9T5Y3D4N0E3X9M8Z7Y6X5W4V3U2T1',
    stxAmount: 200,
    maxParticipants: 20,
    currentParticipants: 3,
    participants: [
      'SP1HJQKZ3N6V9T5Y3D4N0E3X9M8Z7Y6X5W4V3U2T1',
      'SP3FBR2AGK5H9QBDH3EBC4V68H2D3AP6TCGQ64NJY',
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
    ],
    isActive: true,
    isFull: false,
  },
]);

export const myParties = writable<Party[]>([]);
