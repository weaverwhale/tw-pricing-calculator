import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GmvTierKey } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map GMV tier to recommended Moby package (for core plans with Moby credits)
export const getRecommendedMobyPackageForCore = (tier: GmvTierKey): number => {
  if (tier === '<250K') return 1; // $75/month
  else if (tier === '250K-500K') return 2; // $125/month
  else if (tier === '500K-1M') return 3; // $250/month
  else if (tier === '1M-2.5M' || tier === '2.5M-5M') return 4; // $500/month
  else if (tier === '5M-7.5M' || tier === '7.5M-10M' || tier === '10M-15M' || tier === '15M-20M')
    return 5; // $1000/month
  else if (tier === '20M-30M' || tier === '30M-40M' || tier === '40M-50M') return 6; // $1500/month
  else if (tier === '50M-60M' || tier === '60M-75M') return 7; // $2000/month
  else if (tier === '75M-100M') return 8; // $2500/month
  else if (
    tier === '100M-125M' ||
    tier === '125M-150M' ||
    tier === '150M-175M' ||
    tier === '175M-200M'
  )
    return 9; // $3000/month
  else if (tier === '200M-250M' || tier === '250M-300M') return 10; // $5000/month
  else if (tier === '300M-350M') return 11; // $7500/month
  else return 13; // $25000/month for anything above
};

// Map GMV tier to recommended Moby package (for Moby-only plans)
export const getRecommendedMobyPackage = (tier: GmvTierKey): number => {
  if (tier === '<250K') return 1; // $75/month
  else if (tier === '250K-500K') return 2; // $125/month
  else if (tier === '500K-1M') return 3; // $250/month
  else if (tier === '1M-2.5M' || tier === '2.5M-5M') return 4; // $500/month
  else if (tier === '5M-7.5M' || tier === '7.5M-10M' || tier === '10M-15M' || tier === '15M-20M')
    return 5; // $1000/month
  else if (tier === '20M-30M' || tier === '30M-40M' || tier === '40M-50M') return 6; // $1500/month
  else if (tier === '50M-60M' || tier === '60M-75M') return 7; // $2000/month
  else if (tier === '75M-100M') return 8; // $2500/month
  else if (
    tier === '100M-125M' ||
    tier === '125M-150M' ||
    tier === '150M-175M' ||
    tier === '175M-200M'
  )
    return 9; // $3000/month
  else if (tier === '200M-250M' || tier === '250M-300M') return 10; // $5000/month
  else if (tier === '300M-350M') return 11; // $7500/month
  else return 13; // $25000/month for anything above
};
