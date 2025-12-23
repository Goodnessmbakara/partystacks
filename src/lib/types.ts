export interface Party {
  id: number;
  host: string;
  stxAmount: number;
  maxParticipants: number;
  currentParticipants: number;
  participants: string[];
  isActive: boolean;
  isFull: boolean;
}

export interface PartyFormData {
  stxAmount: number;
  maxParticipants: number;
}
