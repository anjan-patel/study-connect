'use client'

import { useState } from 'react'
import { 
  Smartphone, 
  CreditCard, 
  Building, 
  Wallet, 
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { paymentMethods as initialMethods } from '@/lib/settings-data'
import type { PaymentMethod } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface PaymentMethodsScreenProps {
  onBack?: () => void
  onSave?: (methods: PaymentMethod[]) => void
}

const methodIcons: Record<string, React.ReactNode> = {
  upi: <Smartphone className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  netbanking: <Building className="h-5 w-5" />,
  wallet: <Wallet className="h-5 w-5" />,
  emi: <Calendar className="h-5 w-5" />
}

const methodDescriptions: Record<string, string> = {
  upi: 'Google Pay, PhonePe, Paytm UPI',
  card: 'Visa, Mastercard, Rupay, Amex',
  netbanking: 'All major Indian banks',
  wallet: 'Paytm, Mobikwik, Freecharge',
  emi: 'No-cost EMI on select cards'
}

export function PaymentMethodsScreen({ onBack, onSave }: PaymentMethodsScreenProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleMethod = (methodId: string) => {
    setMethods((prev) =>
      prev.map((m) =>
        m.id === methodId ? { ...m, isEnabled: !m.isEnabled } : m
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowSuccess(true)

    if (onSave) {
      onSave(methods)
    }

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const enabledCount = methods.filter((m) => m.isEnabled).length

  return (
    <MobileShell
      title="Payment Methods"
      subtitle={`${enabledCount} methods enabled`}
      onBack={onBack}
      backHref="/settings/payment-gateway"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Info Banner */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground">Payment Methods</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Enable the payment methods you want to offer to parents. At least one method must be enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Methods List */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {methods.map((method, index) => (
            <div
              key={method.id}
              className={cn(
                'flex items-center gap-4 p-4',
                index < methods.length - 1 && 'border-b border-border'
              )}
            >
              <div className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center',
                method.isEnabled
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}>
                {methodIcons[method.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'font-medium',
                  method.isEnabled ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {method.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {methodDescriptions[method.type]}
                </p>
              </div>
              
              <Switch
                checked={method.isEnabled}
                onCheckedChange={() => toggleMethod(method.id)}
                disabled={method.isEnabled && enabledCount <= 1}
              />
            </div>
          ))}
        </div>

        {/* Popular Methods */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recommended for Schools
          </h2>
          
          <div className="bg-muted/50 rounded-2xl p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">UPI is Most Popular</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Over 80% of parents prefer UPI for fee payments. Consider keeping it enabled for the best experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || enabledCount === 0}
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
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
