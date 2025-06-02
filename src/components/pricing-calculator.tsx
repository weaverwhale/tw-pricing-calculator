import React, { useState, useEffect } from 'react';
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
  agentCreditsPackages,
} from '@/lib/constants';
import { getRecommendedAgentPackage } from '@/lib/utils';

const PricingCalculator = () => {
  const [gmvTier, setGmvTier] = useState<GmvTierKey>('15M-20M');
  const [coreProduct, setCoreProduct] = useState<MonthToMonthPricing>('advanced');
  const [hasRetentionAddon, setHasRetentionAddon] = useState(false);
  const [hasConversionAddon, setHasConversionAddon] = useState(false);
  const [hasAgentAddon, setHasAgentAddon] = useState(false);
  const [selectedAgentPackage, setSelectedAgentPackage] = useState(1); // Default to second package

  // Update agent package when GMV tier changes
  useEffect(() => {
    if (hasAgentAddon) {
      setSelectedAgentPackage(getRecommendedAgentPackage(gmvTier));
    }
  }, [gmvTier, hasAgentAddon]);

  // Calculate agent monthly price
  const calculateAgentMonthly = () => {
    return hasAgentAddon ? agentCreditsPackages[selectedAgentPackage].monthlyPrice : 0;
  };

  // Calculate agent yearly price for upfront payment
  const calculateAgentYearly = () => {
    return hasAgentAddon ? agentCreditsPackages[selectedAgentPackage].yearlyPrice : 0;
  };

  // Calculate month-to-month price
  const calculateMonthToMonth = () => {
    const basePrice = monthToMonthPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionMonthToMonthPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionMonthToMonthPricing[gmvTier] : 0;
    const agentPrice = calculateAgentMonthly();
    return basePrice + retentionPrice + conversionPrice + agentPrice;
  };

  // Calculate base monthly price (12-month contract)
  const calculateBaseMonthly = () => {
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    const agentPrice = calculateAgentMonthly();
    return basePrice + retentionPrice + conversionPrice + agentPrice;
  };

  // Calculate annual prepay (10 months worth of 12-month contract rate for core products, yearly price for agent)
  const calculateAnnualPrepay = () => {
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    const coreTotal = (basePrice + retentionPrice + conversionPrice) * 10;
    const agentTotal = calculateAgentYearly();
    return coreTotal + agentTotal;
  };

  // Calculate annual totals for each payment type
  const calculateAnnualTotals = () => {
    const contractAnnual = calculateBaseMonthly() * 12;
    const prepayTotal = calculateAnnualPrepay();

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
        <CardTitle className="text-2xl font-bold">Pricing Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* GMV Tier Selection */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">GMV Tier</label>
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
              <label className="block text-lg font-medium">Core</label>
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
              <h3 className="text-lg font-medium">Add-on Options:</h3>

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

              {/* Agent credits add-on */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agentAddon"
                  checked={hasAgentAddon}
                  onChange={(e) => {
                    setHasAgentAddon(e.target.checked);
                    if (e.target.checked) {
                      setSelectedAgentPackage(getRecommendedAgentPackage(gmvTier));
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="agentAddon" className="text-sm font-medium">
                  Agent Credits
                </label>
              </div>

              {/* Agent Credits Package Selection - only visible when agent add-on is checked */}
              {hasAgentAddon && (
                <div className="ml-6 mt-2 space-y-2">
                  <label className="block text-sm font-medium">Agent Credits Package</label>
                  <select
                    value={selectedAgentPackage}
                    onChange={(e) => setSelectedAgentPackage(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    {agentCreditsPackages.map((pkg, index) => (
                      <option key={index} value={index}>
                        {pkg.monthlyCredits.toLocaleString()} credits - ${pkg.monthlyPrice}/mo
                        {index === getRecommendedAgentPackage(gmvTier) ? ' (Recommended)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                {hasAgentAddon && (
                  <div className="flex justify-between">
                    <span>
                      Agent Credits (
                      {agentCreditsPackages[selectedAgentPackage].monthlyCredits.toLocaleString()}):
                    </span>
                    <span>
                      ${agentCreditsPackages[selectedAgentPackage].monthlyPrice.toLocaleString()}/mo
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Monthly Total:</span>
                  <span>${calculateBaseMonthly().toLocaleString()}/mo</span>
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
                {hasAgentAddon && (
                  <div className="flex justify-between">
                    <span>
                      Agent Credits (
                      {agentCreditsPackages[selectedAgentPackage].yearlyCredits.toLocaleString()}):
                    </span>
                    <span>
                      ${agentCreditsPackages[selectedAgentPackage].yearlyPrice.toLocaleString()}
                    </span>
                  </div>
                )}
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
