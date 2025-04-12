// pages/index.js
/* eslint-disable */

'use client';
import { useState } from 'react';
import Head from 'next/head';
import { DefaultService } from '@/src/api/services/DefaultService'
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    riskTolerance: 'moderate',
    investmentAmount: '',
    investmentCurrency: 'USD',
    investmentHorizon: 'medium',
    experienceLevel: 'beginner',
    investmentGoals: [],
    hasExistingPortfolio: false,
    existingPortfolio: [],
    incomeSource: 'none',
    incomeAmount: '',
    jurisdiction: '',
    preferredActivities: []
  });

  const [portfolioInputs, setPortfolioInputs] = useState([
    { asset: '', amount: '' }
  ]);


 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'hasExistingPortfolio') {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle array-based checkboxes (goals, activities)
        const arrayName = name.split('-')[0];
        const item = name.split('-')[1];
        
        setFormData(prevData => {
          const currentArray = [...prevData[arrayName]];
          
          if (checked && !currentArray.includes(item)) {
            return { ...prevData, [arrayName]: [...currentArray, item] };
          } else if (!checked && currentArray.includes(item)) {
            return { ...prevData, [arrayName]: currentArray.filter(i => i !== item) };
          }
          
          return prevData;
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePortfolioChange = (index, field, value) => {
    const updatedInputs = [...portfolioInputs];
    updatedInputs[index][field] = value;
    setPortfolioInputs(updatedInputs);
  };

  const addPortfolioInput = () => {
    setPortfolioInputs([...portfolioInputs, { asset: '', amount: '' }]);
  };

  const removePortfolioInput = (index) => {
    const updatedInputs = portfolioInputs.filter((_, i) => i !== index);
    setPortfolioInputs(updatedInputs);
  };

  const searchParams = useSearchParams();
  const user_id = searchParams.get('user_id');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Process existing portfolio if any
    let processedPortfolio = {};
    if (formData.hasExistingPortfolio) {
      portfolioInputs.forEach(item => {
        if (item.asset && item.amount) {
          processedPortfolio[item.asset] = parseFloat(item.amount);
        }
      });
    }

    // Prepare data to send to the backend
    const profileData = {
      user_id, 
      risk_tolerance: formData.riskTolerance,
      investment_amount: parseFloat(formData.investmentAmount) || 0,
      investment_currency: formData.investmentCurrency,
      investment_horizon: formData.investmentHorizon,
      experience_level: formData.experienceLevel,
      investment_goals: formData.investmentGoals,
      initial_investment: formData.hasExistingPortfolio ? processedPortfolio : null,
      income_source: formData.incomeSource,
      income_amount: formData.incomeAmount ? parseFloat(formData.incomeAmount) : 0,
      jurisdiction: formData.jurisdiction,
      preferred_activities: formData.preferredActivities,
    };

    console.log('Sending to backend:', profileData);

    try {
      // Send data to your backend
      const response = await DefaultService.generateStrategiesGenerateStrategyPost(profileData);
      console.log('Response from backend:', response);
      
      // Redirect to dashboard or results page
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('There was an error submitting your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>DeFi Assistant - Create Your Profile</title>
        <meta name="description" content="Personalized DeFi investment strategies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-black mb-2">DeFi Investment Assistant</h1>
            <p className="text-gray-500">Tell us about your investment goals and preferences to receive personalized DeFi strategies</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Risk Tolerance */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Risk Tolerance
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  name="riskTolerance"
                  value={formData.riskTolerance === 'conservative' ? 1 :
                    formData.riskTolerance === 'moderately_conservative' ? 2 :
                    formData.riskTolerance === 'moderate' ? 3 :
                    formData.riskTolerance === 'moderately_aggressive' ? 4 : 5}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const riskMap = {
                      1: 'conservative',
                      2: 'moderately_conservative',
                      3: 'moderate',
                      4: 'moderately_aggressive',
                      5: 'aggressive'
                    };
                    setFormData({ ...formData, riskTolerance: riskMap[val] });
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-2">Investment Amount</label>
                    <input
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Enter amount"
                      min="0.00001"
                      step="0.00001"
                      required
                      />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    name="investmentCurrency"
                    value={formData.investmentCurrency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="USD">USD</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
              </div>

              {/* Investment Horizon */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Investment Horizon</label>
                <select
                  name="investmentHorizon"
                  value={formData.investmentHorizon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  required
                >
                  <option value="short">Short-term (&lt; 1 year)</option>
                  <option value="medium">Medium-term (1-3 years)</option>
                  <option value="long">Long-term (3+ years)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <div className="flex flex-col space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={formData.experienceLevel === level}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black"
                      />
                      <span className="ml-2 capitalize">{level} ({level === 'beginner' ? 'No crypto experience' : level === 'intermediate' ? 'Some experience' : 'Experienced'})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Goals */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Investment Goals (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    ['passive_income', 'Passive Income'],
                    ['capital_growth', 'Capital Growth'],
                    ['wealth_preservation', 'Wealth Preservation'],
                    ['portfolio_diversification', 'Portfolio Diversification'],
                  ].map(([key, label]) => (
                    <label key={key} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={`investmentGoals-${key}`}
                        checked={formData.investmentGoals.includes(key)}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black"
                      />
                      <span className="ml-2">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Existing Portfolio */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="hasExistingPortfolio"
                    checked={formData.hasExistingPortfolio}
                    onChange={handleChange}
                    className="h-4 w-4 text-black focus:ring-black"
                  />
                  <label className="ml-2 block text-sm font-medium">
                    I already own cryptocurrency
                  </label>
                </div>

                {formData.hasExistingPortfolio && (
                  <div className="mt-3 pl-6 border-l border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">List your current holdings:</p>
                    {portfolioInputs.map((input, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                          <input
                            type="text"
                            placeholder="Asset (e.g., BTC)"
                            value={input.asset}
                            onChange={(e) => handlePortfolioChange(index, 'asset', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={input.amount}
                            onChange={(e) => handlePortfolioChange(index, 'amount', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                            min="0"
                            step="any"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removePortfolioInput(index)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPortfolioInput}
                      className="mt-2 text-sm text-black underline hover:text-gray-800"
                    >
                      + Add Another Asset
                    </button>
                  </div>
                )}
              </div>

              {/* Income Source */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Regular Contributions</label>
                <select
                  name="incomeSource"
                  value={formData.incomeSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="none">None</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>

                {formData.incomeSource !== 'none' && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Contribution Amount ({formData.investmentCurrency})</label>
                    <input
                      type="number"
                      name="incomeAmount"
                      value={formData.incomeAmount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Jurisdiction */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Country/Jurisdiction (Optional)</label>
                <select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">European Union</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Preferred DeFi Activities */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preferred DeFi Activities (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'staking',
                    'yield_farming',
                    'lending',
                    'liquidity_providing',
                    'trading',
                  ].map((activity) => (
                    <label key={activity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={`preferredActivities-${activity}`}
                        checked={formData.preferredActivities.includes(activity)}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black"
                      />
                      <span className="ml-2 capitalize">{activity.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Generate My DeFi Strategy'}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Your data is only used to generate personalized recommendations and is not stored or shared.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export function FormPage() {
  const searchParams = useSearchParams();
  const userid = searchParams.get('userid');

  return <div>User ID: {userid}</div>;
}
