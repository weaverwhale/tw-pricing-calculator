import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GmvTierKey } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map GMV tier keys to their corresponding agent package index
const GMV_TIER_TO_AGENT_PACKAGE: Record<GmvTierKey, number> = {
  '<250K': 0, // $0–$250k
  '250K-500K': 1, // $250k–$500k
  '500K-1M': 2, // $500k–$1M
  '1M-2.5M': 3, // $1M–$5M
  '2.5M-5M': 3, // $1M–$5M
  '5M-7.5M': 4, // $5M–$20M
  '7.5M-10M': 4, // $5M–$20M
  '10M-15M': 4, // $5M–$20M
  '15M-20M': 4, // $5M–$20M
  '20M-30M': 5, // $20M–$50M
  '30M-40M': 5, // $20M–$50M
  '40M-50M': 5, // $20M–$50M
  '50M-60M': 6, // $50M–$75M
  '60M-75M': 6, // $50M–$75M
  '75M-100M': 7, // $75M–$100M
  '100M-125M': 8, // $100M–$200M
  '125M-150M': 8, // $100M–$200M
  '150M-175M': 8, // $100M–$200M
  '175M-200M': 8, // $100M–$200M
  '200M-250M': 9, // $200M–$300M
  '250M-300M': 9, // $200M–$300M
  '300M-350M': 10, // $300M–$400M
};

// Map GMV tier to recommended agent package
export const getRecommendedAgentPackage = (tier: GmvTierKey): number => {
  return GMV_TIER_TO_AGENT_PACKAGE[tier] ?? 12; // Default to $500M+ package (index 12)
};
