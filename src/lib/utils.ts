import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GmvTierKey } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map GMV tier to recommended agent package
export const getRecommendedAgentPackage = (tier: GmvTierKey): number => {
  if (tier === '<250K') return 0; // $0–$250k
  else if (tier === '250K-500K') return 1; // $250k–$500k
  else if (tier === '500K-1M') return 2; // $500k–$1M
  else if (tier === '1M-2.5M' || tier === '2.5M-5M') return 3; // $1M–$5M
  else if (tier === '5M-7.5M' || tier === '7.5M-10M' || tier === '10M-15M' || tier === '15M-20M')
    return 4; // $5M–$20M
  else if (tier === '20M-30M' || tier === '30M-40M' || tier === '40M-50M') return 5; // $20M–$50M
  else if (tier === '50M-60M' || tier === '60M-75M') return 6; // $50M–$75M
  else if (tier === '75M-100M') return 7; // $75M–$100M
  else if (
    tier === '100M-125M' ||
    tier === '125M-150M' ||
    tier === '150M-175M' ||
    tier === '175M-200M'
  )
    return 8; // $100M–$200M
  else if (tier === '200M-250M' || tier === '250M-300M') return 9; // $200M–$300M
  else if (tier === '300M-350M') return 10; // $300M–$400M
  else return 12; // $500M+ for anything above
};
