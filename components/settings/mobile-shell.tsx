'use client'

import { ChevronLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface MobileShellProps {
  title: string
  subtitle?: string
  backHref?: string
  onBack?: () => void
  children: React.ReactNode
  actions?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'destructive'
  }[]
  headerAction?: React.ReactNode
  className?: string
}

export function MobileShell({
  title,
  subtitle,
  backHref,
  onBack,
  children,
  actions,
  headerAction,
  className
}: MobileShellProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      window.location.href = backHref
    }
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            {(backHref || onBack) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 -ml-2"
                onClick={handleBack}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            )}
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-foreground leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {headerAction}
            
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className={cn(
                        action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                      )}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-safe">
        {children}
      </main>
    </div>
  )
}
