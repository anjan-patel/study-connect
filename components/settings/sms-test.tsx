'use client'

import { useState } from 'react'
import { Send, CheckCircle2, XCircle, MessageSquare, Clock } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField, TextareaField } from './form-field'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SMSTestScreenProps {
  providerName?: string
  senderId?: string
  onBack?: () => void
}

type TestStatus = 'idle' | 'sending' | 'success' | 'error'

interface TestResult {
  status: TestStatus
  message?: string
  timestamp?: string
  messageId?: string
}

export function SMSTestScreen({ 
  providerName = 'MSG91',
  senderId = 'SCHLCN',
  onBack 
}: SMSTestScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [messageText, setMessageText] = useState(
    'This is a test message from School Connect. If you received this, SMS gateway is working correctly.'
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [testResult, setTestResult] = useState<TestResult>({ status: 'idle' })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid 10-digit Indian mobile number'
    }
    if (!messageText.trim()) {
      newErrors.messageText = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendTest = async () => {
    if (!validateForm()) return

    setTestResult({ status: 'sending' })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Random success/failure for demo
    const isSuccess = Math.random() > 0.2
    
    if (isSuccess) {
      setTestResult({
        status: 'success',
        message: 'Test SMS sent successfully!',
        timestamp: new Date().toLocaleTimeString(),
        messageId: `MSG${Date.now()}`
      })
    } else {
      setTestResult({
        status: 'error',
        message: 'Failed to send SMS. Please check your credentials.',
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }

  const characterCount = messageText.length
  const smsCount = Math.ceil(characterCount / 160)

  return (
    <MobileShell
      title="Test SMS"
      subtitle={`Using ${providerName}`}
      onBack={onBack}
      backHref="/settings/sms-provider"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Provider Info */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{providerName}</h3>
              <p className="text-sm text-muted-foreground">Sender ID: {senderId}</p>
            </div>
            <Badge variant="secondary">Test Mode</Badge>
          </div>
        </div>

        {/* Test Form */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Send Test SMS
          </h2>
          
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            <FormField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter 10-digit mobile number"
              required
              error={errors.phoneNumber}
              hint="Indian mobile number only"
            />
            
            <div className="space-y-2">
              <TextareaField
                label="Message"
                name="messageText"
                value={messageText}
                onChange={setMessageText}
                placeholder="Enter test message"
                required
                error={errors.messageText}
                rows={4}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{characterCount} characters</span>
                <span>{smsCount} SMS{smsCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Send Button */}
        <Button
          onClick={handleSendTest}
          disabled={testResult.status === 'sending'}
          className="w-full h-12 rounded-xl text-base font-medium"
        >
          {testResult.status === 'sending' ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Test SMS
            </span>
          )}
        </Button>

        {/* Test Result */}
        {testResult.status !== 'idle' && testResult.status !== 'sending' && (
          <div
            className={cn(
              'rounded-2xl p-4 border',
              testResult.status === 'success'
                ? 'bg-success/10 border-success/20'
                : 'bg-destructive/10 border-destructive/20'
            )}
          >
            <div className="flex items-start gap-3">
              {testResult.status === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={cn(
                  'text-sm font-medium',
                  testResult.status === 'success' ? 'text-success' : 'text-destructive'
                )}>
                  {testResult.status === 'success' ? 'Success' : 'Failed'}
                </h3>
                <p className={cn(
                  'text-sm mt-0.5',
                  testResult.status === 'success' ? 'text-success/80' : 'text-destructive/80'
                )}>
                  {testResult.message}
                </p>
                {testResult.messageId && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Message ID: {testResult.messageId}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {testResult.timestamp}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-muted/50 rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-1">Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>- Use your own number to receive the test SMS</li>
            <li>- SMS may take up to 30 seconds to arrive</li>
            <li>- Check spam folder if not received</li>
          </ul>
        </div>
      </div>
    </MobileShell>
  )
}
