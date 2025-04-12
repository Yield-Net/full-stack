import ExecuteStrategy from "@/components/ExecuteStrategy";

// Here make sure that the data is pulled dynamically from the DB and not static

const sampleStrategy = [
  {
    protocol: "Aave",
    activity: "lending",
    token: "USDC",
    allocation_percent: 60,
    expected_apy: 5.1,
    estimated_return: 30.6,
    risk_level: "low",
    why: "Safe lending option with decent yield",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Your DeFi Strategy</h1>

      <div className="bg-white rounded shadow p-4 border">
        <pre className="text-sm text-gray-800">{JSON.stringify(sampleStrategy[0], null, 2)}</pre>
      </div>

      <ExecuteStrategy strategy={sampleStrategy} />
    </div>
  );
}
