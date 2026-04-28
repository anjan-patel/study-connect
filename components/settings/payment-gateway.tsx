'use client'

import { useState } from 'react'
import { CreditCard, Check, ChevronRight, Settings, Shield } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { paymentGateways as initialGateways, paymentMethods as initialMethods } from '@/lib/settings-data'
import type { PaymentGateway, PaymentMethod } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface PaymentGatewayScreenProps {
  onBack?: () => void
  onConfigureKeys?: (gatewayId: string) => void
  onConfigureMethods?: () => void
}

// Gateway logos as colored boxes for demo
const gatewayColors: Record<string, string> = {
  razorpay: 'bg-blue-600',
  paytm: 'bg-sky-500',
  stripe: 'bg-indigo-600',
  cashfree: 'bg-green-600'
}

export function PaymentGatewayScreen({ 
  onBack, 
  onConfigureKeys,
  onConfigureMethods 
}: PaymentGatewayScreenProps) {
  const [gateways, setGateways] = useState<PaymentGateway[]>(initialGateways)
  const [methods] = useState<PaymentMethod[]>(initialMethods)

  const toggleGateway = (gatewayId: string) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === gatewayId ? { ...g, isActive: !g.isActive } : g
      )
    )
  }

  const setDefaultGateway = (gatewayId: string) => {
    setGateways((prev) =>
      prev.map((g) => ({
        ...g,
        isDefault: g.id === gatewayId,
        isActive: g.id === gatewayId ? true : g.isActive
      }))
    )
  }

  const activeGateway = gateways.find((g) => g.isDefault) || gateways.find((g) => g.isActive)
  const enabledMethods = methods.filter((m) => m.isEnabled)

  return (
    <MobileShell
      title="Payment Gateway"
      subtitle="Configure payment providers"
      onBack={onBack}
      backHref="/settings"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Active Gateway Summary */}
        {activeGateway && (
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold',
                gatewayColors[activeGateway.provider]
              )}>
                {activeGateway.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{activeGateway.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {enabledMethods.length} payment methods enabled
                </p>
              </div>
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}

        {/* Gateway Selection */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Payment Providers
          </h2>

          <div className="space-y-3">
            {gateways.map((gateway) => (
              <div
                key={gateway.id}
                className={cn(
                  'bg-card rounded-2xl border shadow-sm overflow-hidden',
                  gateway.isDefault ? 'border-primary' : 'border-border'
                )}
              >
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setDefaultGateway(gateway.id)}
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold transition-opacity',
                      gatewayColors[gateway.provider],
                      !gateway.isActive && 'opacity-40'
                    )}
                  >
                    {gateway.isDefault && (
                      <Check className="h-6 w-6" />
                    )}
                    {!gateway.isDefault && gateway.name.slice(0, 2).toUpperCase()}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{gateway.name}</h3>
                      {gateway.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {gateway.provider}
                    </p>
                  </div>
                  
                  <Switch
                    checked={gateway.isActive}
                    onCheckedChange={() => toggleGateway(gateway.id)}
                    disabled={gateway.isDefault}
                  />
                </div>
                
                {gateway.isActive && (
                  <div className="border-t border-border px-4 py-3 bg-muted/30">
                    <button
                      onClick={() => onConfigureKeys?.(gateway.id)}
                      className="flex items-center gap-2 text-sm text-primary font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      Configure API Keys
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods Link */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Payment Methods
          </h2>
          
          <button
            onClick={onConfigureMethods}
            className="w-full bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-foreground">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                {enabledMethods.length} of {methods.length} methods enabled
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>

        {/* Info Card */}
        <div className="bg-muted/50 rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-1">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            Contact support if you need assistance setting up payment gateways or obtaining API credentials.
          </p>
        </div>
      </div>
    </MobileShell>
  )
}
