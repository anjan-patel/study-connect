'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  Check, 
  ChevronRight, 
  Settings,
  Send,
  AlertCircle
} from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField } from './form-field'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { smsProviders as initialProviders } from '@/lib/settings-data'
import type { SMSProvider } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface SMSProviderScreenProps {
  onBack?: () => void
  onTestSMS?: () => void
}

// Provider colors for demo
const providerColors: Record<string, string> = {
  msg91: 'bg-green-600',
  twilio: 'bg-red-500',
  textlocal: 'bg-blue-500',
  gupshup: 'bg-orange-500'
}

export function SMSProviderScreen({ onBack, onTestSMS }: SMSProviderScreenProps) {
  const [providers, setProviders] = useState<SMSProvider[]>(initialProviders)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [configProvider, setConfigProvider] = useState<SMSProvider | null>(null)
  const [formData, setFormData] = useState({
    authKey: '',
    senderId: ''
  })

  const activeProvider = providers.find((p) => p.isActive)

  const setActiveProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === providerId
      }))
    )
  }

  const openConfig = (provider: SMSProvider) => {
    setConfigProvider(provider)
    setFormData({
      authKey: '',
      senderId: provider.senderId
    })
    setIsConfigOpen(true)
  }

  const handleSaveConfig = () => {
    if (configProvider) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === configProvider.id
            ? { ...p, senderId: formData.senderId }
            : p
        )
      )
    }
    setIsConfigOpen(false)
  }

  return (
    <MobileShell
      title="SMS Provider"
      subtitle="Configure SMS gateway"
      onBack={onBack}
      backHref="/settings"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Active Provider Summary */}
        {activeProvider && (
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold',
                providerColors[activeProvider.provider]
              )}>
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{activeProvider.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sender ID: {activeProvider.senderId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Provider Selection */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            SMS Providers
          </h2>

          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={cn(
                  'bg-card rounded-2xl border shadow-sm overflow-hidden',
                  provider.isActive ? 'border-primary' : 'border-border'
                )}
              >
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setActiveProvider(provider.id)}
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center text-white transition-opacity',
                      providerColors[provider.provider],
                      !provider.isActive && 'opacity-40'
                    )}
                  >
                    {provider.isActive ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <MessageSquare className="h-6 w-6" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{provider.name}</h3>
                      {provider.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sender ID: {provider.senderId}
                    </p>
                  </div>
                </div>
                
                {provider.isActive && (
                  <div className="border-t border-border px-4 py-3 bg-muted/30 flex items-center justify-between">
                    <button
                      onClick={() => openConfig(provider)}
                      className="flex items-center gap-2 text-sm text-primary font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      Configure
                    </button>
                    <button
                      onClick={onTestSMS}
                      className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                    >
                      <Send className="h-4 w-4" />
                      Test SMS
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Usage Info */}
        <div className="bg-muted/50 rounded-2xl p-4 border border-border">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground">SMS Credits</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Check your SMS provider dashboard for remaining credits and usage analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Configure {configProvider?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <FormField
              label="Auth Key / API Key"
              name="authKey"
              type="password"
              value={formData.authKey}
              onChange={(value) => setFormData((prev) => ({ ...prev, authKey: value }))}
              placeholder="Enter your API key"
              required
            />
            
            <FormField
              label="Sender ID"
              name="senderId"
              value={formData.senderId}
              onChange={(value) => setFormData((prev) => ({ ...prev, senderId: value }))}
              placeholder="6 character Sender ID"
              hint="Must be approved by your SMS provider"
            />
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsConfigOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} className="flex-1 rounded-xl">
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileShell>
  )
}
