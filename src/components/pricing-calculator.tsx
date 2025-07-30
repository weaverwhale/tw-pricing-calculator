import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  gmvTiers,
  type GmvTierKey,
  type MonthToMonthPricing,
  contractPricing,
  retentionContractPricing,
  conversionContractPricing,
  mobyCreditsPackages,
} from '@/lib/constants';
import { getRecommendedMobyPackageForCore, getRecommendedMobyPackage } from '@/lib/utils';

const PricingCalculator = () => {
  const [hasCoreProduct, setHasCoreProduct] = useState(true);
  const [hasMobyCredits, setHasMobyCredits] = useState(true);
  const [gmvTier, setGmvTier] = useState<GmvTierKey>('15M-20M');
  const [coreProduct, setCoreProduct] = useState<MonthToMonthPricing>('advanced');
  const [hasRetentionAddon, setHasRetentionAddon] = useState(false);
  const [hasConversionAddon, setHasConversionAddon] = useState(false);
  const [selectedMobyPackage, setSelectedMobyPackage] = useState(0);

  // Update Moby package when GMV tier changes
  useEffect(() => {
    if (hasCoreProduct && hasMobyCredits) {
      setSelectedMobyPackage(getRecommendedMobyPackageForCore(gmvTier));
    } else if (!hasCoreProduct && hasMobyCredits) {
      setSelectedMobyPackage(getRecommendedMobyPackage(gmvTier));
    } else if (hasCoreProduct && !hasMobyCredits) {
      setSelectedMobyPackage(0); // Free credits only
    }
  }, [gmvTier, hasCoreProduct, hasMobyCredits]);

  // Calculate Moby monthly price
  const calculateMobyMonthly = () => {
    return mobyCreditsPackages[selectedMobyPackage].purchaseAmount;
  };

  // Calculate Moby yearly price for upfront payment
  const calculateMobyYearly = () => {
    return mobyCreditsPackages[selectedMobyPackage].yearlyPrice;
  };

  // Calculate base monthly price (12-month contract)
  const calculateBaseMonthly = () => {
    let total = 0;

    if (hasCoreProduct) {
      const basePrice = contractPricing[coreProduct][gmvTier];
      const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
      const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
      total += basePrice + retentionPrice + conversionPrice;
    }

    if (hasMobyCredits && selectedMobyPackage > 0) {
      total += calculateMobyMonthly();
    }

    return total;
  };

  // Calculate annual prepay (10 months worth of 12-month contract rate for core products, yearly price for Moby)
  const calculateAnnualPrepay = () => {
    let total = 0;

    if (hasCoreProduct) {
      const basePrice = contractPricing[coreProduct][gmvTier];
      const retentionPrice = hasRetentionAddon ? retentionContractPricing[gmvTier] : 0;
      const conversionPrice = hasConversionAddon ? conversionContractPricing[gmvTier] : 0;
      total += (basePrice + retentionPrice + conversionPrice) * 10;
    }

    if (hasMobyCredits && selectedMobyPackage > 0) {
      total += calculateMobyYearly();
    }

    return total;
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
              <h3 className="text-lg font-medium">Choose your Triple Whale plan(s)</h3>
              <p className="text-sm text-gray-600">
                You can select Core plan, Moby Credits, or both.
              </p>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="coreProduct"
                  checked={hasCoreProduct}
                  onChange={(e) => setHasCoreProduct(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="coreProduct" className="text-sm font-medium">
                  Core Plan
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mobyCredits"
                  checked={hasMobyCredits}
                  onChange={(e) => setHasMobyCredits(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="mobyCredits" className="text-sm font-medium">
                  Moby Credits
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
            {hasCoreProduct && (
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
            {hasCoreProduct && (
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

            {/* Moby Credits Package Selection - only when Moby Credits is selected */}
            {hasMobyCredits && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Moby Credits Package</h3>
                <select
                  value={selectedMobyPackage}
                  onChange={(e) => setSelectedMobyPackage(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  {mobyCreditsPackages.map((pkg, index) => (
                    <option key={index} value={index}>
                      {pkg.purchaseAmount === 0
                        ? '3,000 Moby credits - $0/mo'
                        : `${pkg.monthlyCredits.toLocaleString()} credits - $${pkg.purchaseAmount.toLocaleString()}/mo`}
                    </option>
                  ))}
                </select>

                {/* Free Credits Message - shown when $0 option is selected */}
                {selectedMobyPackage === 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      3,000 Moby Credits gives you roughly 30-60 chats with Moby, or 10-20 agent
                      runs across different functions — anomaly detection, performance analysis,
                      creative element analysis, goal pacing, forecasting, and more. <br />
                      <span className="text-xs italic">
                        *Note: Credits fluctuate based on data volume and run frequency. This
                        estimate does not include Deep Dive.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Free Credits Note - shown when only Core Plan is selected */}
            {hasCoreProduct && !hasMobyCredits && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 font-medium">
                  Included: 3,000 free Moby Credits per month
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This gives you roughly 30-60 chats with Moby, or 10-20 agent runs across different
                  functions.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Pricing Display */}
          <div className="space-y-6">
            {/* Show pricing only if at least one option is selected */}
            {hasCoreProduct || hasMobyCredits ? (
              <>
                {/* Annual Contract (Paid Monthly) */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-medium mb-2">Annual Contract (Paid Monthly)</div>
                  <div className="space-y-1">
                    {hasCoreProduct && (
                      <div className="flex justify-between">
                        <span>Core Plan:</span>
                        <span>${contractPricing[coreProduct][gmvTier].toLocaleString()}/mo</span>
                      </div>
                    )}
                    {hasCoreProduct && hasRetentionAddon && (
                      <div className="flex justify-between">
                        <span>Retention add-on:</span>
                        <span>${retentionContractPricing[gmvTier].toLocaleString()}/mo</span>
                      </div>
                    )}
                    {hasCoreProduct && hasConversionAddon && (
                      <div className="flex justify-between">
                        <span>Conversion add-on:</span>
                        <span>${conversionContractPricing[gmvTier].toLocaleString()}/mo</span>
                      </div>
                    )}
                    {hasMobyCredits && selectedMobyPackage > 0 && (
                      <div className="flex justify-between">
                        <span>
                          Moby Credits (
                          {mobyCreditsPackages[selectedMobyPackage].monthlyCredits.toLocaleString()}
                          ):
                        </span>
                        <span>
                          $
                          {mobyCreditsPackages[selectedMobyPackage].purchaseAmount.toLocaleString()}
                          /mo
                        </span>
                      </div>
                    )}
                    {hasMobyCredits && selectedMobyPackage === 0 && (
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
                    {hasCoreProduct && (
                      <div className="flex justify-between">
                        <span>Core Plan:</span>
                        <span>
                          ${(contractPricing[coreProduct][gmvTier] * 10).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {hasCoreProduct && hasRetentionAddon && (
                      <div className="flex justify-between">
                        <span>Retention add-on:</span>
                        <span>${(retentionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                      </div>
                    )}
                    {hasCoreProduct && hasConversionAddon && (
                      <div className="flex justify-between">
                        <span>Conversion add-on:</span>
                        <span>${(conversionContractPricing[gmvTier] * 10).toLocaleString()}</span>
                      </div>
                    )}
                    {hasMobyCredits && selectedMobyPackage > 0 && (
                      <div className="flex justify-between">
                        <span>
                          Moby Credits (
                          {mobyCreditsPackages[selectedMobyPackage].yearlyCredits.toLocaleString()}
                          ):
                        </span>
                        <span>
                          ${mobyCreditsPackages[selectedMobyPackage].yearlyPrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {hasMobyCredits && selectedMobyPackage === 0 && (
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
              </>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">Please select at least one option to see pricing.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
