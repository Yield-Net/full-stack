// pages/index.js
/* eslint-disable */

'use client';
import { useState } from 'react';
import Head from 'next/head';
import { DefaultService } from '@/src/api/services/DefaultService'

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
      risk_tolerance: formData.riskTolerance,
      investment_amount: parseFloat(formData.investmentAmount) || 0,
      investment_currency: formData.investmentCurrency,
      investment_horizon: formData.investmentHorizon,
      experience_level: formData.experienceLevel,
      investment_goals: formData.investmentGoals,
      existing_portfolio: formData.hasExistingPortfolio ? processedPortfolio : null,
      income_source: formData.incomeSource,
      income_amount: formData.incomeAmount ? parseFloat(formData.incomeAmount) : 0,
      jurisdiction: formData.jurisdiction,
      preferred_activities: formData.preferredActivities
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
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>DeFi Assistant - Create Your Profile</title>
        <meta name="description" content="Personalized DeFi investment strategies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">DeFi Investment Assistant</h1>
            <p className="text-gray-600">Tell us about your investment goals and preferences to receive personalized DeFi strategies</p>
          </div>

          <div className="bg-slate-600 rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit}>
              {/* Risk Tolerance */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Risk Tolerance
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    name="riskTolerance"
                    value={
                      formData.riskTolerance === 'conservative' ? 1 :
                      formData.riskTolerance === 'moderately_conservative' ? 2 :
                      formData.riskTolerance === 'moderate' ? 3 :
                      formData.riskTolerance === 'moderately_aggressive' ? 4 : 5
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const riskMap = {
                        1: 'conservative',
                        2: 'moderately_conservative',
                        3: 'moderate',
                        4: 'moderately_aggressive',
                        5: 'aggressive'
                      };
                      setFormData({...formData, riskTolerance: riskMap[val]});
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-200 mt-1">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-gray-200 font-medium mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-2">
                    Currency
                  </label>
                  <select
                    name="investmentCurrency"
                    value={formData.investmentCurrency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
              </div>

              {/* Investment Horizon */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Investment Horizon
                </label>
                <select
                  name="investmentHorizon"
                  value={formData.investmentHorizon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="short">Short-term (&lt; 1 year)</option>
                  <option value="medium">Medium-term (1-3 years)</option>
                  <option value="long">Long-term (3+ years)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Experience Level
                </label>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value="beginner"
                      checked={formData.experienceLevel === 'beginner'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Beginner (No crypto experience)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value="intermediate"
                      checked={formData.experienceLevel === 'intermediate'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Intermediate (Some experience)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value="advanced"
                      checked={formData.experienceLevel === 'advanced'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Advanced (Experienced)</span>
                  </label>
                </div>
              </div>

              {/* Investment Goals */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Investment Goals (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="investmentGoals-passive_income"
                      checked={formData.investmentGoals.includes('passive_income')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Passive Income</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="investmentGoals-capital_growth"
                      checked={formData.investmentGoals.includes('capital_growth')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Capital Growth</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="investmentGoals-wealth_preservation"
                      checked={formData.investmentGoals.includes('wealth_preservation')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Wealth Preservation</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="investmentGoals-portfolio_diversification"
                      checked={formData.investmentGoals.includes('portfolio_diversification')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Portfolio Diversification</span>
                  </label>
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 block text-gray-200 font-medium">
                    I already own cryptocurrency
                  </label>
                </div>

                {formData.hasExistingPortfolio && (
                  <div className="mt-3 pl-6 border-l-2 border-indigo-100">
                    <p className="text-sm text-gray-600 mb-2">List your current holdings:</p>
                    
                    {portfolioInputs.map((input, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                          <input
                            type="text"
                            placeholder="Asset (e.g., BTC)"
                            value={input.asset}
                            onChange={(e) => handlePortfolioChange(index, 'asset', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={input.amount}
                            onChange={(e) => handlePortfolioChange(index, 'amount', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                            min="0"
                            step="any"
                          />
                        </div>
                        
                        {index > 0 && (
                          <button 
                            type="button" 
                            onClick={() => removePortfolioInput(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addPortfolioInput}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Another Asset
                    </button>
                  </div>
                )}
              </div>

              {/* Income Sources */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Regular Contributions
                </label>
                <select
                  name="incomeSource"
                  value={formData.incomeSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                >
                  <option value="none">None</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>

                {formData.incomeSource !== 'none' && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Contribution Amount ({formData.investmentCurrency})
                    </label>
                    <input
                      type="number"
                      name="incomeAmount"
                      value={formData.incomeAmount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Jurisdiction */}
              <div className="mb-6">
                <label className="block text-gray-200 font-medium mb-2">
                  Country/Jurisdiction (Optional)
                </label>
                <select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label className="block text-gray-200 font-medium mb-2">
                  Preferred DeFi Activities (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredActivities-staking"
                      checked={formData.preferredActivities.includes('staking')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Staking</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredActivities-yield_farming"
                      checked={formData.preferredActivities.includes('yield_farming')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Yield Farming</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredActivities-lending"
                      checked={formData.preferredActivities.includes('lending')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Lending</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredActivities-liquidity_providing"
                      checked={formData.preferredActivities.includes('liquidity_providing')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Liquidity Providing</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredActivities-trading"
                      checked={formData.preferredActivities.includes('trading')}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Trading</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Generate My DeFi Strategy'}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your data is only used to generate personalized recommendations and is not stored or shared.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
