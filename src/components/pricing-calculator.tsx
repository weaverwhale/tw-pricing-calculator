import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  gmvTiers,
  type GmvTierKey,
  monthToMonthPricing,
  type MonthToMonthPricing,
  retentionMonthToMonthPricing,
  conversionMonthToMonthPricing,
  contractPricing,
  retentionContractPricing,
  conversionContractPricing,
  agentPackagePricing,
  type AgentPackagePricingKey,
  type AgentPackagePricing,
} from '@/lib/constants';

const PricingCalculator = () => {
  const [gmvTier, setGmvTier] = useState<GmvTierKey>('15M-20M');
  const [coreProduct, setCoreProduct] = useState<MonthToMonthPricing>('advanced');
  const [hasRetentionAddon, setHasRetentionAddon] = useState(false);
  const [hasConversionAddon, setHasConversionAddon] = useState(false);
  const [agentPackage, setAgentPackage] = useState<AgentPackagePricing>('0');

  // Calculate month-to-month price
  const calculateMonthToMonth = () => {
    const basePrice = monthToMonthPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionMonthToMonthPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionMonthToMonthPricing[gmvTier] : 0;
    return basePrice + retentionPrice + conversionPrice;
  };

  // Calculate base monthly price (12-month contract)
  const calculateBaseMonthly = () => {
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    return basePrice + retentionPrice + conversionPrice;
  };

  // Calculate agent monthly price
  const calculateAgentMonthly = () => {
    return agentPackagePricing[agentPackage];
  };

  // Calculate annual prepay (10 months worth of 12-month contract rate)
  const calculateAnnualPrepay = () => {
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    return (basePrice + retentionPrice + conversionPrice) * 10;
  };

  // Calculate annual totals for each payment type
  const calculateAnnualTotals = () => {
    const contractAnnual = (calculateBaseMonthly() + calculateAgentMonthly()) * 12;
    const prepayTotal = calculateAnnualPrepay() + calculateAgentMonthly() * 12;

    return {
      contractAnnual,
      prepayTotal,
    };
  };

  // Calculate savings
  const calculateSavings = () => {
    const annualTotals = calculateAnnualTotals();
    return {
      vsContract: annualTotals.contractAnnual - annualTotals.prepayTotal,
    };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">TW Pricing Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* GMV Tier Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">GMV Tier</label>
              <select
                value={gmvTier}
                onChange={(e) => setGmvTier(e.target.value as GmvTierKey)}
                className="w-full p-2 border rounded-md bg-white"
              >
                {gmvTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    ${tier}
                  </option>
                ))}
              </select>
            </div>

            {/* Core Product Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Core Product</label>
              <select
                value={coreProduct}
                onChange={(e) => setCoreProduct(e.target.value as MonthToMonthPricing)}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="starter">Starter</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Add-on Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Add-on Options:</h3>

              {/* Retention add-on */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="retentionAddon"
                  checked={hasRetentionAddon}
                  onChange={(e) => setHasRetentionAddon(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="retentionAddon" className="text-sm font-medium">
                  Retention add-on
                </label>
              </div>

              {/* Conversion add-on */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="conversionAddon"
                  checked={hasConversionAddon}
                  onChange={(e) => setHasConversionAddon(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="conversionAddon" className="text-sm font-medium">
                  Conversion add-on
                </label>
              </div>
            </div>

            {/* Agent Package Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Agent Package</label>
              <select
                value={agentPackage}
                onChange={(e) => setAgentPackage(e.target.value as AgentPackagePricingKey)}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="0">No Agents</option>
                <option value="5">5 Agents ($1,500/month)</option>
                <option value="10">10 Agents ($2,500/month)</option>
                <option value="20">20 Agents ($3,500/month)</option>
              </select>
            </div>
          </div>

          {/* Right Column - Pricing Display */}
          <div className="space-y-6">
            {/* Annual Contract (Paid Monthly) */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-medium mb-2">Annual Contract (Paid Monthly)</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Core:</span>
                  <span>${contractPricing[coreProduct][gmvTier].toLocaleString()}/mo</span>
                </div>
                {hasRetentionAddon && (
                  <div className="flex justify-between">
                    <span>Retention add-on:</span>
                    <span>${retentionContractPricing[gmvTier].toLocaleString()}/mo</span>
                  </div>
                )}
                {hasConversionAddon && (
                  <div className="flex justify-between">
                    <span>Conversion add-on:</span>
                    <span>${conversionContractPricing[gmvTier].toLocaleString()}/mo</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Agent Package:</span>
                  <span>${calculateAgentMonthly().toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Monthly Total:</span>
                  <span>
                    ${(calculateBaseMonthly() + calculateAgentMonthly()).toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm pt-1">
                  <span>Annual Total:</span>
                  <span>${calculateAnnualTotals().contractAnnual.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Annual Contract (Paid Upfront) */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-medium mb-2">Annual Contract (Paid Upfront)</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Core:</span>
                  <span>${(contractPricing[coreProduct][gmvTier] * 10).toLocaleString()}</span>
                </div>
                {hasRetentionAddon && (
                  <div className="flex justify-between">
                    <span>Retention add-on:</span>
                    <span>${(retentionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                  </div>
                )}
                {hasConversionAddon && (
                  <div className="flex justify-between">
                    <span>Conversion add-on:</span>
                    <span>${(conversionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Agent Package (Paid Monthly):</span>
                  <span>${(calculateAgentMonthly() * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Annual Total:</span>
                  <span>${calculateAnnualTotals().prepayTotal.toLocaleString()}</span>
                </div>
                <div className="space-y-1 mt-2 pt-2 border-t text-green-600 text-sm">
                  <div className="flex justify-between">
                    <span>Savings vs Monthly Payments:</span>
                    <span>${calculateSavings().vsContract.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
