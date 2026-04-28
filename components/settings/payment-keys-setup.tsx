'use client'

import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField } from './form-field'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { PaymentKeys } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface PaymentKeysSetupScreenProps {
  gatewayName?: string
  gatewayProvider?: string
  onBack?: () => void
  onSave?: (keys: PaymentKeys) => void
}

export function PaymentKeysSetupScreen({ 
  gatewayName = 'Razorpay',
  gatewayProvider = 'razorpay',
  onBack, 
  onSave 
}: PaymentKeysSetupScreenProps) {
  const [formData, setFormData] = useState<PaymentKeys>({
    gateway: gatewayProvider,
    keyId: '',
    keySecret: '',
    webhookSecret: '',
    testMode: true
  })
  const [showSecret, setShowSecret] = useState(false)
  const [showWebhook, setShowWebhook] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.keyId.trim()) {
      newErrors.keyId = 'API Key ID is required'
    }
    if (!formData.keySecret.trim()) {
      newErrors.keySecret = 'API Secret is required'
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

    if (onSave) {
      onSave(formData)
    }

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const webhookUrl = 'https://your-school.edu.in/api/webhooks/razorpay'

  return (
    <MobileShell
      title={`${gatewayName} Setup`}
      subtitle="Configure API credentials"
      onBack={onBack}
      backHref="/settings/payment-gateway"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Mode Toggle */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center',
                formData.testMode
                  ? 'bg-warning/10 text-warning'
                  : 'bg-success/10 text-success'
              )}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Test Mode</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.testMode ? 'Using test credentials' : 'Using live credentials'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={formData.testMode ? 'secondary' : 'default'}>
                {formData.testMode ? 'Test' : 'Live'}
              </Badge>
              <Switch
                checked={!formData.testMode}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, testMode: !checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            API Credentials
          </h2>
          
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            <FormField
              label="API Key ID"
              name="keyId"
              value={formData.keyId}
              onChange={(value) => setFormData((prev) => ({ ...prev, keyId: value }))}
              placeholder={`Enter ${gatewayName} Key ID`}
              required
              error={errors.keyId}
              hint={formData.testMode ? 'Use test key starting with rzp_test_' : 'Use live key starting with rzp_live_'}
            />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                API Secret <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={formData.keySecret}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keySecret: e.target.value }))}
                  placeholder="Enter API Secret"
                  className={cn(
                    'w-full h-12 px-4 pr-12 rounded-xl border bg-background',
                    errors.keySecret
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-input focus:ring-ring'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.keySecret && (
                <p className="text-xs text-destructive">{errors.keySecret}</p>
              )}
            </div>
          </div>
        </section>

        {/* Webhook Configuration */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Webhook Configuration
          </h2>
          
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            {/* Webhook URL */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Webhook URL</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-12 px-4 rounded-xl border border-input bg-muted/50 flex items-center">
                  <code className="text-sm text-foreground truncate">{webhookUrl}</code>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl flex-shrink-0"
                  onClick={() => copyToClipboard(webhookUrl, 'url')}
                >
                  {copied === 'url' ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this URL in your {gatewayName} dashboard
              </p>
            </div>

            {/* Webhook Secret */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Webhook Secret (Optional)</Label>
              <div className="relative">
                <input
                  type={showWebhook ? 'text' : 'password'}
                  value={formData.webhookSecret || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, webhookSecret: e.target.value }))}
                  placeholder="Enter Webhook Secret"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-input bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhook(!showWebhook)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showWebhook ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Used to verify webhook signatures
              </p>
            </div>
          </div>
        </section>

        {/* Warning for Live Mode */}
        {!formData.testMode && (
          <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-destructive">Live Mode Active</h3>
                <p className="text-sm text-destructive/80 mt-0.5">
                  Real transactions will be processed. Make sure your credentials are correct.
                </p>
              </div>
            </div>
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
              'Save Credentials'
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
