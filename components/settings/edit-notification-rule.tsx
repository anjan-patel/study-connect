'use client'

import { useState } from 'react'
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle2, Users } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField, TextareaField, SelectField } from './form-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { notificationRules } from '@/lib/settings-data'
import type { NotificationRule, UserRole } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface EditNotificationRuleScreenProps {
  ruleId?: string
  onBack?: () => void
  onSave?: (rule: NotificationRule) => void
}

const eventOptions = [
  { value: 'student_absent', label: 'Student Absent' },
  { value: 'fee_due', label: 'Fee Due' },
  { value: 'exam_scheduled', label: 'Exam Scheduled' },
  { value: 'result_published', label: 'Result Published' },
  { value: 'homework_assigned', label: 'Homework Assigned' },
  { value: 'discipline_incident', label: 'Discipline Incident' },
  { value: 'transport_delay', label: 'Transport Delay' }
]

const channelOptions: { id: 'push' | 'sms' | 'email'; label: string; icon: React.ReactNode }[] = [
  { id: 'push', label: 'Push Notification', icon: <Smartphone className="h-5 w-5" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'email', label: 'Email', icon: <Mail className="h-5 w-5" /> }
]

const recipientOptions: { id: UserRole; label: string }[] = [
  { id: 'parent', label: 'Parents' },
  { id: 'teacher', label: 'Teachers' },
  { id: 'admin', label: 'Admins' }
]

export function EditNotificationRuleScreen({ 
  ruleId = '1',
  onBack, 
  onSave 
}: EditNotificationRuleScreenProps) {
  const existingRule = notificationRules.find((r) => r.id === ruleId)
  
  const [formData, setFormData] = useState({
    name: existingRule?.name || '',
    event: existingRule?.event || '',
    channels: existingRule?.channels || [],
    recipients: existingRule?.recipients || [],
    template: existingRule?.template || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleChannel = (channel: 'push' | 'sms' | 'email') => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const toggleRecipient = (recipient: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(recipient)
        ? prev.recipients.filter((r) => r !== recipient)
        : [...prev.recipients, recipient]
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required'
    }
    if (!formData.event) {
      newErrors.event = 'Event type is required'
    }
    if (formData.channels.length === 0) {
      newErrors.channels = 'Select at least one channel'
    }
    if (formData.recipients.length === 0) {
      newErrors.recipients = 'Select at least one recipient'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowSuccess(true)

    const updatedRule: NotificationRule = {
      id: ruleId || Date.now().toString(),
      name: formData.name,
      event: formData.event,
      channels: formData.channels,
      recipients: formData.recipients,
      template: formData.template,
      isEnabled: existingRule?.isEnabled ?? true
    }

    if (onSave) {
      onSave(updatedRule)
    }

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <MobileShell
      title={existingRule ? 'Edit Rule' : 'New Rule'}
      subtitle="Configure notification rule"
      onBack={onBack}
      backHref="/settings/notifications"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Basic Information
          </h2>
          
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            <FormField
              label="Rule Name"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Attendance Alert"
              required
              error={errors.name}
            />
            
            <SelectField
              label="Trigger Event"
              name="event"
              value={formData.event}
              onChange={(value) => setFormData((prev) => ({ ...prev, event: value }))}
              options={eventOptions}
              placeholder="Select event"
              required
              error={errors.event}
            />
          </div>
        </section>

        {/* Channels */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Notification Channels
          </h2>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {channelOptions.map((channel, index) => (
              <div
                key={channel.id}
                className={cn(
                  'flex items-center gap-4 p-4',
                  index < channelOptions.length - 1 && 'border-b border-border'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center',
                  formData.channels.includes(channel.id)
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {channel.icon}
                </div>
                <Label
                  htmlFor={`channel-${channel.id}`}
                  className="flex-1 font-medium cursor-pointer"
                >
                  {channel.label}
                </Label>
                <Checkbox
                  id={`channel-${channel.id}`}
                  checked={formData.channels.includes(channel.id)}
                  onCheckedChange={() => toggleChannel(channel.id)}
                />
              </div>
            ))}
          </div>
          {errors.channels && (
            <p className="text-xs text-destructive px-1">{errors.channels}</p>
          )}
        </section>

        {/* Recipients */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recipients
          </h2>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recipientOptions.map((recipient, index) => (
              <div
                key={recipient.id}
                className={cn(
                  'flex items-center gap-4 p-4',
                  index < recipientOptions.length - 1 && 'border-b border-border'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center',
                  formData.recipients.includes(recipient.id)
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  <Users className="h-5 w-5" />
                </div>
                <Label
                  htmlFor={`recipient-${recipient.id}`}
                  className="flex-1 font-medium cursor-pointer"
                >
                  {recipient.label}
                </Label>
                <Checkbox
                  id={`recipient-${recipient.id}`}
                  checked={formData.recipients.includes(recipient.id)}
                  onCheckedChange={() => toggleRecipient(recipient.id)}
                />
              </div>
            ))}
          </div>
          {errors.recipients && (
            <p className="text-xs text-destructive px-1">{errors.recipients}</p>
          )}
        </section>

        {/* Message Template */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Message Template (Optional)
          </h2>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <TextareaField
              label="Custom Message"
              name="template"
              value={formData.template}
              onChange={(value) => setFormData((prev) => ({ ...prev, template: value }))}
              placeholder="Use {student_name}, {date}, {class} as variables..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Leave empty to use default message template
            </p>
          </div>
        </section>

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
              'Save Rule'
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
