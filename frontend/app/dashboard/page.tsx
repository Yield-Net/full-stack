'use client';
import ExecuteStrategy from "@/components/ExecuteStrategy";

import { useState } from 'react';
import StrategySelector from '@/components/strategySelector';
import AllocationPieChart from '@/components/allocationPieChart';
import APYBarChart from '@/components/APYBarChart';
import StrategyMetrics from '@/components/strategyMetrics';

// Sample strategies — you can replace this with a fetch from your backend
const strategies = {
  conservative: [
    {
      protocol: "Aave",
      activity: "lending",
      token: "USDC",
      allocation_percent: 100,
      expected_apy: 3.5,
      estimated_return: 11.62,
      risk_level: "low",
      why: "Stable and safe protocol"
    }
  ],
  balanced: [
    {
      protocol: "Aave",
      activity: "lending",
      token: "USDC",
      allocation_percent: 60,
      expected_apy: 5.1,
      estimated_return: 30.6,
      risk_level: "low",
      why: "Safe lending option"
    },
    {
      protocol: "Lido",
      activity: "staking",
      token: "ETH",
      allocation_percent: 40,
      expected_apy: 4.2,
      estimated_return: 20.1,
      risk_level: "medium",
      why: "Liquid staking"
    }
  ],
  aggressive: [
    {
      protocol: "GMX",
      activity: "staking",
      token: "ARB",
      allocation_percent: 100,
      expected_apy: 14.3,
      estimated_return: 47.5,
      risk_level: "high",
      why: "High yield, higher risk"
    }
  ]
};

export default function Dashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const strategyData = strategies[selectedStrategy];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">DeFi Investment Dashboard</h1>
      <StrategySelector onSelect={setSelectedStrategy} />

      <StrategyMetrics strategy={strategyData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AllocationPieChart data={strategyData} />
        <APYBarChart data={strategyData} />
      </div>
    </div>
  );
}