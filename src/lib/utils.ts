import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type GmvTierKey } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapping function for GMV tier to recommended agent package
export const getRecommendedAgentPackage = (tier: GmvTierKey): number => {
  if (
    tier === '<250K' ||
    tier === '250K-500K' ||
    tier === '500K-1M' ||
    tier === '1M-2.5M' ||
    tier === '2.5M-5M'
  ) {
    return 0; // $0 - $5M
  } else if (
    tier === '5M-7.5M' ||
    tier === '7.5M-10M' ||
    tier === '10M-15M' ||
    tier === '15M-20M'
  ) {
    return 1; // $5M - $20M
  } else if (tier === '20M-30M' || tier === '30M-40M' || tier === '40M-50M') {
    return 2; // $20M - $50M
  } else if (tier === '50M-60M' || tier === '60M-75M' || tier === '75M-100M') {
    return 3; // $50M - $100M
  } else if (
    tier === '100M-125M' ||
    tier === '125M-150M' ||
    tier === '150M-175M' ||
    tier === '175M-200M'
  ) {
    return 4; // $100M - $200M
  } else {
    return 5; // $200M+
  }
};
