'use client'

import { useState } from 'react'
import { Moon, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField } from './form-field'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { quietHoursConfig } from '@/lib/settings-data'
import type { QuietHours } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface QuietHoursScreenProps {
  onBack?: () => void
  onSave?: (config: QuietHours) => void
}

const daysOfWeek = [
  { id: 0, label: 'Sun', fullLabel: 'Sunday' },
  { id: 1, label: 'Mon', fullLabel: 'Monday' },
  { id: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { id: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { id: 4, label: 'Thu', fullLabel: 'Thursday' },
  { id: 5, label: 'Fri', fullLabel: 'Friday' },
  { id: 6, label: 'Sat', fullLabel: 'Saturday' }
]

export function QuietHoursScreen({ onBack, onSave }: QuietHoursScreenProps) {
  const [config, setConfig] = useState<QuietHours>(quietHoursConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleDay = (dayId: number) => {
    setConfig((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter((d) => d !== dayId)
        : [...prev.daysOfWeek, dayId].sort()
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowSuccess(true)

    if (onSave) {
      onSave(config)
    }

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const formatTimeRange = () => {
    if (!config.enabled) return 'Disabled'
    return `${config.startTime} - ${config.endTime}`
  }

  return (
    <MobileShell
      title="Quiet Hours"
      subtitle="Pause notifications"
      onBack={onBack}
      backHref="/settings/notifications"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Enable Toggle */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center',
              config.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              <Moon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Enable Quiet Hours</h3>
              <p className="text-sm text-muted-foreground">
                {formatTimeRange()}
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>
        </div>

        {config.enabled && (
          <>
            {/* Time Range */}
            <section className="space-y-4">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time Range
              </h2>
              
              <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={config.startTime}
                    onChange={(value) => setConfig((prev) => ({ ...prev, startTime: value }))}
                  />
                  
                  <FormField
                    label="End Time"
                    name="endTime"
                    type="time"
                    value={config.endTime}
                    onChange={(value) => setConfig((prev) => ({ ...prev, endTime: value }))}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Notifications will be silenced during this time
                </p>
              </div>
            </section>

            {/* Days Selection */}
            <section className="space-y-4">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Days
              </h2>
              
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex justify-between gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={cn(
                        'flex-1 h-12 rounded-xl text-sm font-medium transition-all',
                        config.daysOfWeek.includes(day.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                      aria-label={day.fullLabel}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {config.daysOfWeek.length === 7
                    ? 'Every day'
                    : config.daysOfWeek.length === 0
                    ? 'No days selected'
                    : `${config.daysOfWeek.length} days selected`}
                </p>
              </div>
            </section>

            {/* Urgent Override */}
            <section className="space-y-4">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Emergency Settings
              </h2>
              
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    config.bypassForUrgent
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="bypass-urgent"
                      className="font-medium text-foreground cursor-pointer"
                    >
                      Allow Urgent Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Emergency alerts will bypass quiet hours
                    </p>
                  </div>
                  <Switch
                    id="bypass-urgent"
                    checked={config.bypassForUrgent}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, bypassForUrgent: checked }))
                    }
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Preview */}
        {config.enabled && (
          <div className="bg-muted/50 rounded-2xl p-4 border border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Preview</h3>
            <p className="text-sm text-muted-foreground">
              Notifications will be silenced from{' '}
              <span className="font-medium text-foreground">{config.startTime}</span> to{' '}
              <span className="font-medium text-foreground">{config.endTime}</span> on{' '}
              <span className="font-medium text-foreground">
                {config.daysOfWeek.length === 7
                  ? 'every day'
                  : config.daysOfWeek.map((d) => daysOfWeek[d].label).join(', ')}
              </span>
              {config.bypassForUrgent && (
                <span>
                  . <span className="text-warning">Urgent notifications will still come through.</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="sticky bottom-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 rounded-xl text-base font-medium"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Saved Successfully
              </span>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
