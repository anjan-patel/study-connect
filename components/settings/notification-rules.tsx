'use client'

import { useState } from 'react'
import { Bell, BellOff, Plus, ChevronRight, Moon, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { SettingsToggleCard } from './settings-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { notificationRules as initialRules, quietHoursConfig } from '@/lib/settings-data'
import type { NotificationRule } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface NotificationRulesScreenProps {
  onBack?: () => void
  onEditRule?: (ruleId: string) => void
  onOpenQuietHours?: () => void
}

export function NotificationRulesScreen({ 
  onBack, 
  onEditRule, 
  onOpenQuietHours 
}: NotificationRulesScreenProps) {
  const [rules, setRules] = useState<NotificationRule[]>(initialRules)
  const [quietHours, setQuietHours] = useState(quietHoursConfig)

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
      )
    )
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'push':
        return <Smartphone className="h-3.5 w-3.5" />
      case 'sms':
        return <MessageSquare className="h-3.5 w-3.5" />
      case 'email':
        return <Mail className="h-3.5 w-3.5" />
      default:
        return <Bell className="h-3.5 w-3.5" />
    }
  }

  const getEventLabel = (event: string) => {
    const labels: Record<string, string> = {
      student_absent: 'Student Absent',
      fee_due: 'Fee Due',
      exam_scheduled: 'Exam Scheduled',
      result_published: 'Result Published',
      homework_assigned: 'Homework Assigned'
    }
    return labels[event] || event
  }

  const enabledCount = rules.filter((r) => r.isEnabled).length

  return (
    <MobileShell
      title="Notifications"
      subtitle={`${enabledCount} of ${rules.length} rules enabled`}
      onBack={onBack}
      backHref="/settings"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Quiet Hours */}
        <button
          onClick={onOpenQuietHours}
          className={cn(
            'w-full rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-colors',
            quietHours.enabled
              ? 'bg-primary/5 border-primary/20'
              : 'bg-card border-border'
          )}
        >
          <div className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center',
            quietHours.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          )}>
            <Moon className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">Quiet Hours</h3>
              <Badge variant={quietHours.enabled ? 'default' : 'secondary'} className="text-xs">
                {quietHours.enabled ? 'On' : 'Off'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {quietHours.enabled
                ? `${quietHours.startTime} - ${quietHours.endTime}`
                : 'No quiet hours set'}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Notification Rules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Notification Rules
            </h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Rule
            </Button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    rule.isEnabled
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {rule.isEnabled ? (
                      <Bell className="h-5 w-5" />
                    ) : (
                      <BellOff className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onEditRule?.(rule.id)}
                  >
                    <h3 className="font-medium text-foreground">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getEventLabel(rule.event)}
                    </p>
                  </div>
                  
                  <Switch
                    checked={rule.isEnabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
                
                {/* Channels & Recipients */}
                <div className="border-t border-border px-4 py-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {rule.channels.map((channel) => (
                        <div
                          key={channel}
                          className={cn(
                            'h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium',
                            rule.isEnabled
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {getChannelIcon(channel)}
                          <span className="capitalize">{channel}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => onEditRule?.(rule.id)}
                      className="text-xs text-primary font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No notification rules</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create rules to automate notifications
            </p>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
