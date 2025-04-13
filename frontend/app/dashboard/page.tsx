'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarChat from "@/components/ai/SidebarChat";
import { DefaultService } from '@/src/api/services/DefaultService';
import { DashboardResponse } from '@/src/api/models/DashboardResponse';

import StrategyMetrics from '@/components/strategyMetrics';
import AllocationPieChart from '@/components/allocationPieChart';
import APYBarChart from '@/components/APYBarChart';
import ProfileCard from '@/components/profileCard';

// Loading skeleton component for dashboard
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 bg-gray-200 w-1/3 rounded animate-pulse mb-4"></div>
      
      {/* ProfileCard skeleton */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 w-1/4 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* StrategyMetrics skeleton */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 w-1/4 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 border rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 w-1/2 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm h-64 flex items-center justify-center">
          <div className="rounded-full h-48 w-48 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm h-64">
          <div className="h-full flex items-end space-x-2 pt-8">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gray-200 rounded-t animate-pulse w-1/6" 
                style={{ height: `${Math.random() * 70 + 20}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chat skeleton */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 w-1/4 rounded mb-4"></div>
        <div className="h-48 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}

// Main dashboard content component
function DashboardContent() {
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

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-6"><div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div></div>;
  if (!dashboardData) return <div className="p-6"><div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">No data available.</div></div>;


  const portfolio = dashboardData.portfolio.map(({ asset, amount }) => ({
    asset,
    amount
  }));

  const profile = {
    experience_level: dashboardData.profile.experience_level,
    investment_amount: dashboardData.profile.investment_amount,
    investment_currency: dashboardData.profile.investment_currency,
    investment_goals: dashboardData.profile.investment_goals,
    investment_horizon: dashboardData.profile.investment_horizon,
    preferred_activities: dashboardData.profile.preferred_activities,
    risk_tolerance: dashboardData.profile.risk_tolerance
  };

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">DeFi Investment Dashboard</h1>

      <ProfileCard profile={profile} />
      
      <StrategyMetrics strategy={strategy} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AllocationPieChart data={strategy} />
        <APYBarChart data={strategy} />
      </div>
      <SidebarChat profile={profile} userId={userId} />
    </div>
  );
}

// Error Boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Caught error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>There was an error loading the dashboard. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}

// Main Dashboard component with Suspense boundary
export default function Dashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}
