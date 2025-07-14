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
  mobyCreditsPackages,
} from '@/lib/constants';
import { getRecommendedMobyPackageForCore, getRecommendedMobyPackage } from '@/lib/utils';

const PricingCalculator = () => {
  const [planType, setPlanType] = useState('core-plus-moby'); // 'moby-only' or 'core-plus-moby'
  const [gmvTier, setGmvTier] = useState<GmvTierKey>('15M-20M');
  const [coreProduct, setCoreProduct] = useState<MonthToMonthPricing>('advanced');
  const [hasRetentionAddon, setHasRetentionAddon] = useState(false);
  const [hasConversionAddon, setHasConversionAddon] = useState(false);
  // Initialize with the correct recommended package to avoid flash
  const [selectedMobyPackage, setSelectedMobyPackage] = useState(() => {
    return getRecommendedMobyPackageForCore('15M-20M'); // Using the initial gmvTier value
  });

  // Update Moby package when GMV tier changes (for both plan types)
  useEffect(() => {
    if (planType === 'core-plus-moby') {
      setSelectedMobyPackage(getRecommendedMobyPackageForCore(gmvTier));
    } else if (planType === 'moby-only') {
      setSelectedMobyPackage(getRecommendedMobyPackage(gmvTier));
    }
  }, [gmvTier, planType]);

  // Calculate Moby monthly price
  const calculateMobyMonthly = () => {
    return mobyCreditsPackages[selectedMobyPackage].purchaseAmount;
  };

  // Calculate Moby yearly price for upfront payment
  const calculateMobyYearly = () => {
    return mobyCreditsPackages[selectedMobyPackage].yearlyPrice;
  };

  // Calculate month-to-month price
  const calculateMonthToMonth = () => {
    if (planType === 'moby-only') {
      return calculateMobyMonthly();
    }
    const basePrice = monthToMonthPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionMonthToMonthPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionMonthToMonthPricing[gmvTier] : 0;
    const mobyPrice = calculateMobyMonthly();
    return basePrice + retentionPrice + conversionPrice + mobyPrice;
  };

  // Calculate base monthly price (12-month contract)
  const calculateBaseMonthly = () => {
    if (planType === 'moby-only') {
      return calculateMobyMonthly();
    }
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    const mobyPrice = calculateMobyMonthly();
    return basePrice + retentionPrice + conversionPrice + mobyPrice;
  };

  // Calculate annual prepay (10 months worth of 12-month contract rate for core products, yearly price for Moby)
  const calculateAnnualPrepay = () => {
    if (planType === 'moby-only') {
      return calculateMobyYearly();
    }
    const basePrice = contractPricing[coreProduct][gmvTier];
    const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
    const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
    const coreTotal = (basePrice + retentionPrice + conversionPrice) * 10;
    const mobyTotal = calculateMobyYearly();
    return coreTotal + mobyTotal;
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
            {/* Plan Type Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Choose your Triple Whale Plan</h3>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="mobyOnly"
                  name="planType"
                  value="moby-only"
                  checked={planType === 'moby-only'}
                  onChange={(e) => {
                    setPlanType(e.target.value);
                    setSelectedMobyPackage(getRecommendedMobyPackage(gmvTier)); // Use recommendation based on GMV tier
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="mobyOnly" className="text-sm font-medium">
                  Moby Credits Only
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="corePlusMoby"
                  name="planType"
                  value="core-plus-moby"
                  checked={planType === 'core-plus-moby'}
                  onChange={(e) => {
                    setPlanType(e.target.value);
                    setSelectedMobyPackage(getRecommendedMobyPackageForCore(gmvTier)); // Set recommendation based on GMV tier
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="corePlusMoby" className="text-sm font-medium">
                  Core Plan + Moby Credits
                </label>
              </div>
            </div>

            {/* GMV Tier Selection - for both plan types */}
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

            {/* Core Product Selection - only for core plans */}
            {planType === 'core-plus-moby' && (
              <div className="space-y-2">
                <label className="block text-lg font-medium">Core Plan</label>
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
            )}

            {/* Add-on Options - only for core plans */}
            {planType === 'core-plus-moby' && (
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
              </div>
            )}

            {/* Moby Credits Package Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Moby Credits Package</h3>
              <select
                value={selectedMobyPackage}
                onChange={(e) => setSelectedMobyPackage(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md bg-white"
              >
                {mobyCreditsPackages.map((pkg, index) => (
                  <option key={index} value={index}>
                    {pkg.monthlyCredits === 0
                      ? '0 Moby credits - $0/mo'
                      : `${pkg.monthlyCredits.toLocaleString()} credits - $${pkg.purchaseAmount.toLocaleString()}/mo`}
                    {planType === 'moby-only' && index === getRecommendedMobyPackage(gmvTier)
                      ? ' (Recommended)'
                      : ''}
                  </option>
                ))}
              </select>

              {/* Free Credits Message - shown when $0 option is selected */}
              {selectedMobyPackage === 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    3,000 Moby Credits gives you roughly 30-60 chats with Moby, or 10-20 agent runs
                    across different functions — anomaly detection, performance analysis, creative
                    element analysis, goal pacing, forecasting, and more. <br />
                    <span className="text-xs italic">
                      *Note: Credits fluctuate based on data volume and run frequency. This estimate
                      does not include Deep Dive.
                    </span>
                  </p>
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
                {planType === 'core-plus-moby' && (
                  <div className="flex justify-between">
                    <span>Core Plan:</span>
                    <span>${contractPricing[coreProduct][gmvTier].toLocaleString()}/mo</span>
                  </div>
                )}
                {planType === 'core-plus-moby' && hasRetentionAddon && (
                  <div className="flex justify-between">
                    <span>Retention add-on:</span>
                    <span>${retentionContractPricing[gmvTier].toLocaleString()}/mo</span>
                  </div>
                )}
                {planType === 'core-plus-moby' && hasConversionAddon && (
                  <div className="flex justify-between">
                    <span>Conversion add-on:</span>
                    <span>${conversionContractPricing[gmvTier].toLocaleString()}/mo</span>
                  </div>
                )}
                {selectedMobyPackage > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Moby Credits (
                      {mobyCreditsPackages[selectedMobyPackage].monthlyCredits.toLocaleString()}):
                    </span>
                    <span>
                      ${mobyCreditsPackages[selectedMobyPackage].purchaseAmount.toLocaleString()}/mo
                    </span>
                  </div>
                )}
                {selectedMobyPackage === 0 && (
                  <div className="flex justify-between">
                    <span>Moby Credits (3,000 free):</span>
                    <span>$0/mo</span>
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
                {planType === 'core-plus-moby' && (
                  <div className="flex justify-between">
                    <span>Core Plan:</span>
                    <span>${(contractPricing[coreProduct][gmvTier] * 10).toLocaleString()}</span>
                  </div>
                )}
                {planType === 'core-plus-moby' && hasRetentionAddon && (
                  <div className="flex justify-between">
                    <span>Retention add-on:</span>
                    <span>${(retentionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                  </div>
                )}
                {planType === 'core-plus-moby' && hasConversionAddon && (
                  <div className="flex justify-between">
                    <span>Conversion add-on:</span>
                    <span>${(conversionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                  </div>
                )}
                {selectedMobyPackage > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Moby Credits (
                      {mobyCreditsPackages[selectedMobyPackage].yearlyCredits.toLocaleString()}):
                    </span>
                    <span>
                      ${mobyCreditsPackages[selectedMobyPackage].yearlyPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedMobyPackage === 0 && (
                  <div className="flex justify-between">
                    <span>Moby Credits (36,000 free):</span>
                    <span>$0</span>
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
