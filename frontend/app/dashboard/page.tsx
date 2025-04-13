'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { DefaultService } from '@/src/api/services/DefaultService';
import { DashboardResponse } from '@/src/api/models/DashboardResponse';

import StrategyMetrics from '@/components/strategyMetrics';
import AllocationPieChart from '@/components/allocationPieChart';
import APYBarChart from '@/components/APYBarChart';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // ✅ prevent setting state after unmount

    if (!userId) {
      if (isMounted) {
        setError('No user ID provided');
        setLoading(false);
      }
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const data = await DefaultService.getDashboardDashboardGet(userId);
        if (isMounted) {
          setDashboardData(data);
          console.log('Dashboard data:', data);
        }
      } catch (err: any) {
        console.error(err);
        if (isMounted) setError('Failed to fetch dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [userId]); // ✅ only depend on userId

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboardData) return <p>No data available.</p>;

  console.log('test:', dashboardData.strategies);

  const strategy = dashboardData.strategies.map((item) => {
    return {
      protocol: item.strategy_data.protocol,
      activity: item.strategy_data.activity,
      token: item.strategy_data.token,
      allocation_percent: item.strategy_data.allocation_percent,
      expected_apy: item.strategy_data.expected_apy,
      estimated_return: item.strategy_data.estimated_return,
      risk_level: item.strategy_data.risk_level,
      why: item.strategy_data.why
    };
  });

  console.log('strategy:', strategy);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">DeFi Investment Dashboard</h1>

      <StrategyMetrics strategy={strategy} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AllocationPieChart data={strategy} />
        <APYBarChart data={strategy} />
      </div>
    </div>
  );
}