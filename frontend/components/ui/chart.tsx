'use client'

import { TooltipProps } from 'recharts'
import { ReactNode } from 'react'

export function ChartContainer({
  children,
  config,
}: {
  children: ReactNode
  config?: Record<string, { label: string; color: string }>
}) {
  return (
    <div
      className="w-full"
      style={{
        '--chart-1': config?.desktop?.color || '#4ade80',
        '--chart-2': config?.tablet?.color || '#facc15',
        '--chart-3': config?.mobile?.color || '#60a5fa',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
}: TooltipProps<any, any> & { hideLabel?: boolean }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded border bg-background p-2 shadow-sm text-sm min-w-[120px]">
      {!hideLabel && <p className="font-medium">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="text-muted-foreground">
          {entry.name}: {entry.value}%
        </div>
      ))}
    </div>
  )
}