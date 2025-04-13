'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import { Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

// ✅ Vibrant colors (Tailwind style)
const COLORS = [
  '#4ade80', // green
  '#60a5fa', // blue
  '#facc15', // yellow
  '#f87171', // red
  '#a78bfa', // purple
  '#34d399', // emerald
]

export default function AllocationPieChart({ data }: { data: any[] }) {
  const isEmpty = !data || !data.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Protocol Allocation</CardTitle>
        <CardDescription>Based on strategy split (%)</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer className="mx-auto px-0">
          <div className="h-[250px] w-full">
            <ResponsiveContainer>
              <PieChart>
                {/* Only show tooltip if data exists */}
                {!isEmpty && (
                  <Tooltip content={<ChartTooltipContent />} />
                )}
                <Pie
                  data={isEmpty ? [] : data}
                  dataKey="allocation_percent"
                  nameKey="protocol"
                  outerRadius={100}
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                        fontSize={12}
                        className="font-medium"
                      >
                        {payload.allocation_percent}%
                      </text>
                    )
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Diversified across {data.length} protocol{data.length > 1 ? 's' : ''}{' '}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Strategy shown as % of total allocation
        </div>
      </CardFooter>
    </Card>
  )
}