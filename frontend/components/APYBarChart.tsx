'use client'

import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'

import { TrendingUp } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// 🌈 Real vibrant risk-based colors
const riskBarColor = {
  low: '#16a34a',     // green-600
  medium: '#facc15',  // yellow-400
  high: '#ef4444',    // red-500
}

export default function APYBarChart({ data }: { data: any[] }) {
  // Recharts wants one array with all bars, not map-over-Bar
  const chartData = data.map((item) => ({
    ...item,
    fill: riskBarColor[item.risk_level] || '#6b7280', // fallback: gray-500
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>APY by Protocol</CardTitle>
        <CardDescription>Yield comparison by risk level</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 30 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="protocol"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                unit="%"
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="expected_apy"
                radius={[8, 8, 0, 0]}
                name="APY (%)"
                label={{ position: 'top', fill: '#6b7280', fontSize: 12 }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none items-center">
          Highest APY: {getHighestAPY(data)}% <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <div className="leading-none text-muted-foreground">
          Colored by protocol risk level
        </div>
      </CardFooter>
    </Card>
  )
}

function getHighestAPY(data: any[]) {
  return Math.max(...data.map((d) => d.expected_apy)).toFixed(1)
}